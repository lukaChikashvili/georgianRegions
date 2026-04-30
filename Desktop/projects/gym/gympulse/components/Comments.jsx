"use client"
import { useMutation, useQuery } from 'convex/react';
import React, { useState } from 'react'
import { api } from "@/convex/_generated/api";
import { useUser } from '@clerk/nextjs';
import { Send } from 'lucide-react';

const  Comments =  ({ postId }) => {
    const [comment, setComment] = useState('');

    const createComments = useMutation(api.comments.createComment);
    const { user, isLoaded } = useUser();

    

    const getComments = useQuery(api.comments.getComments, { postId });

    if (!getComments) return <p className='mt-6'>იტვირთება კომენტარები...</p>;
  

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
    <div>
       <section className="bg-white p-8 md:p-10 shadow-sm border mt-12 border-gray-100 rounded-4xl">
          <h3 className="text-2xl font-bold text-purple-600 mb-2">კომენტარები</h3>
          <p className="text-gray-500 mb-8">გაგვიზიარე შენი აზრი ამ პოსტის შესახებ</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="relative">
              <textarea 
                rows={4}
                value = {comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-5 bg-[#F8F9FA] border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all outline-none text-gray-700 placeholder:text-gray-400"
                placeholder="დაწერე კომენტარი..."
              />
            </div>
            
            <div className="flex justify-end ">
              <button 
                type="submit"
                
                className="flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-[#1E293B] transition-all active:scale-95 shadow-lg shadow-gray-200"
              >
                გამოქვეყნება
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

        
          
          <div className="mt-8 space-y-4">
  {getComments.length === 0 ? (
    <p className="text-gray-400">დატოვე კომენტარი...</p>
  ) : (
    getComments.map((c) => (
      <div key={c._id} className="p-4 bg-gray-50 border-[0.5px] border-purple-300  shadow-lg rounded-xl">
        
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">
            {c.authorName?.charAt(0)}
          </div>

          <span className="font-semibold text-sm">
            {c.authorName}
          </span>
        </div>

        <p className="text-gray-700">{c.body}</p>
      </div>
    ))
  )}
</div>
           
      
        </section>
    </div>
  )
}

export default Comments
