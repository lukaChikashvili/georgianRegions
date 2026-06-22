"use client";

import React, { useState } from 'react';
import { Mail, Phone, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [result, setResult] = useState("idle");

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("sending");

    const formData = new FormData(event.currentTarget);
   
    formData.append("access_key", process.env.WEB3FORMS_ACCESS_KEY);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setResult("success");
        event.currentTarget.reset(); 
      } else {
        setResult("error");
      }
    } catch (error) {
      setResult("error");
    }
  };

  return (
    <section className="py-24 bg-[#0D0D0F] relative border-t border-white/5 selection:bg-[#c1a362] selection:text-black">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
      
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs tracking-widest uppercase text-[#c1a362]/90 font-medium font-sans">
              კონტაქტი
            </span>
            <h2 className="text-3xl font-light text-[#FFF5D6] font-serif tracking-wide">
              ჩვენ ყოველთვის აქ ვართ დასახმარებლად
            </h2>
            <p className="font-sans text-sm text-gray-400 font-light leading-relaxed">
              თუ გაქვთ შეკითხვები პლატფორმის მუშაობასთან, მემორიალის შექმნასთან ან 3D დიზაინის ინტეგრაციასთან დაკავშირებით, მოგვწერეთ და ჩვენი გუნდი უმოკლეს დროში დაგიკავშირდებათ.
            </p>

            <div className="space-y-4 pt-4 font-sans text-xs tracking-wide text-gray-400 font-light">
              <div className="flex items-center gap-3 group">
                <Mail size={14} className="text-[#c1a362]/80 group-hover:text-[#c1a362] transition-colors" />
                <span className="hover:text-gray-300 transition-colors">support@goldenmemorial.ge</span>
              </div>
              
              
            </div>
          </div>

    
          <div className="lg:col-span-7 bg-[#121214]/20 border border-white/5 rounded-2xl p-8 backdrop-blur-sm relative">
            <form onSubmit={onSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-gray-500 font-medium font-sans">
                    სახელი
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    required
                    disabled={result === "sending"}
                    className="w-full bg-[#0D0D0F]/60 border border-white/5 rounded-xl py-3 px-4 text-xs text-gray-200 outline-none transition-all focus:border-[#D4AF37]/30 focus:bg-[#0D0D0F]/90 placeholder:text-gray-600 font-light"
                    placeholder="თქვენი სახელი" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-gray-500 font-medium font-sans">
                    ელ-ფოსტა
                  </label>
                  <input 
                    type="email"
                    
                    name="email" 
                    required
                    disabled={result === "sending"}
                    className="w-full bg-[#0D0D0F]/60 border border-white/5 rounded-xl py-3 px-4 text-xs text-gray-200 outline-none transition-all focus:border-[#D4AF37]/30 focus:bg-[#0D0D0F]/90 placeholder:text-gray-600 font-light"
                    placeholder="name@example.com" 
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-gray-500 font-medium font-sans">
                  შეტყობინება
                </label>
                <textarea 
                  name="message" 
                  rows={4} 
                  required
                  disabled={result === "sending"}
                  className="w-full bg-[#0D0D0F]/60 border border-white/5 rounded-xl py-3 px-4 text-xs text-gray-200 outline-none transition-all focus:border-[#D4AF37]/30 focus:bg-[#0D0D0F]/90 resize-none placeholder:text-gray-600 font-light"
                  placeholder="რით შეგვიძლია დაგეხმაროთ..." 
                />
              </div>

              <button 
                type="submit" 
                disabled={result === "sending"}
                className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-medium text-xs tracking-wider uppercase transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-[#D4AF37]/30 active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {result === "sending" ? "იგზავნება..." : "გაგზავნა"}
              </button>

            
              {result === "success" && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl animate-fade-in">
                  <CheckCircle2 size={14} className="shrink-0" />
                  <span>შეტყობინება წარმატებით გაიგზავნა თქვენს Gmail-ზე!</span>
                </div>
              )}

              {result === "error" && (
                <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl animate-fade-in">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>დაფიქსირდა შეცდომა. გთხოვთ სცადოთ თავიდან.</span>
                </div>
              )}

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}