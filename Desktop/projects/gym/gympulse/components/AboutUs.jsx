"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const AboutUs = () => {
  const sectionRef = useRef(null);
  const taglineRef = useRef(null);
  const headingRef = useRef(null);
  const p1Ref = useRef(null);
  const p2Ref = useRef(null);
  const dividerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      gsap.fromTo(
        [taglineRef.current, headingRef.current],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.18,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

     
      gsap.fromTo(
        dividerRef.current,
        { scaleX: 0, transformOrigin: "left center" },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "power2.inOut",
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );

   
      gsap.fromTo(
        [p1Ref.current, p2Ref.current],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.85,
          ease: "power2.out",
          stagger: 0.2,
          delay: 0.25,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
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
      className="py-28 bg-[#0D0D0F] relative overflow-hidden border-t border-white/5"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,175,55,0.03),transparent_50%)]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:items-center">

          <div className="lg:col-span-5">
           
            <div
              ref={dividerRef}
              className="w-10 h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent mb-5"
            />

            <span
              ref={taglineRef}
              className="text-xs tracking-widest uppercase text-[#D4AF37]/90 font-medium font-sans"
            >
              ჩვენი ფილოსოფია
            </span>

            <h2
              ref={headingRef}
              className="text-3xl md:text-5xl font-light text-[#FFF5D6] font-serif leading-[1.3] mt-4"
            >
              მოგონებები, რომლებიც <br />
              <span className="italic text-[#D4AF37]">არასოდეს</span> ქრებიან.
            </h2>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6 font-sans text-base text-gray-400 font-light leading-relaxed">
            <p ref={p1Ref}>
              ციფრულ ეპოქაში ჩვენ გვჯერა, რომ საყვარელი ადამიანების ხსოვნა
              განსაკუთრებულ, მშვიდ და დაცულ სივრცეს იმსახურებს. GoldenMemorial
              შეიქმნა იმისთვის, რომ დაგეხმაროთ ტრადიციული პატივისცემისა და
              თანამედროვე ტექნოლოგიების გაერთიანებაში.
            </p>
            <p ref={p2Ref}>
              ჩვენი მიზანია, შევამსუბუქოთ დაშორების ტკივილი და შევქმნათ
              მარადიული კერა, სადაც თაობები შეძლებენ გაეცნონ თავიანთ წინაპრებს,
              წაიკითხონ მათი ისტორიები და იგრძნონ კავშირი საკუთარ ფესვებთან.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;