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
        
        <div className="max-w-2xl">
          
          <div
            className="flex items-center gap-3 mb-8 animate-fade-in"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            <div className="w-8 h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent opacity-80" />
            <span className="font-sans text-xs tracking-widest uppercase text-[#D4AF37]/90 font-medium">
              A place of lasting remembrance
            </span>
          </div>

       
          <h1
            className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-[#FFF5D6] leading-[1.15] mb-6 tracking-wide"
            style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
          >
            Honor a life
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D6] via-[#D4AF37] to-[#AA7C11] font-light italic pr-2">
              beautifully
            </span>
            <br />
            <span className="font-extralight text-gray-400/80">forever.</span>
          </h1>

       
          <p
            className="font-sans text-sm md:text-base text-gray-400 font-light leading-relaxed max-w-lg mb-10"
            style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
          >
            EverTribute is a gentle, dignified space where families create lasting online memorials — a place to gather, remember, and share the story of someone irreplaceable.
          </p>

          
          <div
            className="flex flex-col sm:flex-row gap-4"
            style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}
          >
            <button className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-sm tracking-wider uppercase transition-all duration-300 hover:brightness-110 shadow-lg hover:shadow-[#D4AF37]/10 active:scale-[0.99]">
              Begin a Tribute
            </button>
            <a 
              href="#how-it-works" 
              className="px-8 py-3.5 rounded-xl bg-[#121214]/40 border border-white/5 backdrop-blur-md text-gray-300 font-medium text-sm tracking-wider uppercase text-center transition-all duration-300 hover:bg-white/5 hover:text-white hover:border-[#D4AF37]/30 active:scale-[0.99]"
            >
              See How It Works
            </a>
          </div>

        
          <p
            className="mt-8 font-sans text-xs text-gray-500/80 tracking-wide"
            style={{ animationDelay: '1000ms', animationFillMode: 'forwards' }}
          >
            Free to begin &nbsp;&middot;&nbsp; No account required &nbsp;&middot;&nbsp; Private by default
          </p>
        </div>

    
        <div className="hidden lg:block relative w-[380px] h-[480px] rounded-2xl bg-gradient-to-b from-[#161619]/60 to-[#0F0F12]/90 border border-white/[0.04] p-8 shadow-2xl backdrop-blur-lg group overflow-hidden">
  
          <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-[#D4AF37]/10 rounded-tr-2xl pointer-events-none group-hover:border-[#D4AF37]/30 transition-colors duration-700" />
          
          <div className="w-full h-full flex flex-col justify-between relative z-10">
          
            <div className="w-10 h-10 rounded-full border border-[#D4AF37]/20 flex items-center justify-center bg-[#0D0D0F]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
            </div>

           
            <div className="space-y-4">
              <div className="w-16 h-[1px] bg-[#D4AF37]/30" />
              <p className="font-serif text-xl italic text-gray-300 font-light leading-relaxed">
                "To live in hearts we leave behind is not to die."
              </p>
              <p className="font-sans text-xs tracking-widest uppercase text-[#D4AF37]/60">
                — Thomas Campbell
              </p>
            </div>
          </div>

          <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#AA7C11]/5 rounded-full blur-2xl pointer-events-none" />
        </div>

      </div>


      <div 
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-10" 
        style={{ background: 'linear-gradient(to bottom, transparent, #0D0D0F)' }} 
      />

     
      <a
        href="#how-it-works"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-gray-500 hover:text-[#D4AF37] transition-colors duration-300 group"
        aria-label="Scroll to learn more"
      >
        <span className="font-sans text-[10px] tracking-widest uppercase transition-colors group-hover:text-gray-300">Scroll</span>
        <ArrowDown size={14} className="animate-bounce text-[#D4AF37]/70 group-hover:text-[#D4AF37]" />
      </a>
    </section>
  );
};

export default Hero;