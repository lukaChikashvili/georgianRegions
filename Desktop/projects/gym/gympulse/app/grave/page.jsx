"use client";

import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useUser } from '@clerk/nextjs';
import { X, Crown, Loader2 } from 'lucide-react';
import Experience from '../../components/Experience';


function UpgradeModal({ onClose, onUpgrade, isUpgrading }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-[#0F0F11] border border-[#D4AF37]/20 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

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
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-[#AA7C11] to-[#D4AF37] flex items-center justify-center">
                <Crown size={9} className="text-black" />
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]/70 font-medium">პრემიუმ ფუნქცია</p>
              <h3 className="text-base font-semibold text-[#FFF5D6] leading-snug mt-0.5">3D ვირტუალური სასაფლაო</h3>
            </div>
          </div>

          <p className="text-sm text-gray-400 font-light leading-relaxed">
            3D მონუმენტის შექმნა და ვირტუალურ სასაფლაოზე განთავსება მხოლოდ პრემიუმ პაკეტშია ხელმისაწვდომი.
          </p>

          <div className="bg-[#1A150F]/40 border border-[#D4AF37]/10 rounded-xl p-4 space-y-2.5">
            <p className="text-[11px] uppercase tracking-widest text-[#D4AF37]/60 mb-3">მარადიული პაკეტი მოიცავს</p>
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
                  <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                </div>
                {f}
              </div>
            ))}
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-[#D4AF37]">49.99</span>
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
  const allGraves = useQuery(api.memorials.getAllGraveDesigns);
  const myGrave = useQuery(api.memorials.getMyGraveDesign);
  const userIsPremium = useQuery(api.pricing.isPremium);
  const hasDesigned = !!myGrave;

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

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

  if (allGraves === undefined) {
    return (
      <div className="w-full h-[calc(100vh-3rem)] mt-12 bg-[#0b0d12] flex items-center justify-center">
        <p className="text-sm text-gray-500 font-light tracking-widest animate-pulse">
          ვირტუალური სასაფლაო იტვირთება...
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-3rem)] mt-12 bg-[#0b0d12]">
      {showUpgradeModal && (
        <UpgradeModal
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={handleUpgrade}
          isUpgrading={isUpgrading}
        />
      )}

      <Canvas
        camera={{ position: [0, 15, 30], fov: 50 }}
        className="w-full h-full"
      >
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05}
          maxDistance={80}
        />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Experience graveRecords={allGraves} />
      </Canvas>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 pointer-events-none">
        <div className="flex items-center justify-between p-4 border pointer-events-auto rounded-xl bg-[#16181e]/90 border-white/5 backdrop-blur-md shadow-xl">
          <div className="text-left">
            <p className="text-xs font-light text-gray-400 tracking-wider">ვირტუალური სივრცე</p>
            <h3 className="text-sm font-medium text-white tracking-wide mt-0.5">
              {hasDesigned ? myGrave.fullName : "მემორიალი არ არის შექმნილი"}
            </h3>
          </div>

          {userIsPremium ? (
            <button
              onClick={() => router.push("/grave/create-gravestone")}
              className="flex items-center gap-2 py-2 px-4 text-xs font-medium text-[#0b0d12] bg-[#ffd700] hover:bg-[#ffe240] transition-all duration-300 rounded-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              {hasDesigned ? "დიზაინის შეცვლა" : "მონუმენტის განთავსება"}
            </button>
          ) : (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="flex items-center gap-2 py-2 px-4 text-xs font-medium text-[#D4AF37] bg-[#1A150F] border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 hover:bg-[#1A150F]/80 transition-all duration-300 rounded-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <Crown size={12} /> პრემიუმი საჭიროა
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;