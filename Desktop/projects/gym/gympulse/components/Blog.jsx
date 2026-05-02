"use client"
import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'

const Blog = ({ posts }) => {
  const [page, setPage] = useState(1);
  const postsPerPage = 6;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const changePage = (selectedPage) => {
    setPage(selectedPage);
   window.scrollTo({ top: 0, behavior: 'smooth' }); 
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 -mt-12">
        {posts.slice(page * postsPerPage - postsPerPage, page * postsPerPage).map((value) => (
          <div key={value._id} className="group bg-white rounded-3xl border border-gray-100 p-8 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-[#F3E8FF]/40 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="text-[#9333EA] font-semibold">{value.category}</span>
                <span>·</span>
                <time>
                  {value._creationTime ? new Date(value._creationTime).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recently'}
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
              <span className="text-sm font-medium text-gray-700 italic">{value.authorName}</span>
              <Link href={`/blog/${value._id}`} className="text-sm font-semibold text-[#7C3AED] flex items-center gap-2 group-hover:gap-3 transition-all">
                იხილეთ სრულად
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        ))}
      </div>

  
      {posts.length > 0 && (
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
         
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-[#7C3AED] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all duration-200"
          >
            <ArrowLeft size={20} />
          </button>

    
          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              const isActive = page === pageNum;

              return (
                <button
                  key={i}
                  onClick={() => changePage(pageNum)}
                  className={`w-10 h-10 rounded-xl font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#7C3AED] text-white shadow-lg shadow-[#7C3AED]/30'
                      : 'bg-white border border-gray-100 text-gray-600 hover:border-[#7C3AED] hover:text-[#7C3AED]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

         
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-[#7C3AED] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500 transition-all duration-200"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  )
}

export default Blog