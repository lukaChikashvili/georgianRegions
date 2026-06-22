import React from 'react'
import Link from 'next/link' 
import { fetchQuery } from 'convex/nextjs'
import { api } from "@/convex/_generated/api";
import { Plus, BookOpen } from 'lucide-react';
import Blog from '../../components/Blog';

const AllBlogs = async () => {
    
    const allPosts = await fetchQuery(api.posts.getPosts);

  return (
    <div className="bg-[#0A0A0A] text-gray-200 min-h-screen mt-6">
      <div className="max-w-5xl mx-auto px-6 py-20">
        
      
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#D4AF37]/30 pb-10 mb-16 gap-6">
          <div>
             <div className="inline-flex items-center gap-2 text-[#c1a362] mb-4 uppercase tracking-[0.2em] text-[10px] font-bold">
                <BookOpen size={14} />
              GoldenMemorial.ge
             </div>
             <h1 className="text-5xl font-serif italic text-white leading-tight">
               ცხოვრების ისტორიები
             </h1>
             <p className="mt-4 text-gray-400 max-w-lg">
              მოყევით გარდაცვლილი ადამიანის მოგონება, ისტორია
             </p>
          </div>
            
           <Link 
             href="/blog/create" 
             className="button  px-8 py-3 rounded-sm font-medium flex items-center gap-3 hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
           >
              <Plus size={18} /> დაწერე ისტორია
           </Link>
        </div>

        <Blog posts={allPosts} />
      
      </div>
    </div>
  )
}

export default AllBlogs