import { Check } from "lucide-react";

export const Pricing = ({ spotsLeft = 100 }) => {
  const discountActive = spotsLeft > 0;

  const plans = [
    {
      name: "საზიარო სივრცე",
      price: "უფასო",
      desc: "იდეალურია ძირითადი ციფრული მემორიალისთვის",
      features: [
        "მარადიული ონლაინ პროფილი",
        "ძირითადი ბიოგრაფია და ფოტო",
        "ვირტუალური სანთლის დანთება",
        "სამძიმრის წერილების მიღება",
      ],
      cta: "დაიწყე უფასოდ",
      featured: false,
    },
    {
      name: "მარადიული ხსოვნა",
      price: discountActive ? "49.99 ₾" : "99 ₾",
      originalPrice: discountActive ? "99 ₾" : null,
      desc: "სრული არქივი ოჯახური მემკვიდრეობის შესანახად",
      features: [
        "ყველა უფასო ფუნქცია",
        "ულიმიტო HD ფოტოგალერეა",
        "YouTube მუსიკალური მოგონება",
        "სრული ბიოგრაფია (შეუზღუდავი)",
        "3D ვირტუალური სასაფლაო",
        "QR კოდის გენერაცია მემორიალისთვის",
        "აუდიო სადღეგრძელო",
        "ქრონოლოგია",
        "გენეალოგიური ხე"
      ],
      cta: "პრემიუმის შექმნა",
      featured: true,
    },
  ];

  return (
    <section className="py-24 bg-[#0D0D0F] relative border-t border-white/5">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-xs tracking-widest uppercase text-[#D4AF37]/90 font-medium font-sans">
            ტარიფები
          </span>

          <h2 className="text-3xl md:text-4xl font-light text-[#FFF5D6] font-serif mt-3">
            მარტივი და გამჭვირვალე პირობები
          </h2>

          <p className="mt-4 text-sm text-gray-500">
            შექმენით ციფრული მემორიალი და შეინახეთ მოგონებები მომავალი
            თაობებისთვის.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${
                plan.featured
                  ? "bg-[#16130F] border border-[#D4AF37]/40 shadow-xl shadow-[#D4AF37]/10"
                  : "bg-[#121214]/40 border border-white/5"
              }`}
            >
              {plan.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full">
                  ყველაზე პოპულარული
                </span>
              )}

              <h3 className="text-xl font-light text-[#FFF5D6] font-serif mb-2">
                {plan.name}
              </h3>

              <p className="text-xs text-gray-400 font-sans mb-6 font-light">
                {plan.desc}
              </p>

              <div className="mb-8">
                {plan.featured && plan.originalPrice && (
                  <span className="text-lg font-light font-serif text-gray-500 line-through mr-2">
                    {plan.originalPrice}
                  </span>
                )}
                <span className="text-4xl font-light font-serif text-[#FFF5D6]">
                  {plan.price}
                </span>

                {plan.featured && (
                  <>
                    <div className="mt-2">
                      <span className="text-xs tracking-widest uppercase text-[#D4AF37]/80">
                        ერთჯერადი გადახდა
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      სამუდამო მემორიალი • ყოველთვიური გადასახადის გარეშე
                    </p>

                    {discountActive && (
                      <p className="text-xs text-[#D4AF37] mt-3 font-medium">
                        პირველი {spotsLeft} მომხმარებლისთვის — შემდეგ 99 ₾
                      </p>
                    )}
                  </>
                )}
              </div>

              <ul className="space-y-4 mb-8 border-t border-white/5 pt-6">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-400 font-sans font-light"
                  >
                    <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-300 ${
                  plan.featured
                    ? "bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black hover:brightness-110"
                    : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="text-xs text-gray-600 max-w-2xl mx-auto leading-relaxed">
            ყველა მემორიალი ინახება უსაფრთხოდ. პრემიუმ პაკეტი წარმოადგენს
            ერთჯერად გადახდას და მოიცავს სამუდამო წვდომას ყველა ფუნქციაზე.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;