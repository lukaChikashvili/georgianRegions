"use client"
import React, { useState, useTransition } from 'react';
import { ImagePlus, Send, Type, AlignLeft, Hash, Eye } from 'lucide-react';
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const CreateBlog = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
  
    const createPost = useMutation(api.posts.createPost);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
    
        startTransition(async () => {
            try {
                await createPost({
                    title: title,
                    body: content,
                });
                
                
                setTitle("");
                setContent("");
                alert("ბლოგი წარმატებით გამოქვეყნდა!");
            } catch (error) {
                console.error("შეცდომა:", error);
                alert("გამოქვეყნება ვერ მოხერხდა.");
            }
        });
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-white to-purple-50/50 py-12 px-6">
            <div className="max-w-5xl mx-auto">
                
              
                <div className="mb-10 text-center lg:text-left">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                        ახალი ბლოგის <span className="text-purple-600">შექმნა</span>
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium">
                        გაუზიარეთ თქვენი გამოცდილება და სიახლეები ფიტნეს საზოგადოებას.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                   
                    <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-purple-100/50 space-y-6">
                         
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Type className="w-4 h-4 text-purple-500" /> სათაური
                                </label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="მაგ: როგორ დავიწყოთ სწორი ვარჯიში..."
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-transparent focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 text-slate-800 font-medium"
                                />
                            </div>

                            
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <AlignLeft className="w-4 h-4 text-purple-500" /> კონტენტი
                                </label>
                                <textarea 
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={10}
                                    placeholder="დაწერეთ თქვენი ბლოგის შინაარსი აქ..."
                                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-transparent focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-200 text-slate-800 resize-none"
                                />
                            </div>
                        </div>
                    </form>

                    <div className="space-y-6">
                        
                       
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-purple-100/50">
                            <label className="text-sm font-bold text-slate-700 mb-4 block">მთავარი ფოტო</label>
                            <div className="group cursor-pointer relative aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300">
                                <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    <ImagePlus className="w-6 h-6 text-purple-600" />
                                </div>
                                <span className="text-xs font-bold text-slate-400 mt-3 tracking-wide">ფოტოს ატვირთვა</span>
                                <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>

                   
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-purple-100/50 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                    <Hash className="w-4 h-4 text-purple-500" /> კატეგორია
                                </label>
                                <select className="w-full px-4 py-3 rounded-xl bg-slate-50 border-transparent outline-none text-slate-600 font-medium appearance-none">
                                    <option>ვარჯიში</option>
                                    <option>კვება</option>
                                    <option>მოტივაცია</option>
                                    <option>სიახლეები</option>
                                </select>
                            </div>
                        </div>

                      
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={handleSubmit}
                                disabled={isPending}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-purple-600 transition-all shadow-lg shadow-slate-200 hover:shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-4 h-4" /> 
                                {isPending ? "ქვეყნდება..." : "გამოქვეყნება"}
                            </button>
                            <button className="w-full py-4 bg-white text-slate-600 border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                                <Eye className="w-4 h-4" /> ნახვა
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateBlog;