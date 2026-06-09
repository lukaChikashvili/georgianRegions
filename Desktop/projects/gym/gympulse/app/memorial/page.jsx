"use client";

import React, { useRef, useState, useCallback } from 'react';
import { User, MapPin, Shield, ChevronRight, ChevronLeft, Sparkles, Mail, Plus, X, CreditCard, Upload, Loader2, Lock, Crown, ImageIcon } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import ProtectedRoutes from '../../components/ProtectedRoutes';



const FEATURE_LABELS = {
  music: {
    title: 'მუსიკალური მოგონება',
    description: 'დაამატეთ YouTube სიმღერა, რომელიც მის ხსოვნას უკავშირდება.',
    icon: '🎵',
  },
  gallery: {
    title: 'ულიმიტო ფოტოგალერეა',
    description: 'უფასო პაკეტში მაქსიმუმ 3 ფოტოა. განაახლეთ ულიმიტო HD გალერეისთვის.',
    icon: '🖼️',
  },
  biography: {
    title: 'სრული ბიოგრაფია',
    description: 'უფასო პაკეტში ბიოგრაფია 1000 სიმბოლოთია შეზღუდული.',
    icon: '📖',
  },
  memorial: {
    title: 'მეტი მემორიალი',
    description: 'უფასო პაკეტში მხოლოდ 1 მემორიალის შექმნაა შესაძლებელი.',
    icon: '🕯️',
  },
};



