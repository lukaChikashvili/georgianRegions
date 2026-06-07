"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";

const Hero = () => {
  const sectionRef = useRef(null);

  const taglineRef = useRef(null);
  const headingRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const subRef = useRef(null);

  const bannerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(
        [
          taglineRef.current,
          headingRef.current,
          descRef.current,
          ctaRef.current,
          subRef.current,
        ],
        { opacity: 0, y: 36 }
      );

      gsap.set(bannerRef.current, { opacity: 0, scale: 1.05 });

      const tl = gsap.timeline({ delay: 0.1 });

      tl.to(taglineRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      })
        .to(
          headingRef.current,
          { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
          "-=0.5"
        )
        .to(
          descRef.current,
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.5"
        )
        .to(
          ctaRef.current,
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.5"
        )
        .to(
          subRef.current,
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        )
        .to(
          bannerRef.current,
          { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
          "-=1"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#0D0D0F] selection:bg-[#D4AF37] selection:text-black"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 30% 50%, #1A150F 0%, #111114 55%, #0D0D0F 100%)",
      }}
    >
      
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none blur-3xl opacity-60 bg-[radial-gradient(circle,rgba(212,175,55,0.08)_0%,transparent_70%)]" />

      
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 256 256%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.04%22/%3E%3C/svg%3E')]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pt-32 pb-24 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        
        <div className="max-w-2xl flex flex-col items-start lg:w-1/2">

          
          <div ref={taglineRef} className="flex items-center gap-3 mb-8">
            <div className="w-8 h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent" />
            <span className="text-xs tracking-widest uppercase text-[#D4AF37]/90">
              სამუდამო ხსოვნის სივრცე
            </span>
          </div>

       
          <h1
            ref={headingRef}
            className="text-5xl md:text-6xl lg:text-7xl font-light text-[#FFF5D6] leading-[1.2] mb-6 tracking-wide"
          >
            მიაგეთ პატივი.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D6] via-[#D4AF37] to-[#AA7C11] italic">
              სამუდამო
            </span>{" "}
            ხსოვნას.
          </h1>

         
          <p
            ref={descRef}
            className="text-sm md:text-base text-gray-400 font-light leading-relaxed max-w-lg mb-10"
          >
            GoldenMemorial.ge არის მშვიდი და სათუთი სივრცე, სადაც ოჯახებს
            შეუძლიათ შექმნან სამუდამო ციფრული მემორიალები — ადგილი ერთად
            შეკრებისთვის, მოსაგონებლად და ისტორიების გასაზიარებლად.
          </p>

          
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/memorial"
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-sm uppercase text-center"
            >
              შექმენი მემორიალი
            </Link>

            <a
              href="#how-it-works"
              className="px-8 py-3.5 rounded-xl bg-[#121214]/40 border border-white/5 backdrop-blur-md text-gray-300 text-sm uppercase text-center hover:text-white hover:border-[#D4AF37]/30"
            >
              როგორ მუშაობს?
            </a>
          </div>

         
          <p
            ref={subRef}
            className="mt-8 text-xs text-gray-500/80 tracking-wide"
          >
            დაწყება უფასოა · რეგისტრაციის გარეშე · ნაგულისხმევად პირადი
          </p>
        </div>

        
        <div className="lg:w-1/2 flex justify-center lg:justify-end">
          <div ref={bannerRef} className="relative w-full max-w-2xl">
            <Image
              src="/banner.png"
              alt="Golden Memorial Banner"
              width={900}
              height={900}
              priority
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;