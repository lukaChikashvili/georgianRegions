"use client";

import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import {
  Building2, MapPin, Phone, Mail, Globe, Star,
  ArrowLeft, Briefcase, Image as ImageIcon, ShieldCheck
} from "lucide-react";

export default function FuneralHomeDetail() {
  const params = useParams();
  const id = params.id;

  const fh = useQuery(api.funeralHomes.getFuneralHomeById, { id });

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
        <h1 className="text-[#FFF5D6]/60 font-serif italic text-xl mb-2">სამგლოვიარო სახლი ვერ მოიძებნა</h1>
        <Link href="/funeral-homes" className="text-[#D4AF37]/60 hover:text-[#D4AF37] text-sm mt-4 flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" /> სამგლოვიარო სახლებზე დაბრუნება
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16" style={{ background: '#0A0A0A' }}>

     
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
          <ArrowLeft className="w-3.5 h-3.5" /> სამგლოვიარო სახლები
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
            <a
              href={`tel:${fh.phone}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black text-sm font-medium hover:brightness-110 transition-all"
            >
              <Phone className="w-3.5 h-3.5" /> დარეკვა
            </a>
            <a
              href={`mailto:${fh.email}`}
              className="flex items-center justify-center w-11 h-11 rounded-xl border border-white/10 text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 transition-all"
              title={fh.email}
            >
              <Mail className="w-4 h-4" />
            </a>
            {fh.website && (
              <a
                href={fh.website}
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
              <h2 className="text-[#D4AF37] text-xs uppercase tracking-widest mb-4">ჩვენ შესახებ</h2>
              <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{fh.description}</p>
            </div>

           
            <div>
              <h2 className="text-[#D4AF37] text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" /> სერვისები
              </h2>

              {fh.services?.length > 0 ? (
                <div className="space-y-3">
                  {fh.services.map((s, i) => (
                    <div key={i} className="p-5 rounded-xl border border-white/5 bg-white/[0.02] flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-[#FFF5D6]/90 text-sm font-medium mb-1.5">{s.name}</h3>
                        <p className="text-gray-500 text-xs leading-relaxed">{s.description}</p>
                      </div>
                      {s.price !== undefined && (
                        <span className="shrink-0 px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-sm font-medium whitespace-nowrap">
                          {s.price} ₾
                        </span>
                      )}
                    </div>
                  ))}
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
            <div className="sticky top-24 p-6 rounded-2xl border border-[#D4AF37]/10" style={{ background: 'rgba(255,255,255,0.02)' }}>
              <h3 className="text-[#D4AF37] text-xs uppercase tracking-widest mb-5">საკონტაქტო ინფორმაცია</h3>

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
                  <a href={`tel:${fh.phone}`} className="text-gray-300 text-sm hover:text-[#D4AF37] transition-colors">
                    {fh.phone}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-600 shrink-0" />
                  <a href={`mailto:${fh.email}`} className="text-gray-300 text-sm hover:text-[#D4AF37] transition-colors break-all">
                    {fh.email}
                  </a>
                </div>

                {fh.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-600 shrink-0" />
                    <a href={fh.website} target="_blank" rel="noopener noreferrer" className="text-gray-300 text-sm hover:text-[#D4AF37] transition-colors break-all">
                      {fh.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>

              <a
                href={`tel:${fh.phone}`}
                className="w-full mt-6 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black text-sm font-medium hover:brightness-110 transition-all"
              >
                <Phone className="w-4 h-4" /> ახლავე დარეკვა
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}