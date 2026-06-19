"use client";

import { useState, useRef } from "react";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import {
  Building2, Phone, Mail, Globe, MapPin, Plus, Trash2,
  Upload, Save, CheckCircle, ExternalLink, Image as ImageIcon,
  Loader2, Crown, AlertCircle
} from "lucide-react";

const GEORGIAN_CITIES = [
  "თბილისი", "ბათუმი", "ქუთაისი", "რუსთავი", "გორი",
  "ზუგდიდი", "ფოთი", "ხაშური", "სამტრედია", "სენაკი",
  "ზესტაფონი", "მარნეული", "ახალციხე", "ოზურგეთი", "ახმეტა"
];

export default function FuneralHomeDashboard() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const myFuneralHome = useQuery(
    api.funeralHomes.getMyFuneralHome,
    isAuthenticated ? {} : "skip"
  );
  const updateFuneralHome = useMutation(api.funeralHomes.updateFuneralHome);
  const generateUploadUrl = useMutation(api.services.generateUploadUrl); 

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);


  const [form, setForm] = useState(null);
  const [services, setServices] = useState(null);


  if (myFuneralHome && form === null) {
    setForm({
      name: myFuneralHome.name,
      description: myFuneralHome.description,
      city: myFuneralHome.city,
      address: myFuneralHome.address,
      phone: myFuneralHome.phone,
      email: myFuneralHome.email,
      website: myFuneralHome.website || "",
    });
    setServices(myFuneralHome.services || []);
  }

  const updateForm = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const addService = () => {
    setServices(prev => [...prev, { name: "", description: "", price: undefined }]);
    setSaved(false);
  };

  const removeService = (i) => {
    setServices(prev => prev.filter((_, idx) => idx !== i));
    setSaved(false);
  };

  const updateService = (i, key, value) => {
    setServices(prev => prev.map((s, idx) => idx === i ? { ...s, [key]: value } : s));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateFuneralHome({
        id: myFuneralHome._id,
        ...form,
        website: form.website || undefined,
        services: services.filter(s => s.name && s.description),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e.message ?? "შენახვისას მოხდა შეცდომა");
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file, type) => {
    const setUploading = type === "logo" ? setUploadingLogo : setUploadingCover;
    setUploading(true);
    setError(null);
    try {
      const uploadUrl = await generateUploadUrl();
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await result.json();

      await updateFuneralHome({
        id: myFuneralHome._id,
        [type === "logo" ? "logoId" : "coverImageId"]: storageId,
      });
    } catch (e) {
      setError("ფოტოს ატვირთვისას მოხდა შეცდომა");
    } finally {
      setUploading(false);
    }
  };


  if (isLoading || (isAuthenticated && myFuneralHome === undefined)) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
        <Loader2 className="w-8 h-8 text-[#D4AF37]/50 animate-spin" />
      </div>
    );
  }

 
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0A0A0A' }}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h1 className="text-2xl font-serif italic text-[#FFF5D6] mb-3">საჭიროა ავტორიზაცია</h1>
          <SignInButton mode="modal">
            <button className="mt-4 px-8 py-3 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-medium rounded-xl hover:brightness-110 transition-all">
              შესვლა
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }


  if (!myFuneralHome) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0A0A0A' }}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mx-auto mb-6">
            <Building2 className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h1 className="text-2xl font-serif italic text-[#FFF5D6] mb-3">თქვენ არ გაქვთ რეგისტრირებული სამგლოვიარო სახლი</h1>
          <p className="text-gray-500 text-sm mb-8">დაარეგისტრირეთ თქვენი სამგლოვიარო სახლი და დაიწყეთ მუშაობა</p>
          <Link
            href="/funeral-homes/create"
            className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-medium rounded-xl hover:brightness-110 transition-all"
          >
            <Plus className="w-4 h-4" /> რეგისტრაცია
          </Link>
        </div>
      </div>
    );
  }

  if (!form) return null;

  const daysLeft = myFuneralHome.subscriptionExpiresAt
    ? Math.max(0, Math.ceil((myFuneralHome.subscriptionExpiresAt - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="min-h-screen py-16 px-6 mt-16" style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 0%, #1A150F 0%, #111114 55%, #0D0D0F 100%)' }}>
      <div className="max-w-4xl mx-auto">

       
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-[#D4AF37] text-xs uppercase tracking-widest mb-2">მართვის პანელი</p>
            <h1 className="text-2xl font-serif italic text-[#FFF5D6]">{myFuneralHome.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/funeral-homes/${myFuneralHome._id}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/30 text-sm transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" /> ნახვა
            </Link>
          </div>
        </div>

    
        <div className={`mb-8 p-4 rounded-xl border flex items-center gap-3 ${
          myFuneralHome.subscriptionStatus === "trial"
            ? "bg-[#D4AF37]/5 border-[#D4AF37]/15"
            : myFuneralHome.subscriptionStatus === "active"
            ? "bg-green-500/5 border-green-500/15"
            : "bg-red-500/5 border-red-500/15"
        }`}>
          <Crown className={`w-5 h-5 shrink-0 ${
            myFuneralHome.subscriptionStatus === "trial" ? "text-[#D4AF37]" :
            myFuneralHome.subscriptionStatus === "active" ? "text-green-400" : "text-red-400"
          }`} />
          <div className="flex-1">
            {myFuneralHome.subscriptionStatus === "trial" && (
              <p className="text-sm text-gray-300">
                საცდელი პერიოდი — დარჩენილია <span className="text-[#D4AF37] font-medium">{daysLeft} დღე</span>
              </p>
            )}
            {myFuneralHome.subscriptionStatus === "active" && (
              <p className="text-sm text-gray-300">გამოწერა აქტიურია</p>
            )}
            {myFuneralHome.subscriptionStatus === "expired" && (
              <p className="text-sm text-gray-300">გამოწერა ამოიწურა — გაანახლეთ რომ თქვენი გვერდი დარჩეს აქტიური</p>
            )}
          </div>
          {myFuneralHome.subscriptionStatus !== "active" && (
            <button className="px-4 py-2 rounded-lg bg-[#D4AF37]/15 text-[#D4AF37] text-xs font-medium hover:bg-[#D4AF37]/25 transition-colors shrink-0">
              გამოწერის შეძენა
            </button>
          )}
        </div>

        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

    
        <div className="mb-8 p-6 rounded-2xl border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <h2 className="text-[#D4AF37] text-xs uppercase tracking-widest mb-5 flex items-center gap-2">
            <ImageIcon className="w-3.5 h-3.5" /> ფოტოები
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div>
              <label className="block text-xs text-gray-400 mb-2">ლოგო</label>
              <button
                onClick={() => logoInputRef.current?.click()}
                disabled={uploadingLogo}
                className="w-full h-36 rounded-xl border border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center gap-2 hover:border-[#D4AF37]/30 transition-colors overflow-hidden relative"
              >
                {myFuneralHome.logoUrl ? (
                  <img src={myFuneralHome.logoUrl} alt="logo" className="w-full h-full object-cover" />
                ) : uploadingLogo ? (
                  <Loader2 className="w-6 h-6 text-[#D4AF37]/50 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span className="text-xs text-gray-600">ატვირთვა</span>
                  </>
                )}
              </button>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], "logo")}
              />
            </div>

            
            <div>
              <label className="block text-xs text-gray-400 mb-2">სარეკლამო ფოტო</label>
              <button
                onClick={() => coverInputRef.current?.click()}
                disabled={uploadingCover}
                className="w-full h-36 rounded-xl border border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center justify-center gap-2 hover:border-[#D4AF37]/30 transition-colors overflow-hidden relative"
              >
                {myFuneralHome.coverUrl ? (
                  <img src={myFuneralHome.coverUrl} alt="cover" className="w-full h-full object-cover" />
                ) : uploadingCover ? (
                  <Loader2 className="w-6 h-6 text-[#D4AF37]/50 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span className="text-xs text-gray-600">ატვირთვა</span>
                  </>
                )}
              </button>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], "cover")}
              />
            </div>
          </div>
        </div>

      
        <div className="mb-8 p-6 rounded-2xl border border-white/5 space-y-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <h2 className="text-[#D4AF37] text-xs uppercase tracking-widest mb-1 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5" /> ძირითადი ინფორმაცია
          </h2>

          <div>
            <label className="block text-xs text-gray-400 mb-2">სახელი</label>
            <input
              value={form.name}
              onChange={e => updateForm("name", e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2">აღწერა</label>
            <textarea
              value={form.description}
              onChange={e => updateForm("description", e.target.value)}
              rows={4}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37]/40 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2">ქალაქი</label>
              <select
                value={form.city}
                onChange={e => updateForm("city", e.target.value)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
              >
                {GEORGIAN_CITIES.map(city => (
                  <option key={city} value={city} className="bg-[#111114]">{city}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">მისამართი</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  value={form.address}
                  onChange={e => updateForm("address", e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-2">ტელეფონი</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  value={form.phone}
                  onChange={e => updateForm("phone", e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-2">ელ-ფოსტა</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input
                  value={form.email}
                  onChange={e => updateForm("email", e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2">ვებ-საიტი</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                value={form.website}
                onChange={e => updateForm("website", e.target.value)}
                placeholder="https://..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
              />
            </div>
          </div>
        </div>

       
        <div className="mb-8 p-6 rounded-2xl border border-white/5" style={{ background: 'rgba(255,255,255,0.02)' }}>
          <h2 className="text-[#D4AF37] text-xs uppercase tracking-widest mb-5">სერვისები</h2>

          <div className="space-y-4">
            {services.map((service, i) => (
              <div key={i} className="p-5 rounded-xl border border-white/5 bg-white/[0.02] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">სერვისი #{i + 1}</span>
                  <button onClick={() => removeService(i)} className="text-red-400/60 hover:text-red-400 transition-colors p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  value={service.name}
                  onChange={e => updateService(i, "name", e.target.value)}
                  placeholder="სერვისის სახელი"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
                />
                <textarea
                  value={service.description}
                  onChange={e => updateService(i, "description", e.target.value)}
                  placeholder="აღწერა"
                  rows={2}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]/40 transition-colors resize-none"
                />
                <input
                  type="number"
                  value={service.price ?? ""}
                  onChange={e => updateService(i, "price", e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="ფასი (₾)"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
                />
              </div>
            ))}
          </div>

          <button
            onClick={addService}
            className="w-full mt-4 py-3 rounded-xl border border-dashed border-[#D4AF37]/20 text-[#D4AF37]/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all text-sm flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> სერვისის დამატება
          </button>
        </div>

       
        <div className="sticky bottom-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black text-sm font-medium rounded-xl hover:brightness-110 transition-all disabled:opacity-50 shadow-2xl"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> ინახება...</>
            ) : saved ? (
              <><CheckCircle className="w-4 h-4" /> შენახულია</>
            ) : (
              <><Save className="w-4 h-4" /> ცვლილებების შენახვა</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}