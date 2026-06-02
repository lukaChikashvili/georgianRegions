"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";

export const Footer = () => {

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-[#0A0A0C] border-t border-white/5 py-12 font-sans relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        
    
        <div className="flex flex-col items-center md:items-start gap-1">
          <span className="font-serif text-base tracking-wider text-[#FFF5D6] font-light">
            Golden<span className="text-[#D4AF37]">Memorial</span>
          </span>
          <span className="text-[10px] text-gray-500 font-light">
            სამუდამო ციფრული ხსოვნის სივრცე
          </span>
        </div>

       
        <div className="flex flex-wrap justify-center gap-8 text-xs font-light text-gray-500">
          <Link href="/discover" className="hover:text-[#D4AF37] transition-colors">არქივი</Link>
          <Link href="/grave" className="hover:text-[#D4AF37] transition-colors">3D მემორიალი</Link>
          <Link href="#how-it-works" className="hover:text-[#D4AF37] transition-colors">ინსტრუქცია</Link>
          <span className="cursor-pointer hover:text-[#D4AF37] transition-colors">კონფიდენციალურობა</span>
        </div>

        
        <div className="flex flex-col-reverse sm:flex-row items-center gap-6 md:gap-8">
          <div className="text-[10px] text-gray-600 tracking-wide font-light text-center md:text-right">
            &copy; 2026 GoldenMemorial. ყველა უფლება დაცულია.
          </div>

          
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="w-9 h-9 rounded-full bg-[#121214] border border-white/5 flex items-center justify-center text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 hover:bg-[#1A150F] hover:shadow-[0_0_15px_rgba(212,175,55,0.05)] transition-all duration-300 active:scale-95 group"
          >
            <ArrowUp size={14} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
          </button>
        </div>

      </div>
    </footer>
  );
};