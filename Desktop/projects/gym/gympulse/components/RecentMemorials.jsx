"use client"

import { api } from "@/convex/_generated/api";
import {  useQuery } from "convex/react";
import { ArrowRight, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";

export const RecentMemorials = () => {
   
   const memorials = useQuery(api.memorials.getAllPublicMemorials);

   const recentMemorials = memorials 
    ? [...memorials].reverse().slice(0, 3) 
    : [];

  
    return (
        <section className="py-24 bg-[#0D0D0F] relative border-t border-white/5 selection:bg-[#D4AF37] selection:text-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
         
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-16">
            <div>
              <span className="text-xs tracking-widest uppercase text-[#D4AF37]/90 font-medium font-sans">
                მემორიალები
              </span>
              <h2 className="text-3xl md:text-4xl font-light text-[#FFF5D6] font-serif mt-3">
                ბოლო მოგონებები
              </h2>
            </div>
            <Link 
              href="/discover" 
              className="mt-4 sm:mt-0 text-xs tracking-widest uppercase text-[#D4AF37] border-b border-[#D4AF37]/30 pb-1 hover:border-[#D4AF37] transition-all flex items-center gap-1 group w-fit"
            >
              ყველას ნახვა <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
  
        
          {memorials === undefined ? (
          
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div 
                  key={n} 
                  className="aspect-[4/5] w-full rounded-2xl bg-[#121214]/20 border border-white/5 animate-pulse" 
                />
              ))}
            </div>
          ) : recentMemorials.length > 0 ? (
           
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentMemorials.map((memorial) => {
                const birthYear = memorial.birthDate?.split('-')[0] || "—";
                const deathYear = memorial.deathDate?.split('-')[0] || "—";
  
                return (
                  <Link 
                    href={`/discover/${memorial.urlSlug}`} 
                    key={memorial._id} 
                    className="group block relative overflow-hidden rounded-2xl bg-[#121214]/30 border border-white/5 transition-all duration-500 hover:border-[#D4AF37]/20 hover:-translate-y-1"
                  >
                   
                    <div className="aspect-[4/5] w-full overflow-hidden relative bg-[#0D0D0F]">
                      {memorial.mainPortraitUrl ? (
                        <img 
                          src={memorial.mainPortraitUrl} 
                          alt={`${memorial.firstName} ${memorial.lastName}`} 
                          className="object-cover w-full h-full scale-100 group-hover:scale-105 transition-transform duration-700 ease-out grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-80" 
                        />
                      ) : (
                        
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-600 bg-white/[0.02] gap-2">
                          <Sparkles size={24} className="opacity-40 text-[#D4AF37]" />
                          <span className="text-xs font-sans font-light tracking-wide opacity-40">მოგონება</span>
                        </div>
                      )}
                      
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F] via-[#0D0D0F]/40 to-transparent" />
                    </div>
  
                 
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <div className="flex items-center gap-1.5 text-xs text-[#D4AF37]/80 font-sans tracking-wider mb-2">
                        <Calendar size={12} className="opacity-70" />
                        <span>{birthYear} — {deathYear}</span>
                      </div>
                      
                      <h3 className="text-xl font-light text-[#FFF5D6] font-serif tracking-wide group-hover:text-white transition-colors">
                        {memorial.firstName} {memorial.lastName}
                      </h3>
  
                      {memorial.epitaph && (
                        <p className="text-[11px] text-gray-400 font-serif italic mt-2 line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                          "{memorial.epitaph}"
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            
            <div className="text-center py-16 bg-[#121214]/10 rounded-2xl border border-white/5 max-w-md mx-auto">
              <p className="text-gray-500 text-sm font-light">აქტიური საჯარო მემორიალები ჯერ არ არის შექმნილი.</p>
            </div>
          )}
  
        </div>
      </section>
    );
  };