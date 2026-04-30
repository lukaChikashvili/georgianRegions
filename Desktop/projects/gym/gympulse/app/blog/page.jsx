import React from 'react'
import Link from 'next/link' 
import { fetchQuery } from 'convex/nextjs'
import { api } from "@/convex/_generated/api";
import { ArrowRight, Plus } from 'lucide-react';

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

       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {allPosts.map((value) => (
            <div key={value._id} className="group bg-white rounded-3xl border border-gray-100 p-8 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-[#F3E8FF]/40 flex flex-col justify-between">
              
              <div className="space-y-4">
                 
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="text-[#9333EA] font-semibold">Community</span>
                      <span>·</span>
                      <time dateTime={value._creationTime ? new Date(value._creationTime).toISOString() : new Date().toISOString()}>
                          {value._creationTime ? new Date(value._creationTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) : 'Recently'}
                      </time>
                  </div>

              
                  <h2 className="text-2xl font-bold tracking-tight text-[#1D1E2C] leading-tight group-hover:text-[#7C3AED] transition-colors line-clamp-2">
                    {value.title}
                  </h2>
                  
                
                  <p className="text-gray-600 leading-relaxed text-base line-clamp-3">
                    {value.body}
                  </p>
              </div>

            
              <div className="mt-8 flex items-center justify-between pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    
                      <img src="/placeholder-avatar.png" alt="Author" className="h-10 w-10 rounded-full border border-gray-200" />
                      <span className="text-sm font-medium text-gray-700">Team Gympulse</span>
                  </div>
                  
                 
                  <Link href={`/blogs/${value._id}`} className="text-sm font-semibold text-[#7C3AED] flex items-center gap-2 group-hover:gap-3 transition-all">
                      Read full story
                     <ArrowRight size = {15} />
                  </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AllBlogs