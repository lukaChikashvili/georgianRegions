"use client";

import { useState, useMemo } from "react";
import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import {
  Building2, MapPin, Phone, Mail, Globe, Star,
  ArrowLeft, Briefcase, Image as ImageIcon, ShieldCheck, Check, ShoppingBag
} from "lucide-react";
import MultiBookingModal from "@/components/MultiBookingModal";

export default function FuneralHomeDetail() {
  const params = useParams();
  const id = params.id;

  const fh = useQuery(api.funeralHomes.getFuneralHomeById, { id });
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedImages, setSelectedImages] = useState({}); // { [serviceName]: imageUrl }
  const [showBooking, setShowBooking] = useState(false);

  const toggleService = (service) => {
    setSelectedServices((prev) => {
      const exists = prev.some((s) => s.name === service.name);
      if (exists) return prev.filter((s) => s.name !== service.name);
      return [...prev, service];
    });
  };

  const isSelected = (service) => selectedServices.some((s) => s.name === service.name);

  const chooseImage = (serviceName, url) => {
    setSelectedImages((prev) => ({
      ...prev,
      [serviceName]: prev[serviceName] === url ? undefined : url,
    }));
  };

  const totalPrice = useMemo(
    () => selectedServices.reduce((sum, s) => sum + (s.price || 0), 0),
    [selectedServices]
  );

  const servicesForBooking = useMemo(
    () =>
      selectedServices.map((s) => ({
        ...s,
        selectedImageUrl: selectedImages[s.name],
      })),
    [selectedServices, selectedImages]
  );

  if (fh === undefined) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center" style={{ background: '#0A0A0A' }}>
        <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
      </div>
    );
  }

  if (fh === null) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-center px-6" style={{ background: '#0A0A0A' }}>
        <Building2 className="w-12 h-12 text-white/10 mb-4" />
        <h1 className="text-[#FFF5D6]/60 font-serif italic text-xl mb-2">სარიტუალო სახლი ვერ მოიძებნა</h1>
        <Link href="/funeral-homes" className="text-[#D4AF37]/60 hover:text-[#D4AF37] text-sm mt-4 flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> დამკრძალავ ბიუროებზე დაბრუნება
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 pb-24" style={{ background: '#0A0A0A' }}>

      <div className="relative h-64 sm:h-80 overflow-hidden">
        {fh.coverUrl ? (
          <img src={fh.coverUrl} alt={fh.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 0%, #1A150F 0%, #111114 55%, #0D0D0F 100%)' }}>
            <Building2 className="w-16 h-16 text-white/5" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent" />

        <Link
          href="/funeral-homes"
          className="absolute top-6 left-6 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-gray-300 hover:text-[#D4AF37] text-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 " /> სარიტუალო სახლები
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6">

        <div className="relative -mt-16 mb-10 flex flex-col sm:flex-row sm:items-end gap-5">
          <div className="w-28 h-28 rounded-2xl border-4 border-[#0A0A0A] overflow-hidden bg-[#111114] shrink-0 shadow-2xl">
            {fh.logoUrl ? (
              <img src={fh.logoUrl} alt="logo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white/10" />
              </div>
            )}
          </div>

          <div className="flex-1 pb-1">
            <div className="flex items-center gap-2 mb-1.5">
              <h1 className="text-3xl font-serif italic text-[#FFF5D6]">{fh.name}</h1>
              {fh.status === "active" && (
                <ShieldCheck className="w-5 h-5 text-[#D4AF37]" title="ვერიფიცირებული" />
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              <span>{fh.city}</span>
              <span className="text-white/10">·</span>
              <span>{fh.address}</span>
              {fh.rating && (
                <>
                  <span className="text-white/10">·</span>
                  <span className="flex items-center gap-1 text-[#D4AF37]">
                    <Star className="w-3.5 h-3.5 fill-[#D4AF37]" /> {fh.rating.toFixed(1)}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2 pb-1">
            
             <a href={`tel:${fh.phone}`}
              className="button flex items-center gap-2 px-4 py-2.5 rounded-xl text-black text-sm font-medium hover:brightness-110 transition-all"
            >
              <Phone className="w-3.5 h-3.5" />
              დარეკვა
            </a>

            
              <a href={`mailto:${fh.email}`}
              className="flex items-center justify-center w-11 h-11 rounded-xl border border-white/10 text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all"
              title={fh.email}
            >
              <Mail className="w-4 h-4" />
            </a>

            {fh.website && (
              
                <a href={fh.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-11 h-11 rounded-xl border border-white/10 text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pb-20">

          <div className="lg:col-span-2 space-y-10">

            <div>
              <h2 className="text-[#c1a362] text-xs uppercase tracking-widest mb-4">ჩვენ შესახებ</h2>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{fh.description}</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[#c1a362] text-xs uppercase tracking-widest flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" /> სერვისები
                </h2>
                {selectedServices.length > 0 && (
                  <span className="text-xs text-gray-500">აირჩიეთ ერთი ან მეტი სერვისი</span>
                )}
              </div>

              {fh.services?.length > 0 ? (
                <div className="space-y-3">
                  {fh.services.map((s, i) => {
                    const selected = isSelected(s);
                    const chosenImage = selectedImages[s.name];
                    return (
                      <div
                        key={i}
                        className={`p-5 rounded-xl border transition-all ${
                          selected
                            ? "border-[#c1a362] bg-[#D4AF37]/[0.06]"
                            : "border-white/5 bg-white/[0.02] hover:border-white/10"
                        }`}
                      >
                        <button
                          onClick={() => toggleService(s)}
                          className="w-full text-left flex items-start justify-between gap-4"
                        >
                          <div className="flex items-start gap-3 flex-1">
                            <div
                              className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                selected
                                  ? "bg-[#c1a362] border-[#c1a362]"
                                  : "border-white/20"
                              }`}
                            >
                              {selected && <Check className="w-3.5 h-3.5 text-black" />}
                            </div>
                            <div>
                              <h3 className="text-[#FFF5D6]/90 text-sm font-medium mb-1.5">{s.name}</h3>
                              <p className="text-gray-500 text-xs leading-relaxed">{s.description}</p>
                            </div>
                          </div>
                          {s.price !== undefined && (
                            <span className="shrink-0 px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium whitespace-nowrap">
                              {s.price} ₾
                            </span>
                          )}
                        </button>

                        {s.imageUrls?.length > 0 && (
                          <div className="mt-4 pl-8">
                            <p className="text-[11px] text-gray-600 mb-2">
                              {chosenImage ? "არჩეული ვარიანტი" : "აირჩიეთ სასურველი ვარიანტი"}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {s.imageUrls.map((url, idx) => {
                                const isChosen = chosenImage === url;
                                return (
                                  <button
                                    key={idx}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      chooseImage(s.name, url);
                                    }}
                                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                                      isChosen
                                        ? "border-[#c1a362] ring-2 ring-[#c1a362]/30"
                                        : "border-transparent opacity-70 hover:opacity-100"
                                    }`}
                                  >
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                    {isChosen && (
                                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <div className="w-5 h-5 rounded-full bg-[#c1a362] flex items-center justify-center">
                                          <Check className="w-3 h-3 text-black" />
                                        </div>
                                      </div>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">სერვისები არ არის დამატებული</p>
              )}
            </div>

            {fh.galleryUrls?.length > 0 && (
              <div>
                <h2 className="text-[#D4AF37] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5" /> გალერეა
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {fh.galleryUrls.map((url, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/5">
                      <img src={url} alt={`gallery-${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="sticky top-24 p-6 rounded-2xl border border-[#c1a362]/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <h3 className="text-[#c1a362] text-xs uppercase tracking-widest mb-5">საკონტაქტო ინფორმაცია</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-gray-300 text-sm">{fh.address}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{fh.city}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-600 shrink-0" />
                  <a href={`tel:${fh.phone}`} className="text-gray-300 text-sm hover:text-[#c1a362] transition-colors">
                    {fh.phone}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-600 shrink-0" />
                  <a href={`mailto:${fh.email}`} className="text-gray-300 text-sm hover:text-[#c1a362] transition-colors break-all">
                    {fh.email}
                  </a>
                </div>

                {fh.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-600 shrink-0" />
                    <a href={fh.website} target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-[#c1a362] transition-colors break-all">
                      {fh.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>

              
               <a href={`tel:${fh.phone}`}
                className="button2 w-full mt-6 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-black text-sm font-medium hover:brightness-110 transition-all"
              >
                <Phone className="w-4 h-4" />
                ახლავე დარეკვა
              </a>
            </div>
          </div>
        </div>
      </div>

      {selectedServices.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#c1a362]/15 backdrop-blur-md" style={{ background: 'rgba(10,10,10,0.95)' }}>
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#c1a362]/10 flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4 h-4 text-[#c1a362]" />
              </div>
              <div>
                <p className="text-[#FFF5D6]/90 text-sm font-medium">
                  {selectedServices.length} სერვისი არჩეულია
                </p>
                <p className="text-gray-500 text-xs">{totalPrice} ₾ სავარაუდო ჯამი</p>
              </div>
            </div>
            <button
              onClick={() => setShowBooking(true)}
              className="button px-6 py-2.5 rounded-xl text-black text-sm font-medium hover:brightness-110 transition-all whitespace-nowrap"
            >
              გაგრძელება
            </button>
          </div>
        </div>
      )}

      {showBooking && (
        <MultiBookingModal
          funeralHomeId={fh._id}
          services={servicesForBooking}
          onClose={() => setShowBooking(false)}
          onSuccess={() => {
            setSelectedServices([]);
            setSelectedImages({});
          }}
        />
      )}
    </div>
  );
}