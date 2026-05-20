"use client"

import { Mail, Phone, Clock } from "lucide-react";

export const ContactUs = () => {
  return (
    <section className="py-24 bg-[#0D0D0F] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs tracking-widest uppercase text-[#D4AF37]/90 font-medium font-sans">კონტაქტი</span>
            <h2 className="text-3xl font-light text-[#FFF5D6] font-serif">ჩვენ ყოველთვის აქ ვართ დასახმარებლად</h2>
            <p className="font-sans text-sm text-gray-400 font-light leading-relaxed">
              თუ გაქვთ შეკითხვები პლატფორმის მუშაობასთან, მემორიალის შექმნასთან ან 3D დიზაინის ინტეგრაციასთან დაკავშირებით, მოგვწერეთ და ჩვენი გუნდი უმოკლეს დროში დაგიკავშირდებათ.
            </p>

            <div className="space-y-4 pt-4 font-sans text-xs tracking-wide text-gray-400 font-light">
              <div className="flex items-center gap-3">
                <Mail size={14} className="text-[#D4AF37]/80" />
                <span>support@goldenmemory.ge</span>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock size={14} className="text-[#D4AF37]/80" />
                <span>ორშაბათი — კვირა, 24/7 მხარდაჭერა</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#121214]/20 border border-white/5 rounded-2xl p-8 backdrop-blur-sm">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">სახელი</label>
                  <input type="text" className="w-full bg-[#0D0D0F]/60 border border-white/5 rounded-xl py-3 px-4 text-xs text-gray-200 outline-none transition-all focus:border-[#D4AF37]/30" placeholder="თქვენი სახელი" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">ელ-ფოსტა</label>
                  <input type="email" className="w-full bg-[#0D0D0F]/60 border border-white/5 rounded-xl py-3 px-4 text-xs text-gray-200 outline-none transition-all focus:border-[#D4AF37]/30" placeholder="name@example.com" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-gray-500 font-medium">შეტყობინება</label>
                <textarea rows={4} className="w-full bg-[#0D0D0F]/60 border border-white/5 rounded-xl py-3 px-4 text-xs text-gray-200 outline-none transition-all focus:border-[#D4AF37]/30 resize-none" placeholder="რით შეგვიძლია დაგეხმაროთ..." />
              </div>
              <button type="submit" className="w-full py-3.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 font-medium text-xs tracking-wider uppercase transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-[#D4AF37]/20 active:scale-[0.99]">
                გაგზავნა
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};