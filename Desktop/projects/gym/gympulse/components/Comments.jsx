"use client"
import { useMutation, useQuery } from 'convex/react';
import React, { useState } from 'react'
import { api } from "@/convex/_generated/api";
import { useUser } from '@clerk/nextjs';
import { Send } from 'lucide-react';

const Comments = ({ postId }) => {
    const [comment, setComment] = useState('');
    const createComments = useMutation(api.comments.createComment);
    const { user } = useUser();
    const getComments = useQuery(api.comments.getComments, { postId });

    if (!getComments) return <p className='mt-6 text-white/30 text-xs italic'>იტვირთება...</p>;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user || !comment) return;
        await createComments({
          postId,
          body: comment,
          authorId: user.id,
          authorName: user?.fullName,
        });
        setComment("");
    };

    return (
        <div className="w-full">
            <section className="bg-[#121212] border border-white/10 p-8 md:p-10 mt-12 rounded-2xl">
                <h3 className="text-2xl font-serif italic text-white mb-2">კომენტარები</h3>
                <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]/70 mb-8">გაგვიზიარე შენი აზრი ამ ისტორიის შესახებ</p>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <textarea 
                        rows={4}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-5 bg-[#0A0A0A] border border-white/10 rounded-2xl focus:border-[#D4AF37] transition-all outline-none text-white placeholder:text-white/20 text-sm"
                        placeholder="დაწერე კომენტარი..."
                    />
                    
                    <div className="flex justify-end">
                        <button 
                            type="submit"
                            className="flex items-center gap-2 bg-[#D4AF37] text-black px-8 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest hover:bg-[#AA7C11] transition-all active:scale-95"
                        >
                            გამოქვეყნება
                            <Send className="w-3 h-3" />
                        </button>
                    </div>
                </form>

                <div className="mt-12 space-y-4">
                    {getComments.length === 0 ? (
                        <p className="text-[10px] uppercase tracking-widest text-white/20 italic text-center py-4">კომენტარები არ არის</p>
                    ) : (
                        getComments.map((c) => (
                            <div key={c._id} className="p-6 bg-[#0A0A0A] border border-white/5 rounded-2xl">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] flex items-center justify-center text-[10px] font-bold">
                                        {c.authorName?.charAt(0)}
                                    </div>
                                    <span className="font-semibold text-sm text-white/80">
                                        {c.authorName}
                                    </span>
                                </div>
                                <p className="text-white/60 text-sm font-light leading-relaxed">{c.body}</p>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    )
}

export default Comments