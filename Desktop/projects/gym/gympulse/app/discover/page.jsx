"use client";

import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { Search, MapPin, Calendar, ArrowRight, Sparkles, CandlestickChart, Flame } from 'lucide-react';
import Link from 'next/link';

const Discover = () => {

  const memorials = useQuery(api.memorials.getAllPublicMemorials);
  const [searchQuery, setSearchQuery] = useState('');

  
  const filteredMemorials = memorials?.filter((memorial) => {
    const fullName = `${memorial.firstName} ${memorial.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-gray-300 font-sans py-20 px-6 relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      

      <div className="absolute top-0 left-1/4 w-150 h-150 rounded-full pointer-events-none blur-3xl opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)' }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10 mt-4">
        
 
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-6 h-px bg-linear-to-r from-transparent to-[#D4AF37] opacity-60" />
            <span className="text-xs tracking-widest uppercase text-[#D4AF37]/90 font-medium">
              გარდაცვლილთა ისტორიები
            </span>
            <div className="w-6 h-px bg-linear-to-l from-transparent to-[#D4AF37] opacity-60" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-[#FFF5D6] tracking-wide">
            მარადიული ხსოვნის არქივი
          </h1>
          <p className="text-sm text-gray-400 font-light leading-relaxed">
            აღმოაჩინეთ წარსული ცხოვრების კვალი, წაიკითხეთ და გააზიარეთ იმ ადამიანების ისტორიები, რომლებმაც წარუშლელი კვალი დატოვეს ჩვენს გულებში.
          </p>
        </div>

    
        <div className="max-w-md mx-auto mb-16 relative group">
          <input
            type="text"
            placeholder="მოძებნეთ სახელით ან გვარით..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121214]/40 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-gray-200 outline-none transition-all focus:border-[#D4AF37]/40 focus:bg-[#121214]/60 focus:shadow-[0_0_15px_rgba(212,175,55,0.05)] placeholder:text-gray-600 font-light"
          />
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
        </div>


        {memorials === undefined ? (
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-[#121214]/20 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredMemorials && filteredMemorials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMemorials.map((memorial) => (
              <Link 
                href={`/discover/${memorial.urlSlug}`} 
                key={memorial._id}
                className="group relative flex flex-col justify-between h-[420px] rounded-2xl bg-gradient-to-b from-[#161619]/40 to-[#0F0F12]/80 border border-white/[0.04] p-6 shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-[#D4AF37]/20 hover:-translate-y-1"
              >
              
                <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-transparent rounded-tr-2xl pointer-events-none group-hover:border-[#D4AF37]/10 transition-colors duration-500" />
                
                <div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full p-[1px] bg-gradient-to-b from-white/10 to-transparent group-hover:from-[#D4AF37]/40 transition-all duration-500">
                      <div className="w-full h-full rounded-full overflow-hidden bg-[#0D0D0F]">
                        {memorial.mainPortraitUrl ? (
                          <img 
                            src={memorial.mainPortraitUrl} 
                            alt={memorial.firstName} 
                            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600 bg-white/5">
                            <Sparkles size={16} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <h2 className="font-serif text-xl text-[#FFF5D6] tracking-wide group-hover:text-[#D4AF37] transition-colors duration-300">
                        {memorial.firstName} {memorial.lastName}
                      </h2>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-light mt-0.5">
                        <Calendar size={12} className="text-[#D4AF37]/60" />
                        <span>{memorial.birthDate.split('-')[0]} – {memorial.deathDate.split('-')[0]}</span>
                      </div>
                    </div>
                  </div>

                 
                  <p className="text-xs text-gray-400 italic font-serif line-clamp-2 border-l border-[#D4AF37]/20 pl-3 mb-4 leading-relaxed">
                    "{memorial.epitaph}"
                  </p>

                 
                  <p className="text-xs text-gray-500 font-light line-clamp-4 leading-relaxed">
                    {memorial.biography}
                  </p>


                  <div className='flex mt-6'>
                     <p className='flex items-center gap-2'><Flame /> {memorial.candleCount}</p>
                  </div>
                </div>

               
                <div className="mt-6 pt-4 border-t border-white/[0.03] flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-light">
                    <MapPin size={12} className="text-gray-600" />
                    <span>{memorial.location}</span>
                  </div>
                  
                  <span className="text-[10px] tracking-widest uppercase text-[#D4AF37]/70 font-medium flex items-center gap-1 group-hover:text-[#FFF5D6] transition-colors">
                    ისტორია <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
        
          <div className="text-center py-20 bg-[#121214]/10 rounded-2xl border border-white/5 max-w-xl mx-auto">
            <p className="text-gray-500 text-sm font-light">მითითებული სახელით მემორიალი ვერ მოიძებნა.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Discover;