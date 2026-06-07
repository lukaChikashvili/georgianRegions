"use client";

import { useEffect, useRef } from "react";
import { Heart, UserPlus, Share2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const HowItWorks = () => {
  const sectionRef = useRef(null);
  const taglineRef = useRef(null);
  const headingRef = useRef(null);
  const cardsRef = useRef([]);

  const steps = [
    {
      icon: <UserPlus className="w-6 h-6 text-[#D4AF37]" />,
      title: "შექმენით პროფილი",
      description: "შეიყვანეთ ძირითადი ინფორმაცია, სახელი, ცხოვრების წლები და ატვირთეთ მთავარი ფოტო სულ რამდენიმე წამში.",
    },
    {
      icon: <Heart className="w-6 h-6 text-[#D4AF37]" />,
      title: "გააცოცხლეთ მოგონებები",
      description: "დაამატეთ ბიოგრაფია, ფოტოგალერეა, ისტორიები და საყვარელი მუსიკა, რომელიც მათ პიროვნებას ასახავს.",
    },
    {
      icon: <Share2 className="w-6 h-6 text-[#D4AF37]" />,
      title: "გააზიარეთ ოჯახთან",
      description: "მოიწვიეთ ახლობლები მოგონებების გასაზიარებლად, სანთლის დასანთებად და სამძიმრის წერილების დასატოვებლად.",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
     
      gsap.fromTo(
        [taglineRef.current, headingRef.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: taglineRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

   
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: cardsRef.current[0],
            start: "top 82%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="py-24 bg-[#0D0D0F] relative border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span
            ref={taglineRef}
            className="text-xs tracking-widest uppercase text-[#D4AF37]/90 font-medium font-sans"
          >
            პროცესი
          </span>
          <h2
            ref={headingRef}
            className="text-3xl md:text-4xl font-light text-[#FFF5D6] font-serif mt-3"
          >
            როგორ მუშაობს GoldenMemorial?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="relative group p-8 rounded-2xl bg-[#121214]/30 border border-white/5 backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/20"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1A150F] border border-[#D4AF37]/20 flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-light text-[#FFF5D6] font-serif mb-3">
                {step.title}
              </h3>
              <p className="text-sm font-sans text-gray-400 font-light leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};