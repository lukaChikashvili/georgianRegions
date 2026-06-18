"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useConvexAuth } from "convex/react";
import Link from "next/link";
import { useState } from "react";
import {
  Building2, MapPin, Phone, Mail, Globe,
  Plus, Star, ChevronRight, Search, Briefcase
} from "lucide-react";

const GEORGIAN_CITIES = [
  "ყველა", "თბილისი", "ბათუმი", "ქუთაისი", "რუსთავი", "გორი",
  "ზუგდიდი", "ფოთი", "ხაშური", "სამტრედია", "სენაკი",
  "ზესტაფონი", "მარნეული", "ახალციხე", "ოზურგეთი", "ახმეტა"
];

export default function FuneralHomesDirectory() {
  const [selectedCity, setSelectedCity] = useState("");
  const [search, setSearch] = useState("");
  const { isAuthenticated } = useConvexAuth();

  const funeralHomes = useQuery(api.funeralHomes.listFuneralHomes, {
    city: selectedCity || undefined,
  });

  const myFuneralHome = useQuery(
    api.funeralHomes.getMyFuneralHome,
    isAuthenticated ? {} : "skip"
  );

  const filtered = funeralHomes?.filter(fh =>
    search === "" ||
    fh.name.toLowerCase().includes(search.toLowerCase()) ||
    fh.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen py-16 px-6 mt-16" style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 0%, #1A150F 0%, #111114 55%, #0D0D0F 100%)' }}>
      <div className="max-w-6xl mx-auto">

        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-[#D4AF37] text-xs uppercase tracking-widest mb-3">სამგლოვიარო სერვისები</p>
            <h1 className="text-3xl font-serif italic text-[#FFF5D6]">სამგლოვიარო სახლები</h1>
            <p className="text-gray-500 text-sm mt-2">
              {funeralHomes === undefined ? "იტვირთება..." : `${funeralHomes.length} სამგლოვიარო სახლი`}
            </p>
          </div>

         
          {!myFuneralHome ? (
            <Link
              href="/funeral-homes/create"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black text-sm font-medium rounded-xl hover:brightness-110 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" /> სამგლოვიარო სახლის დამატება
            </Link>
          ) : (
            <Link
              href="/funeral-homes/dashboard"
              className="flex items-center gap-2 px-5 py-2.5 border border-[#D4AF37]/30 text-[#D4AF37] text-sm rounded-xl hover:bg-[#D4AF37]/10 transition-all shrink-0"
            >
              <Building2 className="w-4 h-4" /> ჩემი გვერდი
            </Link>
          )}
        </div>

        
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
        
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="სახელით ან ქალაქით ძიება..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]/30 transition-colors"
            />
          </div>

          
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 shrink-0">
            {GEORGIAN_CITIES.slice(0, 6).map(city => (
              <button
                key={city}
                onClick={() => setSelectedCity(city === "ყველა" ? "" : city)}
                className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all border ${
                  (city === "ყველა" && !selectedCity) || selectedCity === city
                    ? "bg-[#D4AF37]/15 border-[#D4AF37]/30 text-[#D4AF37]"
                    : "border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

      
        {funeralHomes === undefined && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-2xl border border-white/5 overflow-hidden animate-pulse">
                <div className="h-44 bg-white/[0.03]" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-white/[0.03] rounded w-2/3" />
                  <div className="h-3 bg-white/[0.03] rounded w-1/2" />
                  <div className="h-3 bg-white/[0.03] rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

       
        {filtered?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/5 border border-[#D4AF37]/10 flex items-center justify-center mb-5">
              <Building2 className="w-7 h-7 text-[#D4AF37]/30" />
            </div>
            <h3 className="text-[#FFF5D6]/60 font-serif italic text-lg mb-2">სამგლოვიარო სახლი ვერ მოიძებნა</h3>
            <p className="text-gray-600 text-sm mb-6">სცადეთ სხვა ფილტრი ან დაამატეთ თქვენი</p>
            <Link
              href="/funeral-homes/create"
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black text-sm font-medium rounded-xl hover:brightness-110 transition-all"
            >
              <Plus className="w-4 h-4" /> სამგლოვიარო სახლის დამატება
            </Link>
          </div>
        )}

      
        {filtered && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(fh => (
              <Link
                key={fh._id}
                href={`/funeral-homes/${fh._id}`}
                className="group rounded-2xl border border-white/5 overflow-hidden hover:border-[#D4AF37]/20 transition-all duration-300 hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
               
                <div className="relative h-44 overflow-hidden bg-[#0D0D0F]">
                  {fh.coverUrl ? (
                    <img
                      src={fh.coverUrl}
                      alt={fh.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-10 h-10 text-white/5" />
                    </div>
                  )}

                  
                  {fh.logoUrl && (
                    <div className="absolute bottom-3 left-3 w-10 h-10 rounded-xl overflow-hidden border border-white/10 bg-[#111114]">
                      <img src={fh.logoUrl} alt="logo" className="w-full h-full object-cover" />
                    </div>
                  )}

                  
                  {fh.rating && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm">
                      <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                      <span className="text-xs text-white">{fh.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

               
                <div className="p-5">
                  <h3 className="text-[#FFF5D6] font-serif italic text-lg leading-tight mb-1 group-hover:text-[#D4AF37] transition-colors">
                    {fh.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span>{fh.city}</span>
                    <span className="text-white/10">·</span>
                    <span className="truncate">{fh.address}</span>
                  </div>

                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-4">
                    {fh.description}
                  </p>

                 
                  {fh.services?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {fh.services.slice(0, 3).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-[#D4AF37]/5 border border-[#D4AF37]/10 text-[#D4AF37]/60 text-[10px]">
                          {s.name}
                        </span>
                      ))}
                      {fh.services.length > 3 && (
                        <span className="px-2 py-0.5 rounded-md bg-white/[0.02] border border-white/5 text-gray-600 text-[10px]">
                          +{fh.services.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <span
                        href={`tel:${fh.phone}`}
                        onClick={e => e.stopPropagation()}
                        className="text-gray-600 hover:text-[#D4AF37] transition-colors"
                        title={fh.phone}
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </span>
                      <span
                        href={`mailto:${fh.email}`}
                        onClick={e => e.stopPropagation()}
                        className="text-gray-600 hover:text-[#D4AF37] transition-colors"
                        title={fh.email}
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </span>
                      {fh.website && (
                        <span
                          href={fh.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="text-gray-600 hover:text-[#D4AF37] transition-colors"
                        >
                          <Globe className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                    <span className="text-[#D4AF37]/40 group-hover:text-[#D4AF37] transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

     
        {filtered && filtered.length > 0 && !myFuneralHome && (
          <div className="mt-12 p-8 rounded-2xl border border-[#D4AF37]/10 text-center" style={{ background: 'rgba(212,175,55,0.03)' }}>
            <Briefcase className="w-8 h-8 text-[#D4AF37]/40 mx-auto mb-3" />
            <h3 className="text-[#FFF5D6] font-serif italic text-lg mb-2">გაქვთ სამგლოვიარო სახლი?</h3>
            <p className="text-gray-500 text-sm mb-5">დაარეგისტრირეთ და მიიღეთ ახალი კლიენტები GoldenMemorial-ის მეშვეობით</p>
            <Link
              href="/funeral-homes/create"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black text-sm font-medium rounded-xl hover:brightness-110 transition-all"
            >
              <Plus className="w-4 h-4" /> დარეგისტრირდი — 30 დღე უფასოდ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}