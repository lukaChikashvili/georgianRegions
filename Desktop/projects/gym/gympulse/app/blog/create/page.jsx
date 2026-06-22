"use client"
import React, { useState, useTransition, useRef } from 'react';
import { ImagePlus, Send, Hash, X, Loader2 } from 'lucide-react';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import ProtectedRoutes from '../../../components/ProtectedRoutes';

const CreateBlog = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const createPost = useMutation(api.posts.createPost);
    const generateUploadUrl = useMutation(api.posts.generateUploadUrl);
    const [isPending, startTransition] = useTransition();
    const { user, isLoaded } = useUser();
    const router = useRouter();

    if (!isLoaded) return null;

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                let imageId = undefined;

                if (imageFile) {
                    setIsUploading(true);
                    const uploadUrl = await generateUploadUrl();
                    const result = await fetch(uploadUrl, {
                        method: "POST",
                        headers: { "Content-Type": imageFile.type },
                        body: imageFile,
                    });
                    if (!result.ok) throw new Error("სურათის ატვირთვა ვერ მოხერხდა");
                    const { storageId } = await result.json();
                    imageId = storageId;
                    setIsUploading(false);
                }

                await createPost({
                    title,
                    body: content,
                    category,
                    authorName: user?.fullName ?? "",
                    authorId: user?.id ?? "",
                    imageId,
                });
                router.push('/blog');
            } catch (error) {
                console.error("შეცდომა:", error);
                alert("გამოქვეყნება ვერ მოხერხდა.");
                setIsUploading(false);
            }
        });
    };

    const isLoading = isPending || isUploading;

    return (
        <ProtectedRoutes>
            <div className="min-h-screen bg-[#0A0A0A] py-20 px-6 mt-6">
                <div className="max-w-4xl mx-auto">

                    <div className="mb-12 border-b border-[#c1a362]/30 pb-8">
                        <h2 className="text-4xl font-serif italic text-white tracking-wide">
                            ახალი ისტორიის დამატება
                        </h2>
                        <p className="text-[#c1a362]/70 mt-2 font-medium tracking-widest uppercase text-xs">
                            გააზიარეთ მოგონება, რომელიც უკვდავია.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        <div className="lg:col-span-2 space-y-6">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="ისტორიის სათაური..."
                                required
                                className="w-full bg-[#121212] border border-white/10 px-6 py-4 text-white placeholder:text-white/20 focus:border-[#D4AF37] outline-none transition-all text-xl rounded-2xl"
                            />
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={12}
                                required
                                placeholder="დაწერეთ თქვენი მოგონება..."
                                className="w-full bg-[#121212] border border-white/10 p-6 text-white placeholder:text-white/20 focus:border-[#D4AF37] outline-none transition-all rounded-2xl resize-none"
                            />
                        </div>

                        <div className="space-y-8">

                          
                            <div className="border border-white/10 p-6 rounded-2xl bg-[#121212]">
                                <label className="text-[10px] uppercase tracking-widest text-white/50 mb-4 block">
                                    მთავარი ფოტო
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="blog-image-upload"
                                />
                                {imagePreview ? (
                                    <div className="relative aspect-square rounded-xl overflow-hidden">
                                        <img
                                            src={imagePreview}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleRemoveImage}
                                            className="absolute top-2 right-2 bg-black/70 rounded-full p-1 hover:bg-red-600 transition-colors"
                                        >
                                            <X size={14} className="text-white" />
                                        </button>
                                    </div>
                                ) : (
                                    <label
                                        htmlFor="blog-image-upload"
                                        className="aspect-square bg-[#0A0A0A] border border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37] transition-all rounded-xl group"
                                    >
                                        <ImagePlus className="w-6 h-6 text-white/20 group-hover:text-[#c1a362]" />
                                        <span className="text-[10px] text-white/30 mt-2">ატვირთვა</span>
                                    </label>
                                )}
                            </div>

                     
                            <div className="bg-[#121212] border border-white/10 p-6 rounded-2xl">
                                <label className="text-[10px] uppercase tracking-widest text-white/50 mb-2 flex items-center gap-2">
                                    <Hash size={12} /> კატეგორია
                                </label>
                                <input
                                    type="text"
                                    placeholder="მაგ: მემუარი"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full bg-[#0A0A0A] border border-white/10 px-4 py-3 text-white focus:border-[#c1a362] outline-none text-sm rounded-xl"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="button2 w-full py-4 bg-[#c1a362] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#AA7C11] transition-all disabled:opacity-50 rounded-full flex items-center justify-center gap-2"
                            >
                                {isLoading && <Loader2 size={14} className="animate-spin" />}
                                {isUploading ? "იტვირთება..." : isPending ? "იგზავნება..." : "გამოქვეყნება"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ProtectedRoutes>
    );
};

export default CreateBlog;