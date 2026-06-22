"use client";

import React, { useState, Suspense } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import dynamic from 'next/dynamic';
import { useUser } from '@clerk/nextjs';
import { X, Crown, Loader2, Lock,ExternalLink } from 'lucide-react';
import FamilyTree from '../../components/FamilyTree';
import Link from 'next/link';


const LifeTimeline = dynamic(() => import('@/components/LifeTimeline'), { ssr: false });
const ToastRecorder = dynamic(() => import('@/components/ToastRecorder'), { ssr: false });
const InvitationDesigner = dynamic(() => import('@/components/InvitationDesigner'), { ssr: false });
const QRCodeGenerator = dynamic(() => import('@/components/QRCodeGenerator'), { ssr: false });


function UpgradeModal({ title, description, onClose, onUpgrade, isUpgrading }) {
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
          <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-600 hover:text-gray-400 hover:bg-white/5 transition">
            <X size={14} />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-[#1A150F] border border-[#D4AF37]/20 flex items-center justify-center text-2xl">
                👑
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-[#AA7C11] to-[#D4AF37] flex items-center justify-center">
                <Crown size={9} className="text-black" />
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]/70 font-medium">პრემიუმ ფუნქცია</p>
              <h3 className="text-base font-semibold text-[#FFF5D6] leading-snug mt-0.5">{title}</h3>
            </div>
          </div>

          <p className="text-sm text-gray-400 font-light leading-relaxed">{description}</p>

          <div className="bg-[#1A150F]/40 border border-[#D4AF37]/10 rounded-xl p-4 space-y-2.5">
            <p className="text-[11px] uppercase tracking-widest text-[#c1a362]/60 mb-3">მარადიული პაკეტი მოიცავს</p>
            {[
              'ულიმიტო აუდიო სადღეგრძელო',
              'ულიმიტო მოსაწვევი ბარათი',
              'QR კოდი საფლავის ქვისთვის',
              'ულიმიტო ცხოვრების ქრონოლოგია',
              '3D ვირტუალური სასაფლაო',
              'ულიმიტო HD ფოტოგალერეა',
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
            {isUpgrading
              ? <><Loader2 size={15} className="animate-spin" /> მიმდინარეობს...</>
              : <><Crown size={15} /> განაახლე — 49.99 ₾</>
            }
          </button>

          <p className="text-center text-[11px] text-gray-600">BOG-ის დაცული გადახდის გვერდზე გადახვალთ</p>
        </div>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
      </div>
    </div>
  );
}


function PremiumBanner({ message, onUpgrade }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-[#1A150F]/40 border border-[#D4AF37]/20 mb-6">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <Lock size={13} className="text-[#c1a362]/70 shrink-0" />
        {message}
      </div>
      <button
        onClick={onUpgrade}
        className="flex items-center gap-1.5 whitespace-nowrap ml-4 px-4 py-2 rounded-lg bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black text-xs font-bold transition hover:brightness-110"
      >
        <Crown size={11} /> განაახლე
      </button>
    </div>
  );
}


const TAB_LABELS = {
  record: 'აუდიო',
  invite: 'მოსაწვევი',
  qr: 'QR კოდი',
  timeline: 'ქრონოლოგია',
  family: 'გენეალოგიური ხე'
};

const MODAL_CONTENT = {
  record:   { title: 'ულიმიტო აუდიო სადღეგრძელო', description: 'უფასო პაკეტში მხოლოდ 1 სადღეგრძელოს ჩაწერაა შესაძლებელი. განაახლეთ პაკეტი ულიმიტო ჩანაწერებისთვის.' },
  invite:   { title: 'ულიმიტო მოსაწვევი ბარათი',  description: 'უფასო პაკეტში მხოლოდ 1 მოსაწვევის შექმნაა შესაძლებელი. განაახლეთ პაკეტი ულიმიტო მოსაწვევებისთვის.' },
  qr:       { title: 'QR კოდის გენერაცია',          description: 'QR კოდის გენერაცია მხოლოდ პრემიუმ პაკეტშია ხელმისაწვდომი.' },
  timeline: { title: 'ულიმიტო ქრონოლოგია',          description: 'უფასო პაკეტში მაქსიმუმ 2 მოვლენის დამატებაა შესაძლებელი. განაახლეთ პაკეტი ულიმიტო ქრონოლოგიისთვის.' },
  family:   { title: 'გენეალოგიური ხე — ულიმიტო',         description: 'უფასო პაკეტში მაქსიმუმ 3 წევრის დამატებაა შესაძლებელი. განაახლეთ პაკეტი ულიმიტო ოჯახის ხისთვის.' },
};


function ServicesContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMemorial, setSelectedMemorial] = useState(null);
  const [activeTab, setActiveTab] = useState('record');
  const [upgradeModal, setUpgradeModal] = useState(null); 
  const [isUpgrading, setIsUpgrading] = useState(false);

  const { user } = useUser();
  const isPremium = useQuery(api.pricing.isPremium) ?? false;
  const memorials = useQuery(api.memorials.getAllPublicMemorials);


  const myToasts = useQuery(
    api.services.getMyToastsForMemorial,
    selectedMemorial ? { memorialId: selectedMemorial._id } : 'skip'
  );
  const myInvitations = useQuery(
    api.services.getMyInvitationsForMemorial,
    selectedMemorial ? { memorialId: selectedMemorial._id } : 'skip'
  );
  const timelineEntries = useQuery(
    api.services.getTimelineEntries,
    selectedMemorial ? { memorialId: selectedMemorial._id } : 'skip'
  );

  const toastLimitReached   = !isPremium && (myToasts?.length ?? 0) >= 1;
  const inviteLimitReached  = !isPremium && (myInvitations?.length ?? 0) >= 1;
  const timelineLimitReached = !isPremium && (timelineEntries?.length ?? 0) >= 2;

  //transliteration
  const GEO_TO_LAT = {
    'ა':'a','ბ':'b','გ':'g','დ':'d','ე':'e','ვ':'v','ზ':'z',
    'თ':'t','ი':'i','კ':'k','ლ':'l','მ':'m','ნ':'n','ო':'o',
    'პ':'p','ჟ':'zh','რ':'r','ს':'s','ტ':'t','უ':'u','ფ':'f',
    'ქ':'q','ღ':'gh','ყ':'q','შ':'sh','ჩ':'ch','ც':'ts','ძ':'dz',
    'წ':'ts','ჭ':'ch','ხ':'kh','ჯ':'j','ჰ':'h'
  };
  

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

  const geoToLat = (str) =>
  str.split('').map((c) => GEO_TO_LAT[c] ?? c).join('').toLowerCase();


const filteredMemorials = memorials?.filter((m) => {
  const query = searchQuery.toLowerCase().trim();
  if (!query) return false;

  const fullGeo = `${m.firstName} ${m.lastName}`.toLowerCase();
  const fullLat = geoToLat(`${m.firstName} ${m.lastName}`);

  return fullGeo.includes(query) || fullLat.includes(query);
});
  const handleTabClick = (tab) => {
    if (tab === 'qr' && !isPremium) {
      setUpgradeModal('qr');
      return;
    }
    setActiveTab(tab);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 pt-24 text-white min-h-screen">
      {upgradeModal && (
        <UpgradeModal
          title={MODAL_CONTENT[upgradeModal].title}
          description={MODAL_CONTENT[upgradeModal].description}
          onClose={() => setUpgradeModal(null)}
          onUpgrade={handleUpgrade}
          isUpgrading={isUpgrading}
        />
      )}

      <h1 className="text-3xl font-serif text-[#FFF5D6] mb-8">სამგლოვიარო სერვისები</h1>

      {!selectedMemorial ? (
        <div className="bg-[#121214]/50 p-8 border border-[#c1a362]/20 rounded-2xl">
          <h2 className="text-[#c1a362] mb-4">მოძებნეთ მემორიალი:</h2>
          <input
            type="text"
            className="w-full bg-black border border-[#c1a362]/30 p-3 rounded-lg text-white"
            placeholder="ჩაწერეთ სახელი ან გვარი..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="mt-4 space-y-2">
            {searchQuery.length > 0 && filteredMemorials?.map((m) => (
              <button
                key={m._id}
                onClick={() => setSelectedMemorial(m)}
                className="block w-full text-left p-3 hover:bg-[#D4AF37]/10 rounded border border-transparent hover:border-[#D4AF37]/20 transition"
              >
                {m.firstName} {m.lastName}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <button
            onClick={() => setSelectedMemorial(null)}
            className="text-sm text-gray-500 mb-4 hover:text-[#c1a362]"
          >
            ← უკან დაბრუნება
          </button>

          <div className="flex items-center gap-3 mb-6 p-4 bg-[#1A150F]/60 border border-[#c1a362]/20 rounded-xl">
  <div className="w-9 h-9 rounded-full bg-[#c1a362]/10 border border-[#c1a362]/30 flex items-center justify-center text-[#c1a362] font-bold text-sm shrink-0">
    {selectedMemorial.firstName?.[0]}
  </div>
  <div className="flex-1 min-w-0">
    <p className="text-[10px] uppercase tracking-widest text-[#c1a362]/60 mb-0.5">სერვისები შემდეგი პირისთვის</p>
    <p className="text-[#FFF5D6] font-semibold text-base leading-tight">
      {selectedMemorial.firstName} {selectedMemorial.lastName}
    </p>
  </div>
  <Link
    href={`/discover/${selectedMemorial.urlSlug}`}
    target="_blank"
    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/5 text-gray-400 hover:text-[#c1a362] hover:border-[#c1a362]/20 transition-all text-xs shrink-0"
  >
    <ExternalLink size={13} />
    <span className="hidden sm:inline">მემორიალი</span>
  </Link>
</div>

          
          <div className="flex gap-4 mb-8 border-b border-white/10 pb-4">
            {(['record', 'invite', 'qr', 'timeline', 'family'] ).map((tab) => {
              const isLocked = tab === 'qr' && !isPremium;
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => handleTabClick(tab)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm transition ${
                    isActive
                      ? 'bg-[#c1a362] text-black font-bold'
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {isLocked && <Lock size={11} className="text-[#c1a362]/60" />}
                  {TAB_LABELS[tab]}
                </button>
              );
            })}
          </div>

          <div className="bg-[#121214]/50 p-8 border border-[#c1a362]/20 rounded-2xl min-h-[400px]">
            <h2 className="text-xl text-[#FFF5D6] mb-6">
              {activeTab === 'record' ? 'აუდიო სადღეგრძელო' :
               activeTab === 'invite' ? 'მოსაწვევი ბარათი' :
               activeTab === 'timeline' ? 'ქრონოლოგია' :
               activeTab === 'family' ? 'გენეალოგიური ხე' : 'QR კოდის გენერაცია'}
            </h2>

           
            {activeTab === 'record' && (
              <>
                {toastLimitReached && (
                  <PremiumBanner
                    message="უფასო პაკეტში მხოლოდ 1 სადღეგრძელოა დაშვებული."
                    onUpgrade={() => setUpgradeModal('record')}
                  />
                )}
                <div className={toastLimitReached ? 'pointer-events-none opacity-40 select-none' : ''}>
                  <ToastRecorder memorialId={selectedMemorial._id} />
                </div>
              </>
            )}

            
            {activeTab === 'invite' && selectedMemorial?.creatorId !== user?.id && (
              <p className="text-gray-500">მხოლოდ მემორიალის შემქმნელს შეუძლია მოსაწვევის დიზაინის შექმნა.</p>
            )}
            {activeTab === 'invite' && selectedMemorial?.creatorId === user?.id && (
              <>
                {inviteLimitReached && (
                  <PremiumBanner
                    message="უფასო პაკეტში მხოლოდ 1 მოსაწვევია დაშვებული."
                    onUpgrade={() => setUpgradeModal('invite')}
                  />
                )}
                <div className={inviteLimitReached ? 'pointer-events-none opacity-40 select-none' : ''}>
                  <InvitationDesigner memorial={selectedMemorial} />
                </div>
              </>
            )}

         
            {activeTab === 'qr' && (
              <QRCodeGenerator memorial={selectedMemorial} />
            )}

         
            {activeTab === 'timeline' && (
              <>
                {timelineLimitReached && (
                  <PremiumBanner
                    message="უფასო პაკეტში მაქსიმუმ 2 მოვლენის დამატებაა შესაძლებელი."
                    onUpgrade={() => setUpgradeModal('timeline')}
                  />
                )}
                <LifeTimeline
                  memorial={selectedMemorial}
                  currentUserId={user?.id}
                  isPremium={isPremium}
                  maxEntries={isPremium ? Infinity : 2}
                  onUpgradeClick={() => setUpgradeModal('timeline')}
                />
              </>
            )}

{activeTab === 'family' && (
  <FamilyTree
    memorial={selectedMemorial}
    currentUserId={user?.id}
    isPremium={isPremium}
  />
)}
          </div>
        </>
      )}
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="text-[#c1a362] p-20">იტვირთება გვერდი...</div>}>
      <ServicesContent />
    </Suspense>
  );
}