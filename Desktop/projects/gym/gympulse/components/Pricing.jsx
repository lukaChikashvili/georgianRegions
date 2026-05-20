import { Check } from "lucide-react";

export const Pricing = () => {
  const plans = [
    {
      name: "საზიარო სივრცე",
      price: "უფასო",
      desc: "იდეალურია ძირითადი ციფრული მემორიალისთვის",
      features: ["მარადიული ონლაინ პროფილი", "ძირითადი ბიოგრაფია & ფოტო", "ვირტუალური სანთლის დანთება", "სამძიმრის წერილების მიღება"],
      cta: "დაიწყე უფასოდ",
      featured: false,
    },
    {
      name: "მარადიული ხსოვნა",
      price: "99 ₾",
      desc: "სრული არქივი ოჯახური მემკვიდრეობის შესანახად",
      features: ["ყველა უფასო ფუნქცია", "ულიმიტო მედია გალერეა (HD)", "ფონური მუსიკის შერჩევა", "3D ვირტუალური სასაფლაო", "QR კოდის გენერაცია მემორიალისთვის", "პრიორიტეტული მხარდაჭერა"],
      cta: "პრემიუმის შექმნა",
      featured: true,
    },
  ];

  return (
    <section className="py-24 bg-[#0D0D0F] relative border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs tracking-widest uppercase text-[#D4AF37]/90 font-medium font-sans">ტარიფები</span>
          <h2 className="text-3xl md:text-4xl font-light text-[#FFF5D6] font-serif mt-3">მარტივი და გამჭვირვალე პირობები</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {plans.map((plan, index) => (
            <div key={index} className={`relative rounded-2xl p-8 backdrop-blur-md transition-all duration-300 ${
              plan.featured 
                ? "bg-[#16130F] border border-[#D4AF37]/40 shadow-xl shadow-[#D4AF37]/5" 
                : "bg-[#121214]/40 border border-white/5"
            }`}>
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                  რეკომენდებული
                </span>
              )}
              
              <h3 className="text-xl font-light text-[#FFF5D6] font-serif mb-2">{plan.name}</h3>
              <p className="text-xs text-gray-400 font-sans mb-6 font-light">{plan.desc}</p>
              
              <div className="mb-6">
                <span className="text-4xl font-light font-serif text-[#FFF5D6]">{plan.price}</span>
                {plan.featured && <span className="text-xs text-gray-500 font-sans ml-2">ერთჯერადი</span>}
              </div>

              <ul className="space-y-4 mb-8 border-t border-white/5 pt-6">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-400 font-sans font-light">
                    <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 ${
                plan.featured 
                  ? "bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black hover:brightness-110" 
                  : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
              }`}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};