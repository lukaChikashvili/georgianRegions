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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.slice(page * postsPerPage - postsPerPage, page * postsPerPage).map((value) => (
          <div key={value._id} className="group bg-[#121212] border border-white/10 p-8 flex flex-col justify-between rounded-2xl transition-all duration-500 hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-[#D4AF37]/5">
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-[#D4AF37]/70">
                <span>{value.category}</span>
                <span>/</span>
                <time>
                  {value._creationTime ? new Date(value._creationTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recently'}
                </time>
              </div>
              <h2 className="text-xl font-serif italic text-white leading-tight group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                {value.title}
              </h2>
              <p className="text-gray-400 leading-relaxed text-sm line-clamp-3 font-light">
                {value.body}
              </p>
            </div>

            <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
              <span className="text-[10px] uppercase tracking-widest text-white/30">{value.authorName}</span>
              <Link href={`/blog/${value._id}`} className="text-[10px] uppercase tracking-widest text-[#D4AF37] flex items-center gap-2 hover:gap-4 transition-all">
                წაკითხვა
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {posts.length > 0 && (
        <div className="mt-16 flex items-center justify-center gap-4">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="p-3 border border-white/10 text-white/50 hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-20 transition-all rounded-full"
          >
            <ArrowLeft size={16} />
          </button>

          <div className="flex items-center gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              const isActive = page === pageNum;
              return (
                <button
                  key={i}
                  onClick={() => changePage(pageNum)}
                  className={`w-9 h-9 text-[11px] transition-all duration-300 rounded-full ${
                    isActive
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'border border-white/10 text-white/50 hover:border-white/30'
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
            className="p-3 border border-white/10 text-white/50 hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:opacity-20 transition-all rounded-full"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default Blog