function UpgradeModal({ feature, onClose, onUpgrade, isUpgrading }) {
  if (!feature) return null;
  const info = FEATURE_LABELS[feature];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
     
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

     
      <div className="relative w-full max-w-md bg-[#0F0F11] border border-[#D4AF37]/20 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-fade-in">

        
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
                {info.icon}
              </div>
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-[#AA7C11] to-[#D4AF37] flex items-center justify-center">
                <Crown size={9} className="text-black" />
              </div>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#D4AF37]/70 font-medium">პრემიუმ ფუნქცია</p>
              <h3 className="text-base font-semibold text-[#FFF5D6] leading-snug mt-0.5">{info.title}</h3>
            </div>
          </div>

          <p className="text-sm text-gray-400 font-light leading-relaxed">{info.description}</p>

        
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



function LockedField({ children, isPremium, onLockClick }) {
  if (isPremium) return <>{children}</>;

  return (
    <div className="relative">
      <div className="pointer-events-none opacity-40 select-none">{children}</div>
      <button
        type="button"
        onClick={onLockClick}
        className="absolute inset-0 w-full h-full flex items-center justify-center gap-2 rounded-xl bg-black/20 border border-[#D4AF37]/20 hover:bg-[#1A150F]/40 hover:border-[#D4AF37]/40 transition group cursor-pointer"
      >
        <Lock size={13} className="text-[#D4AF37]/70 group-hover:text-[#D4AF37] transition" />
        <span className="text-xs text-[#D4AF37]/70 group-hover:text-[#D4AF37] transition font-medium">
          პრემიუმი საჭიროა
        </span>
      </button>
    </div>
  );
}



const CreateMemorial = () => {

  const convertYouTube = (url) => {
    if (!url) return "";
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${parsedUrl.pathname.slice(1)}`;
      if (parsedUrl.searchParams.get("v")) return `https://www.youtube.com/embed/${parsedUrl.searchParams.get("v")}`;
      if (url.includes("youtube.com/embed/")) return url;
      return "";
    } catch { return ""; }
  };

  const { user } = useUser();
  const isPremium = useQuery(api.pricing.isPremium) ?? false;
  const myMemorials = useQuery(api.memorials.getMyMemorials, 
    user ? { creatorId: user.id } : "skip"
  );
  const [upgradeModal, setUpgradeModal] = useState(null);
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

  
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [aiInputs, setAiInputs] = useState({ profession: '', hobbies: '', achievements: '', personalityTraits: '' });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const handleGenerateBiography = async () => {
    setAiLoading(true);
    setAiError('');
    try {
      const res = await fetch('/api/generate-biography', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: formData.firstName, lastName: formData.lastName, birthDate: formData.birthDate, deathDate: formData.deathDate, ...aiInputs }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setFormData((prev) => ({ ...prev, biography: data.biography }));
      setAiPanelOpen(false);
    } catch (err) {
      setAiError(err instanceof Error ? err.message : 'შეცდომა');
    } finally {
      setAiLoading(false);
    }
  };

  const router = useRouter();


  const createMemorialMutation = useMutation(api.memorials.createMemorial);
  const generateUploadUrl = useMutation(api.services.generateUploadUrl);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const portraitInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const [portraitFile, setPortraitFile] = useState(null);
  const [portraitPreview, setPortraitPreview] = useState('');
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', birthDate: '', deathDate: '', location: '',
    epitaph: '', funeralLocation: '', funeralTime: '', cemeteryLocation: '',
    biography: '', enableCandle: true, urlSlug: '', privacyType: 'public',
    requireModeration: false, enableDonations: false, favoriteSongUrl: '',
    bankName: 'bog', bankAccountIban: '', showFuneralDetails: false,
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const checked = (e.target ).checked;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };


  
  const slugAvailable = useQuery(
    api.memorials.getMemorialBySlug,
    formData.urlSlug.trim().length > 2
      ? { urlSlug: formData.urlSlug.toLowerCase().trim().replace(/\s+/g, '-') }
      : "skip"
  );
  
  const isSlugTaken = slugAvailable !== null && slugAvailable !== undefined;
 
  const handleBiographyChange = (e) => {
    const val = e.target.value;
    if (!isPremium && val.length > 1000) {
      setUpgradeModal('biography');
      return;
    }
    setFormData((prev) => ({ ...prev, biography: val }));
  };

  const handlePortraitUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('გთხოვთ აირჩიოთ სურათის ფაილი.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('ფაილის ზომა არ უნდა აღემატებოდეს 10MB-ს.'); return; }
    if (portraitPreview) URL.revokeObjectURL(portraitPreview);
    setPortraitFile(file);
    setPortraitPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleRemovePortrait = () => {
    if (portraitPreview) URL.revokeObjectURL(portraitPreview);
    setPortraitFile(null);
    setPortraitPreview('');
    if (portraitInputRef.current) portraitInputRef.current.value = '';
  };

  const handleGalleryUpload = (e) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

   
    if (!isPremium && galleryFiles.length + imageFiles.length > 3) {
      setUpgradeModal('gallery');
      if (galleryInputRef.current) galleryInputRef.current.value = '';
      return;
    }

    const oversized = imageFiles.find((f) => f.size > 10 * 1024 * 1024);
    if (oversized) { setError(`"${oversized.name}" ფაილი აჭარბებს 10MB ლიმიტს.`); return; }

    const newPreviews = imageFiles.map((f) => URL.createObjectURL(f));
    setGalleryFiles((prev) => [...prev, ...imageFiles]);
    setGalleryPreviews((prev) => [...prev, ...newPreviews]);
    if (galleryInputRef.current) galleryInputRef.current.value = '';
    setError('');
  };

  const handleRemoveGallery = (idx) => {
    URL.revokeObjectURL(galleryPreviews[idx]);
    setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  const uploadFile = async (file) => {
    const uploadUrl = await generateUploadUrl();
    const result = await fetch(uploadUrl, { method: 'POST', headers: { 'Content-Type': file.type }, body: file });
    if (!result.ok) throw new Error(`ფაილის ატვირთვა ვერ მოხერხდა: ${file.name}`);
    const { storageId } = await result.json();
    return storageId;
  };

  const handleSubmit = async () => {
    if (isSlugTaken) {
      setError('ეს ბმული უკვე დაკავებულია, გთხოვთ აირჩიოთ სხვა.');
      setStep(5);
      return;
    }
    
    if (!user) { setError('მემორიალის გამოსაქვეყნებლად საჭიროა ავტორიზაცია.'); return; }

    if (!isPremium && myMemorials && myMemorials.length >= 1) {
      setUpgradeModal('memorial');
      return;
    }


    if (!formData.firstName.trim() || !formData.lastName.trim()) { setError('გთხოვთ, შეავსოთ სახელი და გვარი.'); setStep(1); return; }
    if (!formData.birthDate || !formData.deathDate) { setError('გთხოვთ, მიუთითოთ როგორც დაბადების, ისე გარდაცვალების თარიღი.'); setStep(1); return; }
    if (formData.enableDonations && !formData.bankAccountIban.trim()) { setError('საფინანსო მხარდაჭერის ჩართვისას საბანკო ანგარიშის (IBAN) შევსება სავალდებულოა.'); setStep(4); return; }
    if (!formData.urlSlug.trim()) { setError('გთხოვთ, მიუთითოთ გვერდის უნიკალური ბმული.'); setStep(5); return; }

    const birth = new Date(formData.birthDate);
    const death = new Date(formData.deathDate);
    const now = new Date();
    if (birth > now) { setError('დაბადების თარიღი ვერ იქნება მომავალში.'); setStep(1); return; }
    if (death > now) { setError('გარდაცვალების თარიღი ვერ იქნება მომავალში.'); setStep(1); return; }
    if (birth > death) { setError('გარდაცვალების თარიღი ვერ იქნება დაბადების თარიღზე ადრე.'); setStep(1); return; }

    setIsSubmitting(true);
    setError('');

    try {
      let uploadedPortraitId = undefined;
      if (portraitFile) uploadedPortraitId = await uploadFile(portraitFile);

      const uploadedGalleryIds = [];
      for (const file of galleryFiles) uploadedGalleryIds.push(await uploadFile(file));

      const resultId = await createMemorialMutation({
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        deathDate: formData.deathDate,
        location: formData.location,
        epitaph: formData.epitaph,
        biography: formData.biography,
        funeralLocation: formData.showFuneralDetails ? formData.funeralLocation : undefined,
        funeralTime: formData.showFuneralDetails ? formData.funeralTime : undefined,
        cemeteryLocation: formData.showFuneralDetails ? formData.cemeteryLocation : undefined,
        enableCandle: formData.enableCandle,
        favoriteSongUrl: formData.favoriteSongUrl || undefined,
        urlSlug: formData.urlSlug.toLowerCase().trim().replace(/\s+/g, '-'),
        privacyType: formData.privacyType,
        requireModeration: formData.requireModeration,
        creatorId: user.id,
        creatorName: user.fullName || user.firstName || 'ანონიმური',
        mainPortraitUrl: uploadedPortraitId,
        galleryUrls: uploadedGalleryIds.length > 0 ? uploadedGalleryIds : undefined,
        enableDonations: formData.enableDonations,
        bankName: formData.enableDonations ? formData.bankName : undefined,
        bankAccountIban: formData.enableDonations ? formData.bankAccountIban.trim() : undefined,
      });

      if (resultId) router.push(`/discover/${formData.urlSlug}`);
    } catch (err) {
     
      setError(err instanceof Error ? err.message : 'დაფიქსირდა შეცდომა. გთხოვთ სცადოთ ხელახლა.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoutes>
      
      <UpgradeModal
        feature={upgradeModal}
        onClose={() => setUpgradeModal(null)}
        onUpgrade={handleUpgrade}
        isUpgrading={isUpgrading}
      />

      <div className="min-h-screen bg-[#0D0D0F] text-gray-300 font-sans selection:bg-[#D4AF37] selection:text-black py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-125 bg-linear-to-b from-[#1A150F] to-transparent opacity-40 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">

         
          {isPremium && (
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A150F]/60 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-medium">
                <Crown size={11} />
                მარადიული პაკეტი აქტიურია
              </div>
            </div>
          )}

        
          <div className="mb-12 flex items-center justify-center max-w-xl mx-auto relative px-4">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <div key={num} className="flex items-center relative z-10">
                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border flex items-center justify-center text-[10px] md:text-xs font-medium transition-all duration-500 ${
                  step >= num
                    ? 'bg-linear-to-r from-[#AA7C11] to-[#D4AF37] border-transparent text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                    : 'bg-[#121214]/60 border-white/5 text-gray-500'
                }`}>{num}</div>
                {num < 6 && (
                  <div className={`w-4 sm:w-8 md:w-20 h-px mx-1 md:mx-2 transition-all duration-500 ${step > num ? 'bg-[#D4AF37]/50' : 'bg-white/5'}`} />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 max-w-3xl mx-auto p-4 rounded-xl bg-red-950/20 border border-red-500/20 text-red-400 text-sm font-light text-center backdrop-blur-md">
              {error}
            </div>
          )}

          <div className="bg-[#121214]/40 border border-white/5 rounded-2xl p-8 md:p-10 backdrop-blur-xl shadow-2xl transition-all duration-300">

        
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="mb-6">
                  <h2 className="font-serif text-2xl lg:text-3xl text-[#FFF5D6] font-light flex items-center gap-2">
                    <User size={20} className="text-[#D4AF37]" /> ძირითადი ინფორმაცია
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">შეიყვანეთ გარდაცვლილის პერსონალური მონაცემები.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-400 font-light tracking-wide">სახელი</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="მაგ: ალექსანდრე" className="form-input" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-400 font-light tracking-wide">გვარი</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="მაგ: ბერიძე" className="form-input" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-400 font-light tracking-wide">დაბადების თარიღი</label>
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="form-input appearance-none" style={{ colorScheme: 'dark' }} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-400 font-light tracking-wide">გარდაცვალების თარიღი</label>
                    <input type="date" name="deathDate" value={formData.deathDate} onChange={handleChange} className="form-input" style={{ colorScheme: 'dark' }} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-400 font-light tracking-wide">დაბადების / ცხოვრების ადგილი</label>
                  <div className="relative">
                    <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="მაგ: თბილისი, საქართველო" className="form-input pr-10" />
                    <MapPin size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-400 font-light tracking-wide">მთავარი პორტრეტი</label>
                  <input ref={portraitInputRef} type="file" accept="image/*" onChange={handlePortraitUpload} className="hidden" />
                  {portraitPreview ? (
                    <div className="flex items-center gap-4">
                      <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-white/10 shrink-0">
                        <img src={portraitPreview} alt="პორტრეტი" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-xs text-gray-400 font-light">{portraitFile?.name}</p>
                        <p className="text-[11px] text-gray-600">{portraitFile && (portraitFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        <div className="flex gap-2">
                          <button type="button" onClick={() => portraitInputRef.current?.click()} className="cursor-pointer text-xs text-[#D4AF37] hover:text-[#E5C158] border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 px-3 py-1.5 rounded-lg transition">შეცვლა</button>
                          <button type="button" onClick={handleRemovePortrait} className="cursor-pointer text-xs text-gray-500 hover:text-red-400 border border-white/5 hover:border-red-500/20 px-3 py-1.5 rounded-lg transition">წაშლა</button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button type="button" onClick={() => portraitInputRef.current?.click()} className="cursor-pointer w-full flex flex-col items-center justify-center gap-2 py-8 rounded-xl border border-dashed border-white/10 hover:border-[#D4AF37]/30 hover:bg-[#1A150F]/20 transition text-gray-500 hover:text-[#D4AF37]">
                      <Upload size={22} />
                      <span className="text-xs font-light">დააწკაპუნეთ პორტრეტის ასატვირთად</span>
                      <span className="text-[11px] text-gray-600">JPG, PNG, WEBP · მაქს. 10MB</span>
                    </button>
                  )}
                </div>
              </div>
            )}

         
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="mb-6">
                  <h2 className="font-serif text-2xl lg:text-3xl text-[#FFF5D6] font-light flex items-center gap-2">
                    <Sparkles size={20} className="text-[#D4AF37]" /> ცხოვრების ისტორია და გალერეა
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">აღწერეთ მისი პიროვნება და ატვირთეთ სამახსოვრო ფოტოები.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-400 font-light tracking-wide">მოკლე ეპიტაფია / ციტატა</label>
                  <input type="text" name="epitaph" value={formData.epitaph} onChange={handleChange} placeholder="მაგ: ადამიანი, რომელმაც სამყარო უფრო ნათელი გახადა..." className="form-input" />
                </div>

                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-400 font-light tracking-wide">ბიოგრაფია / მოგონებები</label>
                    {!isPremium && (
                      <button type="button" onClick={() => setUpgradeModal('biography')} className="flex items-center gap-1 text-[11px] text-[#D4AF37]/60 hover:text-[#D4AF37] transition">
                        <Lock size={10} /> 1000 სიმბოლო / უფასო
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <textarea
                      name="biography"
                      value={formData.biography}
                      onChange={handleBiographyChange}
                      rows={5}
                      placeholder="გააზიარეთ მისი ცხოვრების გზა ან გამოიყენეთ AI დახმარება..."
                      className="form-input resize-none py-3 pr-12"
                    />
                    <button type="button" onClick={() => setAiPanelOpen((prev) => !prev)} title="AI-ით დაწერა" className="absolute top-3 right-3 p-2 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 text-[#D4AF37] transition-all">
                      <Sparkles size={14} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    {!isPremium && formData.biography.length > 900 && (
                      <p className={`text-[11px] ${formData.biography.length >= 900 ? 'text-red-400' : 'text-yellow-600'}`}>
                        {formData.biography.length}/1000 სიმბოლო
                      </p>
                    )}
                    {isPremium && formData.biography && (
                      <p className="text-[11px] text-gray-600 ml-auto">{formData.biography.length} სიმბოლო</p>
                    )}
                  </div>

                  {aiPanelOpen && (
                    <div className="bg-[#1A150F]/30 border border-[#D4AF37]/20 rounded-2xl p-5 flex flex-col gap-4 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles size={14} className="text-[#D4AF37]" />
                          <p className="text-xs text-gray-300 font-medium">AI ბიოგრაფიის გენერატორი</p>
                        </div>
                        <button type="button" onClick={() => setAiPanelOpen(false)} className="text-gray-600 hover:text-gray-400 transition-colors"><X size={14} /></button>
                      </div>
                      <p className="text-xs text-gray-500 font-light leading-relaxed">შეავსეთ რამდენიმე დეტალი — AI დაწერს თბილ ბიოგრაფიას.</p>
                      <div className="bg-black/20 rounded-xl px-3 py-2">
                        <p className="text-[11px] text-gray-500">ავტომატურად: <span className="text-gray-300">{formData.firstName} {formData.lastName}{formData.birthDate && ` • ${formData.birthDate}`}{formData.deathDate && ` — ${formData.deathDate}`}</span></p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { key: 'profession', label: 'პროფესია', placeholder: 'მასწავლებელი, ექიმი...' },
                          { key: 'hobbies', label: 'ჰობი', placeholder: 'მუსიკა, მებაღეობა...' },
                          { key: 'achievements', label: 'მიღწევები', placeholder: 'ოჯახი, კარიერა...' },
                          { key: 'personalityTraits', label: 'ხასიათი', placeholder: 'თბილი, მზრუნველი...' },
                        ].map((field) => (
                          <div key={field.key} className="flex flex-col gap-1.5">
                            <label className="text-[11px] text-gray-500">{field.label}</label>
                            <input type="text" placeholder={field.placeholder} value={(aiInputs)[field.key]} onChange={(e) => setAiInputs((prev) => ({ ...prev, [field.key]: e.target.value }))} className="form-input text-xs py-2" />
                          </div>
                        ))}
                      </div>
                      {aiError && <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{aiError}</p>}
                      <button type="button" onClick={handleGenerateBiography} disabled={aiLoading} className="w-full py-2.5 bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] hover:brightness-110 text-black text-xs font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                        {aiLoading ? <><Loader2 size={13} className="animate-spin" /> იწერება...</> : <><Sparkles size={13} /> ბიოგრაფიის დაწერა</>}
                      </button>
                    </div>
                  )}
                </div>

               
                <div className="flex flex-col gap-3 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-gray-400 font-light tracking-wide">ფოტოგალერეა</label>
                    <div className="flex items-center gap-2">
                      {galleryPreviews.length > 0 && (
                        <span className="text-[11px] text-gray-600">{galleryPreviews.length} ფოტო</span>
                      )}
                      {!isPremium && (
                        <button type="button" onClick={() => setUpgradeModal('gallery')} className="flex items-center gap-1 text-[11px] text-[#D4AF37]/60 hover:text-[#D4AF37] transition">
                          <Lock size={10} /> მაქს. 3 / უფასო
                        </button>
                      )}
                    </div>
                  </div>
                  <input ref={galleryInputRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} className="hidden" />
                  <button
                    type="button"
                    onClick={() => {
                      if (!isPremium && galleryFiles.length >= 3) { setUpgradeModal('gallery'); return; }
                      galleryInputRef.current?.click();
                    }}
                    className="cursor-pointer w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-dashed border-white/10 hover:border-[#D4AF37]/30 hover:bg-[#1A150F]/20 transition text-gray-500 hover:text-[#D4AF37] text-xs font-light"
                  >
                    {!isPremium && galleryFiles.length >= 3
                      ? <><Lock size={13} className="text-[#D4AF37]/60" /> ულიმიტო ფოტოსთვის განაახლეთ პაკეტი</>
                      : <><Plus size={14} /> სურათების ატვირთვა {!isPremium && `(${galleryFiles.length}/3)`}</>
                    }
                  </button>
                  {galleryPreviews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                      {galleryPreviews.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-white/5 bg-[#0D0D0F]">
                          <img src={url} alt="გალერეა" className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-90 group-hover:grayscale-0 transition" />
                          <button type="button" onClick={() => handleRemoveGallery(idx)} className="cursor-pointer absolute top-2 right-2 p-1 rounded-full bg-black/70 hover:bg-red-950/80 border border-white/10 text-gray-400 hover:text-red-400 transition">
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="mb-6">
                  <h2 className="font-serif text-2xl lg:text-3xl text-[#FFF5D6] font-light flex items-center gap-2">
                    <MapPin size={22} className="text-[#D4AF37]" /> სამძიმრისა და დაკრძალვის დეტალები
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">ეს სექცია არჩევითია.</p>
                </div>
                <div className="p-4 rounded-xl bg-[#161619]/30 border border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">დაკრძალვის ღონისძიება <span className="text-[10px] text-gray-600 border border-white/10 px-2 py-0.5 rounded-md font-light">სურვილისამებრ</span></h4>
                      <p className="text-xs text-gray-500 mt-0.5">ჩართეთ თუ გსურთ ახლობლებს ცერემონიის შესახებ აცნობოთ</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input type="checkbox" checked={formData.showFuneralDetails} onChange={(e) => setFormData((prev) => ({ ...prev, showFuneralDetails: e.target.checked }))} className="sr-only peer" />
                      <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-gray-400 peer-checked:after:bg-black after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#AA7C11] peer-checked:to-[#D4AF37]" />
                    </label>
                  </div>
                  {formData.showFuneralDetails && (
                    <div className="mt-5 pt-5 border-t border-white/5 space-y-5 animate-fade-in">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-gray-400 font-light tracking-wide">სამძიმრის / პანაშვიდის ადგილი</label>
                          <input type="text" name="funeralLocation" placeholder="მაგ: საბურთალო, ამაღლების ქ. #12" value={formData.funeralLocation} onChange={handleChange} className="form-input" />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-gray-400 font-light tracking-wide">გამოსვენების დრო</label>
                          <input type="datetime-local" name="funeralTime" value={formData.funeralTime} onChange={handleChange} className="form-input" style={{ colorScheme: 'dark' }} />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-gray-400 font-light tracking-wide">საფლავის / ქელეხის ლოკაცია</label>
                        <input type="text" name="cemeteryLocation" placeholder="მაგ: კუკიის სასაფლაო / რესტორანი შარაგული" value={formData.cemeteryLocation} onChange={handleChange} className="form-input" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#161619]/30 border border-white/5">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300">ციფრული სანთლის გააქტიურება</h4>
                    <p className="text-xs text-gray-500">მნახველებს შეეძლებათ გვერდზე ვირტუალური სანთლის დანთება.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input type="checkbox" name="enableCandle" checked={formData.enableCandle} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-gray-400 peer-checked:after:bg-black after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#AA7C11] peer-checked:to-[#D4AF37]" />
                  </label>
                </div>
                <div className={`p-5 rounded-xl border mt-4 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between gap-4 transition-opacity ${formData.showFuneralDetails ? 'bg-[#161619]/40 border-[#D4AF37]/20 opacity-100' : 'bg-[#161619]/20 border-white/5 opacity-40 pointer-events-none'}`}>
                  <div className="space-y-1 text-center sm:text-left">
                    <h4 className="text-sm font-medium text-gray-200 flex items-center justify-center sm:justify-start gap-2"><Mail size={16} className="text-[#D4AF37]" /> ციფრული მოსაწვევი ბარათი</h4>
                    <p className="text-xs text-gray-500 max-w-sm">{formData.showFuneralDetails ? 'ავტომატურად გენერირდება ტრადიციული ელექტრონული ბარათი.' : 'ხელმისაწვდომია მხოლოდ ცერემონიის ჩართვისას.'}</p>
                  </div>
                  <button type="button" onClick={() => alert('მოსაწვევი ბარათის გენერაცია...')} className="cursor-pointer whitespace-nowrap bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black text-xs font-medium px-4 py-3 rounded-lg shadow-md transition-all">ბარათის ნახვა / გაზიარება</button>
                </div>
              </div>
            )}

       
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="mb-6">
                  <h2 className="font-serif text-2xl lg:text-3xl text-[#FFF5D6] font-light flex items-center gap-2">
                    <CreditCard size={20} className="text-[#D4AF37]" /> ფინანსური მხარდაჭერა
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">ჩართეთ ოჯახის ფინანსური თანადგომის მოდული.</p>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#161619]/30 border border-white/5">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300">მხარდაჭერის მოდულის გააქტიურება</h4>
                    <p className="text-xs text-gray-500">მნახველებს შეეძლებათ ოჯახისთვის თანხის პირდაპირ გადარიცხვა.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input type="checkbox" name="enableDonations" checked={formData.enableDonations} onChange={handleChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-gray-400 peer-checked:after:bg-black after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#AA7C11] peer-checked:to-[#D4AF37]" />
                  </label>
                </div>
                {formData.enableDonations && (
                  <div className="p-5 rounded-xl bg-[#1A150F]/20 border border-[#D4AF37]/20 space-y-5 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-gray-400 font-light tracking-wide">აირჩიეთ ბანკი</label>
                        <select name="bankName" value={formData.bankName} onChange={handleChange} className="form-input bg-[#0D0D0F]">
                          <option value="bog">საქართველოს ბანკი (BOG)</option>
                          <option value="tbc">თიბისი ბანკი (TBC)</option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-2 sm:col-span-2">
                        <label className="text-xs text-gray-400 font-light tracking-wide">საბანკო ანგარიშის ნომერი (IBAN)</label>
                        <input type="text" name="bankAccountIban" maxLength={22} placeholder="მაგ: GE00BG0000000012345678" value={formData.bankAccountIban} onChange={(e) => { e.target.value = e.target.value.toUpperCase().replace(/\s+/g, ''); handleChange(e); }} className="form-input placeholder:text-gray-700" />
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 font-light italic">* ყურადღება: თანხა ჩაირიცხება პირდაპირ მითითებულ ანგარიშზე.</p>
                  </div>
                )}
              </div>
            )}

         
{step === 5 && (
  <div className="space-y-6 animate-fade-in">
    <div className="mb-6">
      <h2 className="font-serif text-2xl lg:text-3xl text-[#FFF5D6] font-light flex items-center gap-2">
        <Shield size={20} className="text-[#D4AF37]" /> კონფიდენციალურობა და ბმული
      </h2>
      <p className="text-xs text-gray-500 mt-1">დაარეგულირეთ გვერდის წვდომისა და უსაფრთხოების პარამეტრები.</p>
    </div>

   
    <div className="flex flex-col gap-2">
      <label className="text-xs text-gray-400 font-light tracking-wide">გვერდის უნიკალური ბმული (URL Slug)</label>
      <div className="relative">
        <input
          type="text"
          name="urlSlug"
          value={formData.urlSlug}
          onChange={handleChange}
          placeholder="მაგ: elene-beridze"
          className={`form-input pr-10 transition-all ${
            formData.urlSlug.trim().length > 2 && isSlugTaken
              ? 'border-red-500/40 focus:border-red-500/60'
              : formData.urlSlug.trim().length > 2 && !isSlugTaken && slugAvailable !== undefined
              ? 'border-green-500/40 focus:border-green-500/60'
              : ''
          }`}
        />
        {formData.urlSlug.trim().length > 2 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {slugAvailable === undefined ? (
              <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-600 border-t-[#D4AF37] animate-spin" />
            ) : isSlugTaken ? (
              <div className="w-4 h-4 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <X size={9} className="text-red-400" />
              </div>
            ) : (
              <div className="w-4 h-4 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                  <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>
      {formData.urlSlug.trim().length > 2 && (
        <p className={`text-[11px] transition-all ${isSlugTaken ? 'text-red-400' : 'text-gray-600'}`}>
          {isSlugTaken
            ? '✗ ეს ბმული უკვე დაკავებულია, სცადეთ სხვა'
            : slugAvailable === undefined
            ? ''
            : `✓ memorialy.ge/discover/${formData.urlSlug.toLowerCase().trim().replace(/\s+/g, '-')}`
          }
        </p>
      )}
    </div>

    
    <div className="flex flex-col gap-3 pt-2">
      <label className="text-xs text-gray-400 font-light tracking-wide">წვდომის ტიპი</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label className={`p-4 rounded-xl border flex flex-col gap-1 cursor-pointer transition ${formData.privacyType === 'public' ? 'bg-[#1A150F]/20 border-[#D4AF37]/30' : 'bg-[#161619]/20 border-white/5'}`}>
          <div className="flex items-center gap-2">
            <input type="radio" name="privacyType" value="public" checked={formData.privacyType === 'public'} onChange={handleChange} className="accent-[#D4AF37]" />
            <span className="text-sm font-medium text-gray-300">საჯარო (Public)</span>
          </div>
          <span className="text-xs text-gray-500 pl-5">მემორიალი ხელმისაწვდომია ყველასთვის.</span>
        </label>
        <label className={`p-4 rounded-xl border flex flex-col gap-1 cursor-pointer transition ${formData.privacyType === 'private' ? 'bg-[#1A150F]/20 border-[#D4AF37]/30' : 'bg-[#161619]/20 border-white/5'}`}>
          <div className="flex items-center gap-2">
            <input type="radio" name="privacyType" value="private" checked={formData.privacyType === 'private'} onChange={handleChange} className="accent-[#D4AF37]" />
            <span className="text-sm font-medium text-gray-300">პირადი (Private)</span>
          </div>
          <span className="text-xs text-gray-500 pl-5">ხელმისაწვდომია მხოლოდ პირდაპირი ბმულით.</span>
        </label>
      </div>
    </div>

    
    <div className="flex items-center justify-between p-4 rounded-xl bg-[#161619]/30 border border-white/5 mt-4">
      <div>
        <h4 className="text-sm font-medium text-gray-300">სამძიმრის კედლის მოდერაცია</h4>
        <p className="text-xs text-gray-500">პოსტები გამოჩნდება მხოლოდ თქვენი დასტურის შემდეგ.</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" name="requireModeration" checked={formData.requireModeration} onChange={handleChange} className="sr-only peer" />
        <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-gray-400 peer-checked:after:bg-black after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#AA7C11] peer-checked:to-[#D4AF37]" />
      </label>
    </div>
  </div>
)}

            
            {step === 6 && (
              <div className="space-y-6 animate-fade-in">
                <div className="mb-6">
                  <h2 className="font-serif text-2xl lg:text-3xl text-[#FFF5D6] font-light flex items-center gap-2">
                    🎵 მუსიკალური მოგონება
                    {!isPremium && <span className="ml-2 flex items-center gap-1 text-[11px] text-[#D4AF37]/70 border border-[#D4AF37]/20 px-2 py-0.5 rounded-full font-sans"><Crown size={9} /> პრემიუმი</span>}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">დაამატეთ YouTube ბმული — სიმღერა, რომელიც მის ხსოვნას უკავშირდება.</p>
                </div>

                <LockedField isPremium={isPremium} onLockClick={() => setUpgradeModal('music')}>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-gray-400">YouTube მუსიკის ბმული</label>
                    <input
                      type="text"
                      name="favoriteSongUrl"
                      value={formData.favoriteSongUrl}
                      onChange={handleChange}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="form-input"
                      disabled={!isPremium}
                    />
                  </div>
                </LockedField>

                {isPremium && formData.favoriteSongUrl && (
                  <div className="flex flex-col items-center gap-8 pt-8 animate-fade-in">
                    <div className="relative group">
                      <div className="w-44 h-44 rounded-full bg-zinc-900 border-4 border-zinc-800 shadow-2xl flex items-center justify-center animate-[spin_8s_linear_infinite] group-hover:[animation-play-state:paused]">
                        <div className="w-[92%] h-[92%] rounded-full border border-zinc-700/40"></div>
                        <div className="absolute w-[70%] h-[70%] rounded-full border border-zinc-700/30"></div>
                        <div className="absolute w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-3 h-3 bg-black rounded-full"></div>
                        </div>
                      </div>
                      <div className="absolute inset-0 rounded-full bg-[#D4AF37]/10 blur-xl opacity-40 group-hover:opacity-60 transition"></div>
                    </div>
                    <div className="w-full max-w-md overflow-hidden rounded-xl border border-white/10 shadow-xl">
                      <iframe className="w-full aspect-video" src={convertYouTube(formData.favoriteSongUrl)} title="მუსიკალური მოგონება" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                    <p className="text-[11px] uppercase tracking-widest text-[#D4AF37]/70 text-center">მუსიკა, რომელიც დარჩა</p>
                  </div>
                )}

             
                {!isPremium && (
                  <div className="mt-4 p-5 rounded-xl bg-[#1A150F]/30 border border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-200 flex items-center gap-2"><Crown size={14} className="text-[#D4AF37]" /> განაახლეთ მარადიულ პაკეტზე</p>
                      <p className="text-xs text-gray-500 mt-1">მუსიკა, ულიმიტო გალერეა, 3D სასაფლაო, QR კოდი და სხვა.</p>
                    </div>
                    <button onClick={() => setUpgradeModal('music')} className="cursor-pointer whitespace-nowrap px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black text-xs font-bold transition hover:brightness-110 flex items-center gap-2">
                      <Crown size={13} /> 49.99 ₾ — სამუდამოდ
                    </button>
                  </div>
                )}
              </div>
            )}

            
            <div className="mt-10 pt-6 border-t border-white/5 flex justify-between">
              <button onClick={prevStep} disabled={step === 1 || isSubmitting} className={`px-5 py-2 rounded-xl border border-white/5 text-xs uppercase tracking-wider font-medium flex items-center gap-2 transition active:scale-[0.98] ${step === 1 || isSubmitting ? 'opacity-0 pointer-events-none' : 'hover:bg-white/5 text-gray-400 cursor-pointer'}`}>
                <ChevronLeft size={14} /> უკან
              </button>
              {step < 6 ? (
                <button onClick={nextStep} className="px-6 py-2 rounded-xl bg-linear-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition active:scale-[0.98] hover:brightness-110 cursor-pointer shadow-lg shadow-[#D4AF37]/5">
                  გაგრძელება <ChevronRight size={14} />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={isSubmitting} className="px-6 py-2 rounded-xl bg-linear-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition active:scale-[0.98] hover:brightness-110 cursor-pointer shadow-lg shadow-[#D4AF37]/20 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isSubmitting ? <><Loader2 size={14} className="animate-spin" /> იტვირთება...</> : 'მემორიალის გამოქვეყნება'}
                </button>
              )}
            </div>
          </div>
        </div>

        <style jsx global>{`
          .form-input {
            width: 100%;
            background-color: rgba(18, 18, 20, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 0.75rem;
            padding: 0.65rem 1rem;
            font-size: 0.875rem;
            color: #e5e7eb;
            transition: all 0.3s ease;
            outline: none;
          }
          .form-input:focus {
            border-color: rgba(212, 175, 55, 0.4);
            box-shadow: 0 0 12px rgba(212, 175, 55, 0.05);
            background-color: rgba(18, 18, 20, 0.6);
          }
          .form-input::placeholder { color: #4b5563; font-weight: 300; }
          .form-input:disabled { opacity: 0.4; cursor: not-allowed; }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fadeIn 0.4s ease forwards; }
        `}</style>
      </div>
    </ProtectedRoutes>
  );
};

export default CreateMemorial;