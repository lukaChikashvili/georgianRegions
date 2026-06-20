"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    image: "/banner2.png",
    eyebrow: "სამუდამო ხსოვნის სივრცე",
    title: "მიაგეთ პატივი",
    titleGold: "სამუდამოდ",
    subtitle: "შექმენით ციფრული მემორიალი წუთებში — სამუდამოდ თქვენი.",
    ctaText: "შექმენი მემორიალი",
    ctaLink: "/memorial",
  },
  {
    image: "/banner3.png",
    eyebrow: "ოჯახური მემკვიდრეობა",
    title: "გაიხსენეთ",
    titleGold: "ერთად",
    subtitle: "მოიწვიეთ ახლობლები მოგონებების გასაზიარებლად.",
    ctaText: "აღმოაჩინე მემორიალები",
    ctaLink: "/discover",
  },
  {
    image: "/banner4.png",
    eyebrow: "3D ვირტუალური სასაფლაო",
    title: "ინდივიდუალური",
    titleGold: "ხსოვნა",
    subtitle: "შექმენით უნიკალური ციფრული ძეგლი.",
    ctaText: "დაიწყე დიზაინი",
    ctaLink: "/grave",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [next, isPaused]);

  return (
    <section
      className="relative w-full h-[100svh] min-h-[400px] overflow-hidden bg-[#0D0D0F]"
      aria-label="Hero slideshow"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
     
      {slides.map((slide, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
          aria-hidden={i !== current}
        >
          <Image
            src={slide.image}
            alt=""
            fill
            priority={i === 0}
            className="object-cover"
          />
         
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(13,13,15,0.75) 0%, rgba(13,13,15,0.35) 40%, rgba(13,13,15,0.85) 100%)",
            }}
          />
        </div>
      ))}

      
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        }}
      />


      <div className="relative z-10 h-full flex items-center px-6 md:px-12">
        <div className="max-w-2xl">
          {slides.map((slide, i) => (
            <div
              key={i}
              className="transition-opacity duration-700 ease-in-out"
              style={{
                opacity: i === current ? 1 : 0,
                position: i === current ? "relative" : "absolute",
                pointerEvents: i === current ? "auto" : "none",
              }}
              aria-hidden={i !== current}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-gradient-to-r from-[#D4AF37] to-transparent opacity-80" />
                <span className="text-xs tracking-widest uppercase text-[#D4AF37]/90 font-medium">
                  {slide.eyebrow}
                </span>
              </div>

              <h1
                className="font-serif text-[#FFF5D6] font-light leading-[1.1] tracking-wide mb-5"
                style={{ fontSize: "clamp(2.25rem, 6vw + 1rem, 4.5rem)" }}
              >
                {slide.title}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5D6] via-[#D4AF37] to-[#AA7C11] italic">
                  {slide.titleGold}
                </span>
              </h1>

              <p className="text-sm md:text-base text-gray-300 font-light leading-relaxed max-w-md mb-8">
                {slide.subtitle}
              </p>

              <Link href={slide.ctaLink}>
                <button className="button2">{slide.ctaText}</button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`სლაიდი ${i + 1}`}
            className="h-1.5 rounded-full transition-all duration-300"
            style={{
              width: i === current ? "28px" : "8px",
              backgroundColor:
                i === current ? "#D4AF37" : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;