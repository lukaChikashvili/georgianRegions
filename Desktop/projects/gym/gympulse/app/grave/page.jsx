"use client";

import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { X, Crown, Loader2, MapPin, Users, ChevronRight } from 'lucide-react';



function UpgradeModal({ onClose, onUpgrade, isUpgrading }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-[#0F0F11] border border-[#c1a362]/20 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c1a362]/60 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#c1a362]/5 blur-3xl pointer-events-none" />

        <div className="p-7 flex flex-col gap-5 relative z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-600 hover:text-gray-400 hover:bg-white/5 transition"
          >
            <X size={14} />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-[#1A150F] border border-[#D4AF37]/20 flex items-center justify-center text-2xl">
                🪦
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-[#AA7C11] to-[#c1a362] flex items-center justify-center">
                <Crown size={9} className="text-black" />
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#c1a362]/70 font-medium">პრემიუმ ფუნქცია</p>
              <h3 className="text-base font-semibold text-[#FFF5D6] leading-snug mt-0.5">3D ვირტუალური სასაფლაო</h3>
            </div>
          </div>

          <p className="text-sm text-gray-400 font-light leading-relaxed">
            3D მონუმენტის შექმნა და ვირტუალურ სასაფლაოზე განთავსება მხოლოდ პრემიუმ პაკეტშია ხელმისაწვდომი.
          </p>

          <div className="bg-[#1A150F]/40 border border-[#D4AF37]/10 rounded-xl p-4 space-y-2.5">
            <p className="text-[11px] uppercase tracking-widest text-[#c1a362]/60 mb-3">მარადიული პაკეტი მოიცავს</p>
            {[
              'ულიმიტო HD ფოტოგალერეა',
              'სრული ბიოგრაფია (შეუზღუდავი)',
              'მუსიკალური მოგონება (YouTube)',
              '3D ვირტუალური სასაფლაო',
              'QR კოდი საფლავის ქვისთვის',
              'ულიმიტო მემორიალები',
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5 text-xs text-gray-300">
                <div className="w-4 h-4 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c1a362]" />
                </div>
                {f}
              </div>
            ))}
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-[#c1a362]">49.99</span>
            <span className="text-sm text-gray-500">₾</span>
            <span className="text-xs text-gray-600 ml-1">ერთჯერადი გადასახადი · სამუდამოდ</span>
          </div>

          <button
            onClick={onUpgrade}
            disabled={isUpgrading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] hover:brightness-110 text-black font-bold text-sm tracking-wide transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/10"
          >
            {isUpgrading ? (
              <><Loader2 size={15} className="animate-spin" /> მიმდინარეობს...</>
            ) : (
              <><Crown size={15} /> განაახლე — 49.99 ₾</>
            )}
          </button>

          <p className="text-center text-[11px] text-gray-600">
            BOG-ის დაცული გადახდის გვერდზე გადახვალთ
          </p>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
      </div>
    </div>
  );
}

const Page = () => {
  const router = useRouter();
  const { user } = useUser();
  const allCities = useQuery(api.memorials.getAllCities);
  const myGrave = useQuery(api.memorials.getMyGraveDesign);
  const userIsPremium = useQuery(api.pricing.isPremium);
  const hasDesigned = !!myGrave;

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [search, setSearch] = useState("");

  const handleUpgrade = async () => {
    if (!user) return;
    setIsUpgrading(true);
    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const { redirectUrl } = await res.json();
      window.location.href = redirectUrl;
    } catch {
      setIsUpgrading(false);
    }
  };

  const filteredCities = allCities?.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  if (allCities === undefined) {
    return (
      <div className="w-full h-[calc(100vh-3rem)] mt-12 bg-[#0b0d12] flex items-center justify-center">
        <p className="text-sm text-gray-500 font-light tracking-widest animate-pulse">იტვირთება...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-3rem)] mt-12 bg-[#0b0d12] text-white">
      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={handleUpgrade}
          isUpgrading={isUpgrading}
        />
      )}

      
      <div className="relative border-b border-white/5 px-6 py-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#ffd700]/3 to-transparent pointer-events-none" />
        <p className="text-[11px] uppercase tracking-widest text-[#ffd700]/60 mb-3">ვირტუალური სივრცე</p>
        <h1 className="text-3xl font-light text-white tracking-wide mb-3">ვირტუალური სასაფლაო</h1>
        <p className="text-sm text-gray-500 font-light max-w-md mx-auto">
          აირჩიეთ ქალაქი და ეწვიეთ ვირტუალურ სასაფლაოს, ან შექმენით თქვენი მემორიალი
        </p>

      
        {hasDesigned && myGrave.city && (
          <button
            onClick={() => router.push(`/grave/${encodeURIComponent(myGrave.city)}`)}
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ffd700]/10 border border-[#ffd700]/20 text-[#ffd700] text-xs hover:bg-[#ffd700]/15 transition-all"
          >
            <MapPin size={12} />
            ჩემი მემორიალი — {myGrave.city}
            <ChevronRight size={12} />
          </button>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ქალაქის ძიება..."
            className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffd700]/30 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
            >
              <X size={14} />
            </button>
          )}
        </div>

     
        {filteredCities.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCities.map((city) => {
              const isMine = myGrave?.city === city.name;
              const pct = Math.round((city.plotCount / city.maxPlots) * 100);
              return (
                <button
                  key={city._id}
                  onClick={() => router.push(`/grave/${encodeURIComponent(city.name)}`)}
                  className={`group relative p-5 rounded-xl border text-left transition-all hover:scale-[1.01] ${
                    isMine
                      ? "border-[#ffd700]/30 bg-[#ffd700]/5"
                      : "border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03]"
                  }`}
                >
                  {isMine && (
                    <span className="absolute top-3 right-3 text-[9px] uppercase tracking-widest text-[#ffd700]/70 bg-[#ffd700]/10 px-2 py-0.5 rounded-full">
                      ჩემი
                    </span>
                  )}

                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-base shrink-0">
                      ⛼
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white">{city.name}</h3>
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <Users size={9} /> {city.plotCount} მემორიალი
                      </p>
                    </div>
                  </div>

                 
                  <div className="space-y-1">
                    <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pct >= 90 ? "bg-red-500" : pct >= 60 ? "bg-yellow-500" : "bg-[#ffd700]"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[9px] text-gray-600">
                      {city.plotCount}/{city.maxPlots} ადგილი
                    </p>
                  </div>

                  <ChevronRight
                    size={14}
                    className="absolute right-4 bottom-4 text-gray-700 group-hover:text-gray-400 transition-colors"
                  />
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-600">
            <p className="text-4xl mb-3">🪦</p>
            <p className="text-sm">სასაფლაო ვერ მოიძებნა</p>
            {search && <p className="text-xs mt-1">სცადეთ სხვა სახელი</p>}
          </div>
        )}

     
        <div className="border-t border-white/5 pt-8">
          <div className="flex items-center justify-between p-5 rounded-xl bg-white/[0.02] border border-white/5">
            <div>
              <p className="text-xs text-gray-400 font-light">
                {hasDesigned ? `${myGrave.fullName} · ${myGrave.city || "ქალაქი არ არის"}` : "მემორიალი არ არის შექმნილი"}
              </p>
              <p className="text-[11px] text-gray-600 mt-0.5">
                {hasDesigned ? "დიზაინის შეცვლა ან ახლის შექმნა" : "შექმენით თქვენი 3D მემორიალი"}
              </p>
            </div>

            {userIsPremium ? (
              <button
                onClick={() => router.push("/grave/create-gravestone")}
                className="button flex items-center gap-2 py-2 px-4 text-xs font-medium text-[#0b0d12] bg-[#ffd700] hover:bg-[#ffe240] transition-all rounded-lg hover:scale-[1.02]"
              >
                {hasDesigned ? "დიზაინის შეცვლა" : "მემორიალის შექმნა"}
              </button>
            ) : (
              <button
                onClick={() => setShowUpgradeModal(true)}
                className="flex items-center gap-2 py-2 px-4 text-xs font-medium text-[#c1a362] bg-[#1A150F] border border-[#c1a362]/30 hover:border-[#c1a362]/60 transition-all rounded-lg"
              >
                <Crown size={12} /> პრემიუმი საჭიროა
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;