"use client";

import { ArrowDown } from "lucide-react";

const Hero = () => {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0D0D0F] selection:bg-[#D4AF37] selection:text-black"
      aria-label="Hero"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 30% 50%, #1A150F 0%, #111114 55%, #0D0D0F 100%)',
      }}
    >

      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none blur-3xl opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
        }}
      />

 
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        }}
      />

  
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pt-32 pb-24 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
      
        <div className="max-w-2xl text-left flex flex-col items-start">
          
    
          <div
            className="flex items-center gap-3 mb-8 animate-fade-in"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            <div className="w-8 h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent opacity-80" />
            <span className="text-xs tracking-widest uppercase text-[#D4AF37]/90 font-medium font-sans">
              სამუდამო ხსოვნის სივრცე
            </span>
          </div>

        
          <h1
            className="w-full text-5xl md:text-6xl lg:text-7xl font-light text-[#FFF5D6] leading-[1.2] mb-6 tracking-wide font-serif"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            მიაგეთ პატივი.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D6] via-[#D4AF37] to-[#AA7C11] font-light italic pr-2">
              სამუდამო
            </span>
            ხსოვნას.
          </h1>

          <p
            className="font-sans text-sm md:text-base text-gray-400 font-light leading-relaxed max-w-lg mb-10"
            style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
          >
            EverTribute არის მშვიდი და სათუთი სივრცე, სადაც ოჯახებს შეუძლიათ შექმნან სამუდამო ციფრული მემორიალები — ადგილი ერთად შეკრებისთვის, მოსაგონებლად და იმ ადამიანების ისტორიების გასაზიარებლად, რომელთა ჩანაცვლებაც შეუძლებელია.
          </p>

      
          <div
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
          >
            <button className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:brightness-110 shadow-lg hover:shadow-[#D4AF37]/10 active:scale-[0.99] cursor-pointer">
              შექმენი მემორიალი
            </button>
            <a 
              href="#how-it-works" 
              className="px-8 py-3.5 rounded-xl bg-[#121214]/40 border border-white/5 backdrop-blur-md text-gray-300 font-medium text-sm tracking-wider uppercase text-center transition-all duration-300 hover:bg-white/5 hover:text-white hover:border-[#D4AF37]/30 active:scale-[0.99]"
            >
              როგორ მუშაობს?
            </a>
          </div>

    
          <p
            className="mt-8 font-sans text-xs text-gray-500/80 tracking-wide"
            style={{ animationDelay: '1000ms', animationFillMode: 'forwards' }}
          >
            დაწყება უფასოა &nbsp;&middot;&nbsp; რეგისტრაციის გარეშე &nbsp;&middot;&nbsp; ნაგულისხმევად პირადი
          </p>
        </div>

        </div>
        
    </section>
  );
};

export default Hero;