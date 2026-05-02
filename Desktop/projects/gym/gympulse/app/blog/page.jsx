

import React from 'react'
import Link from 'next/link' 
import { fetchQuery } from 'convex/nextjs'
import { api } from "@/convex/_generated/api";
import { ArrowRight, Plus } from 'lucide-react';
import Blog from '../../components/Blog';





const AllBlogs = async () => {
    
    const allPosts = await fetchQuery(api.posts.getPosts);

  
 



  return (
    <div className="bg-white text-[#1D1E2C] min-h-screen">
 
      <div className="max-w-350 mx-auto px-6 py-12 md:px-12 lg:px-24">
        
    
        <div className="flex items-center justify-between border-b border-gray-200 pb-10 mb-16">
          <div>
             <span className="inline-flex items-center gap-2 rounded-full bg-[#FAF5FF] px-3 py-1 text-xs font-medium text-[#7C3AED] ring-1 ring-inset ring-[#F3E8FF]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9333EA] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C3AED]"></span>
                </span>
                Gympulse Insights
             </span>
             <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-[#1D1E2C] sm:text-6xl">ფიტნეს ბლოგი</h1>
          </div>
           
      
           <Link href="/blog/create" className="bg-purple-600 text-white px-8 py-3.5 rounded-xl font-semibold flex items-center gap-3 transition-transform hover:scale-105">
              <Plus />  შექმენი ახალი პოსტი
           </Link>
        </div>

           <Blog posts = {allPosts} />
      
      </div>
    </div>
  )
}

export default AllBlogs