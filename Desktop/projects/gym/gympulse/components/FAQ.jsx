"use client"
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    { q: "უფასოა თუ არა მემორიალის შექმნა?", a: "დიახ, საწყისი ციფრული მემორიალის შექმნა სრულიად უფასოა. თქვენ შეგიძლიათ ატვირთოთ ძირითადი ინფორმაცია, ბიოგრაფია, ერთი მთავარი ფოტო და ჩართოთ სანთლის დანთების ფუნქცია ყოველგვარი გადასახადის გარეშე." },
    { q: "რამდენ ხანს ინახება ციფრული მემორიალი?", a: "ჩვენი პლატფორმა შექმნილია მუდმივობისთვის. ყველა შექმნილი მემორიალი (როგორც უფასო, ისე პრემიუმი) ინახება მარადიულად ჩვენს დაცულ სერვერებზე და არასოდეს წაიშლება." },
    { q: "შემიძლია შევცვალო გვერდის კონფიდენციალურობა?", a: "დიახ. მემორიალის შექმნისას ან ნებისმიერ დროს მართვის პანელიდან შეგიძლიათ აირჩიოთ, გვერდი იყოს საჯარო (გამოჩნდეს ძიებაში) თუ პირადი (ხელმისაწვდომი მხოლოდ მათთვის, ვისაც პირდაპირ ბმულს გაუზიარებთ)." },
    { q: "როგორ მუშაობს QR კოდის ფუნქცია?", a: "პრემიუმ პაკეტის შეძენისას თქვენ გენერირდებათ უნიკალური მაღალი ხარისხის QR კოდი. შეგიძლიათ ეს კოდი დაიტანოთ რეალურ საფლავის ქვაზე, რათა სასაფლაოზე მისულმა ადამიანებმა მობილურით სკანირებისას მომენტალურად გახსნან გარდაცვლილის ციფრული ისტორია." }
  ];

  return (
    <section className="py-24 bg-[#0D0D0F] relative border-t border-white/5">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs tracking-widest uppercase text-[#D4AF37]/90 font-medium font-sans">კითხვები</span>
          <h2 className="text-3xl font-light text-[#FFF5D6] font-serif mt-3">ხშირად დასმული კითხვები</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="border border-white/5 rounded-xl bg-[#121214]/20 overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-white/[0.01] transition-colors"
                >
                  <span className="font-serif font-light text-base text-[#FFF5D6]">{faq.q}</span>
                  <ChevronDown size={16} className={`text-gray-500 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#D4AF37]" : ""}`} />
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[200px] border-t border-white/[0.02]" : "max-h-0"}`}>
                  <p className="p-6 text-sm text-gray-400 font-sans font-light leading-relaxed bg-[#0D0D0F]/40">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};