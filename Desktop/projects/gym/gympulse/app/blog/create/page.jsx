"use client"
import React, { useState, useTransition } from 'react';
import { ImagePlus, Send, Type, AlignLeft, Hash } from 'lucide-react';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import ProtectedRoutes from '../../../components/ProtectedRoutes';

const CreateBlog = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
 
    const createPost = useMutation(api.posts.createPost);
    const [isPending, startTransition] = useTransition();
    const {user, isLoaded} = useUser();
    const router = useRouter();

    if (!isLoaded) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        startTransition(async () => {
            try {
                await createPost({
                    title: title,
                    body: content,
                    category: category,
                    authorName: user?.fullName
                });
                router.push('/blog');
            } catch (error) {
                console.error("შეცდომა:", error);
                alert("გამოქვეყნება ვერ მოხერხდა.");
            }
        });
    }

    return (
        <ProtectedRoutes>
        <div className="min-h-screen bg-[#0A0A0A] py-20 px-6 mt-6">
            <div className="max-w-4xl mx-auto">
                
                <div className="mb-12 border-b border-[#D4AF37]/30 pb-8">
                    <h2 className="text-4xl font-serif italic text-white tracking-wide">
                        ახალი ისტორიის დამატება
                    </h2>
                    <p className="text-[#D4AF37]/70 mt-2 font-medium tracking-widest uppercase text-xs">
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
                            className="w-full bg-[#121212] border border-white/10 px-6 py-4 text-white placeholder:text-white/20 focus:border-[#D4AF37] outline-none transition-all text-xl rounded-2xl"
                        />
                        
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={12}
                            placeholder="დაწერეთ თქვენი მოგონება..."
                            className="w-full bg-[#121212] border border-white/10 p-6 text-white placeholder:text-white/20 focus:border-[#D4AF37] outline-none transition-all rounded-2xl resize-none"
                        />
                    </div>

                
                    <div className="space-y-8">
                        
                        <div className="border border-white/10 p-6 rounded-2xl bg-[#121212]">
                            <label className="text-[10px] uppercase tracking-widest text-white/50 mb-4 block">მთავარი ფოტო</label>
                            <div className="aspect-square bg-[#0A0A0A] border border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-[#D4AF37] transition-all rounded-xl group">
                                <ImagePlus className="w-6 h-6 text-white/20 group-hover:text-[#D4AF37]" />
                                <span className="text-[10px] text-white/30 mt-2">ატვირთვა</span>
                            </div>
                        </div>

                        <div className="bg-[#121212] border border-white/10 p-6 rounded-2xl">
                            <label className="text-[10px] uppercase tracking-widest text-white/50 mb-2 block flex items-center gap-2">
                                <Hash size={12} /> კატეგორია
                            </label>
                            <input 
                                type="text"
                                placeholder="მაგ: მემუარი" 
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full bg-[#0A0A0A] border border-white/10 px-4 py-3 text-white focus:border-[#D4AF37] outline-none text-sm rounded-xl"
                            />
                        </div>

                        <button 
                            type="submit"
                            disabled={isPending}
                            className="w-full py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs hover:bg-[#AA7C11] transition-all disabled:opacity-50 rounded-full"
                        >
                            {isPending ? "იგზავნება..." : "გამოქვეყნება"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </ProtectedRoutes>
    );
};

export default CreateBlog;