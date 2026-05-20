import { Box, Layers, Move } from "lucide-react";

export const VirtualCemetery = () => {
  const features = [
    { icon: <Box size={16} />, text: "ინდივიდუალური საფლავის ქვებისა და აქსესუარების დიზაინი" },
    { icon: <Layers size={16} />, text: "მშვიდი, ციფრული არქიტექტურული გარემო 3D სივრცეში" },
    { icon: <Move size={16} />, text: "ინტერაქტიული ნავიგაცია და ვირტუალური ყვავილების დატოვება" },
  ];

  return (
    <section className="py-28 bg-[#0D0D0F] relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(212,175,55,0.03),transparent_60%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          
          <div className="lg:col-span-6 relative aspect-video lg:aspect-square w-full rounded-2xl border border-white/5 bg-gradient-to-b from-[#121214]/60 to-[#0A0A0B]/90 p-1 flex items-center justify-center overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(212,175,55,0.02)_0%,transparent_70%)] group-hover:scale-110 transition-transform duration-1000" />
            
           
            <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            <div className="text-center space-y-4 z-10 p-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#1A150F] border border-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] animate-pulse">
                <Box size={24} />
              </div>
              <p className="font-serif text-lg text-[#FFF5D6] font-light">3D ინტერაქტიული გარემო</p>
              <p className="font-sans text-xs text-gray-500 max-w-xs mx-auto font-light leading-relaxed">
                ვირტუალური მარადიული სივრცის მოდელირება რეალურ დროში
              </p>
            </div>
          </div>

          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs tracking-widest uppercase text-[#D4AF37]/90 font-medium font-sans">ინოვაცია</span>
            <h2 className="text-3xl md:text-4xl font-light text-[#FFF5D6] font-serif leading-[1.3]">
              ვირტუალური 3D სასაფლაო და ინდივიდუალური დიზაინი
            </h2>
            <p className="font-sans text-sm md:text-base text-gray-400 font-light leading-relaxed">
              შექმენით უნიკალური, მუდმივი ციფრული ძეგლი. ჩვენი ინტერაქტიული 3D პლატფორმა საშუალებას გაძლევთ აირჩიოთ საფლავის ქვის დიზაინი, ტექსტურა და მოაწყოთ გარემო, სადაც ახლობლები შეძლებენ ვირტუალურად მოსვლას, სანთლის დანთებას და პატივის მიგებას მსოფლიოს ნებისმიერი წერტილიდან.
            </p>

            <ul className="space-y-3.5 pt-2">
              {features.map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm text-gray-400 font-sans font-light">
                  <div className="text-[#D4AF37]/80">{item.icon}</div>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="pt-6">
              <Link href="/grave" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-xs tracking-wider uppercase transition-all duration-300 hover:brightness-110 shadow-lg hover:shadow-[#D4AF37]/5 active:scale-[0.99]">
                დიზაინის დაწყება
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};