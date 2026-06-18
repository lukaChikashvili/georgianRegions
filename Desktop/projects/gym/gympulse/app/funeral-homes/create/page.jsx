"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { SignInButton } from "@clerk/nextjs";
import { 
  Building2, Phone, Mail, Globe, MapPin, 
  Plus, Trash2, Upload, ChevronRight, ChevronLeft,
  CheckCircle, Image, Briefcase, ImageIcon
} from "lucide-react";

const GEORGIAN_CITIES = [
  "თბილისი", "ბათუმი", "ქუთაისი", "რუსთავი", "გორი",
  "ზუგდიდი", "ფოთი", "ხაშური", "სამტრედია", "სენაკი",
  "ზესტაფონი", "მარნეული", "ახალციხე", "ოზურგეთი", "ახმეტა"
];



const STEPS = ["ინფორმაცია", "სერვისები", "მედია", "დასრულება"];

export default function FuneralHomeRegister() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const createFuneralHome = useMutation(api.funeralHomes.createFuneralHome);

  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

 
  const [form, setForm] = useState({
    name: "",
    description: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    website: "",
  });

  const [services, setServices] = useState([
    { name: "", description: "", price: undefined },
  ]);

  const [logoId, setLogoId] = useState();
  const [coverImageId, setCoverImageId] = useState();
  const [galleryIds, setGalleryIds] = useState([]);

  const updateForm = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));


  const addService = () =>
    setServices((prev) => [...prev, { name: "", description: "", price: undefined }]);

  const removeService = (i) =>
    setServices((prev) => prev.filter((_, idx) => idx !== i));

  const updateService = (i, key, value) =>
    setServices((prev) => prev.map((s, idx) => idx === i ? { ...s, [key]: value } : s));

  const validateStep = () => {
    if (step === 0) {
      if (!form.name || !form.description || !form.city || !form.address || !form.phone || !form.email)
        return "გთხოვთ შეავსოთ ყველა სავალდებულო ველი";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        return "ელ-ფოსტა არასწორი ფორმატია";
    }
    if (step === 1) {
      if (services.some(s => !s.name || !s.description))
        return "გთხოვთ შეავსოთ სერვისების სახელი და აღწერა";
    }
    return null;
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) { setError(err); return; }
    setError(null);
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    try {
      const id = await createFuneralHome({
        ...form,
        website: form.website || undefined,
        services: services.filter(s => s.name && s.description),
        logoId: logoId ,
        coverImageId: coverImageId,
        galleryIds: galleryIds.length ? galleryIds  : undefined,
      });
      router.push(`/funeral-homes/${id}?new=true`);
    } catch (e) {
      setError(e.message ?? "დაფიქსირდა შეცდომა");
      setSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0A' }}>
      <div className="w-8 h-8 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
    </div>
  );

  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#0A0A0A' }}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-8 h-8 text-[#D4AF37]" />
        </div>
        <h1 className="text-2xl font-serif italic text-[#FFF5D6] mb-3">რეგისტრაციისთვის შედით სისტემაში</h1>
        <p className="text-gray-500 text-sm mb-8">სამგლოვიარო სახლის დასარეგისტრირებლად საჭიროა ავტორიზაცია</p>
        <SignInButton mode="modal">
          <button className="px-8 py-3 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-medium rounded-xl hover:brightness-110 transition-all">
            შესვლა
          </button>
        </SignInButton>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-16 px-6 mt-12" style={{ background: 'radial-gradient(ellipse 80% 60% at 30% 0%, #1A150F 0%, #111114 55%, #0D0D0F 100%)' }}>
      <div className="max-w-2xl mx-auto">

      
        <div className="text-center mb-12">
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/20 flex items-center justify-center mx-auto mb-5">
            <Building2 className="w-7 h-7 text-[#D4AF37]" />
          </div>
          <h1 className="text-3xl font-serif italic text-[#FFF5D6] mb-2">სამგლოვიარო სახლის რეგისტრაცია</h1>
          <p className="text-gray-400 text-sm">დაარეგისტრირეთ თქვენი სამგლოვიარო სახლი GoldenMemorial-ზე</p>
        </div>

      
        <div className="flex items-center justify-center mb-10 gap-0">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all border ${
                  i < step ? 'bg-[#D4AF37] border-[#D4AF37] text-black' :
                  i === step ? 'border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10' :
                  'border-white/10 text-gray-600 bg-white/[0.02]'
                }`}>
                  {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[10px] mt-1.5 hidden sm:block ${i === step ? 'text-[#D4AF37]' : 'text-gray-600'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-12 sm:w-20 h-px mx-1 mb-5 transition-all ${i < step ? 'bg-[#D4AF37]/50' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

       
        <div className="rounded-2xl border border-[#D4AF37]/10 p-8 backdrop-blur-md" style={{ background: 'rgba(255,255,255,0.02)' }}>

          
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

         
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-[#D4AF37] text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" /> ძირითადი ინფორმაცია
              </h2>

              <div>
                <label className="block text-xs text-gray-400 mb-2">სამგლოვიარო სახლის სახელი *</label>
                <input
                  value={form.name}
                  onChange={e => updateForm("name", e.target.value)}
                  placeholder="მაგ: სამგლოვიარო სახლი მშვიდობა"
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">აღწერა *</label>
                <textarea
                  value={form.description}
                  onChange={e => updateForm("description", e.target.value)}
                  placeholder="მოკლე აღწერა თქვენი სამგლოვიარო სახლის შესახებ..."
                  rows={4}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]/40 transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">ქალაქი *</label>
                  <select
                    value={form.city}
                    onChange={e => updateForm("city", e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#D4AF37]/40 transition-colors appearance-none"
                    style={{ background: 'rgba(255,255,255,0.03)' }}
                  >
                    <option value="" className="bg-[#111114]">აირჩიეთ ქალაქი</option>
                    {GEORGIAN_CITIES.map(city => (
                      <option key={city} value={city} className="bg-[#111114]">{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2">მისამართი *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      value={form.address}
                      onChange={e => updateForm("address", e.target.value)}
                      placeholder="ქუჩა, ნომერი"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">ტელეფონი *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      value={form.phone}
                      onChange={e => updateForm("phone", e.target.value)}
                      placeholder="+995 5XX XXX XXX"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2">ელ-ფოსტა *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                    <input
                      value={form.email}
                      onChange={e => updateForm("email", e.target.value)}
                      placeholder="info@example.ge"
                      type="email"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-2">ვებ-საიტი <span className="text-gray-600">(სურვილისამებრ)</span></label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    value={form.website}
                    onChange={e => updateForm("website", e.target.value)}
                    placeholder="https://yourwebsite.ge"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

    
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-[#D4AF37] text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" /> სერვისები
              </h2>
              <p className="text-gray-500 text-xs -mt-2 mb-4">დაამატეთ სერვისები, რომლებსაც თქვენი სამგლოვიარო სახლი გთავაზობთ</p>

              {services.map((service, i) => (
                <div key={i} className="p-5 rounded-xl border border-white/5 bg-white/[0.02] space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">სერვისი #{i + 1}</span>
                    {services.length > 1 && (
                      <button onClick={() => removeService(i)} className="text-red-400/60 hover:text-red-400 transition-colors p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-2">სერვისის სახელი *</label>
                    <input
                      value={service.name}
                      onChange={e => updateService(i, "name", e.target.value)}
                      placeholder="მაგ: დაკრძალვის ორგანიზება"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-2">აღწერა *</label>
                    <textarea
                      value={service.description}
                      onChange={e => updateService(i, "description", e.target.value)}
                      placeholder="სერვისის მოკლე აღწერა..."
                      rows={2}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]/40 transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-2">ფასი <span className="text-gray-600">(₾, სურვილისამებრ)</span></label>
                    <input
                      type="number"
                      value={service.price ?? ""}
                      onChange={e => updateService(i, "price", e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="მაგ: 500"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-[#D4AF37]/40 transition-colors"
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addService}
                className="w-full py-3 rounded-xl border border-dashed border-[#D4AF37]/20 text-[#D4AF37]/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 transition-all text-sm flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" /> სერვისის დამატება
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-[#D4AF37] text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                <ImageIcon className="w-3.5 h-3.5" /> ფოტოები
              </h2>
              <p className="text-gray-500 text-xs -mt-2 mb-4">ფოტოების ატვირთვა შეგიძლიათ დაარეგისტრირების შემდეგ, დაფიდან</p>

    
              <div className="p-6 rounded-xl border border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-[#D4AF37]/50" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">ლოგო</p>
                  <p className="text-xs text-gray-600 mt-1">ხელმისაწვდომი იქნება დაარეგისტრირების შემდეგ</p>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-dashed border-white/10 bg-white/[0.01] flex flex-col items-center gap-3 text-center">
                <div className="w-12 h-12 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-[#D4AF37]/50" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">სარეკლამო ფოტო (Cover)</p>
                  <p className="text-xs text-gray-600 mt-1">ხელმისაწვდომი იქნება დაარეგისტრირების შემდეგ</p>
                </div>
              </div>
            </div>
          )}

       
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-[#D4AF37] text-xs uppercase tracking-widest mb-6 flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5" /> გადახედვა და დასრულება
              </h2>

              <div className="space-y-3">
                {[
                  { label: "სახელი", value: form.name },
                  { label: "ქალაქი", value: form.city },
                  { label: "მისამართი", value: form.address },
                  { label: "ტელეფონი", value: form.phone },
                  { label: "ელ-ფოსტა", value: form.email },
                  { label: "სერვისები", value: `${services.filter(s => s.name).length} სერვისი` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/5">
                    <span className="text-xs text-gray-500">{label}</span>
                    <span className="text-sm text-[#FFF5D6]/80 text-right max-w-[60%]">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-xl bg-[#D4AF37]/5 border border-[#D4AF37]/10">
                <p className="text-xs text-gray-400 leading-relaxed">
                  რეგისტრაციის შემდეგ, თქვენი განაცხადი განიხილება <span className="text-[#D4AF37]">24 საათის</span> განმავლობაში. 
                  გაქვთ <span className="text-[#D4AF37]">30-დღიანი უფასო საცდელი პერიოდი</span>. 
                  გააქტიურების შემდეგ გამოგიგზავნით შეტყობინებას.
                </p>
              </div>
            </div>
          )}

         
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
            <button
              onClick={() => { setError(null); setStep(s => s - 1); }}
              className={`flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors ${step === 0 ? 'invisible' : ''}`}
            >
              <ChevronLeft className="w-4 h-4" /> უკან
            </button>

            {step < STEPS.length - 1 ? (
              <button
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black text-sm font-medium rounded-xl hover:brightness-110 transition-all"
              >
                შემდეგი <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black text-sm font-medium rounded-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <><div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> გაგზავნა...</>
                ) : (
                  <><CheckCircle className="w-4 h-4" /> განაცხადის გაგზავნა</>
                )}
              </button>
            )}
          </div>
        </div>

       
        <p className="text-center text-xs text-gray-600 mt-6">
          კითხვების შემთხვევაში დაგვიკავშირდით:{" "}
          <a href="mailto:info@goldenmemorial.ge" className="text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors">
            info@goldenmemorial.ge
          </a>
        </p>
      </div>
    </div>
  );
}