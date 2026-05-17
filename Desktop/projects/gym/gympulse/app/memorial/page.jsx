"use client";

import React, { useState } from 'react';
import { User, Calendar, MapPin, Music, Shield, ChevronRight, ChevronLeft, Upload, Sparkles, ImageIcon, Mail, Eye } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const CreateMemorial = () => {
  const router = useRouter();
  const { user } = useUser();
  

  const createMemorialMutation = useMutation(api.memorials.createMemorial);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    deathDate: '',
    location: '',
    epitaph: '',
    biography: '',
    musicTrack: 'piano',
    gravestoneModel: 'classic_marble',
    enableCandle: true,
    urlSlug: '',
    privacyType: 'public',
    requireModeration: false,
    mainPortraitUrl: '',
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };


  const handleSubmit = async () => {
    if (!user) {
      setError('მემორიალის გამოსაქვეყნებლად საჭიროა ავტორიზაცია.');
      return;
    }

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
        setError('გთხოვთ, შეავსოთ სახელი და გვარი.');
        setIsSubmitting(false);
        setStep(1); 
        return;
      }
    
      if (!formData.birthDate || !formData.deathDate) {
        setError('გთხოვთ, მიუთითოთ როგორც დაბადების, ისე გარდაცვალების თარიღი.');
        setIsSubmitting(false);
        setStep(1);
        return;
      }
    
      if (!formData.urlSlug.trim()) {
        setError('გთხოვთ, მიუთითოთ გვერდის უნიკალური ბმული (URL Slug).');
        setIsSubmitting(false);
        setStep(4); 
        return;
      }

      const birth = new Date(formData.birthDate);
  const death = new Date(formData.deathDate);
  const now = new Date();

  if (birth > now) {
    setError('დაბადების თარიღი ვერ იქნება მომავალში.');
    setIsSubmitting(false);
    setStep(1);
    return;
  }

  if (death > now) {
    setError('გარდაცვალების თარიღი ვერ იქნება მომავალში.');
    setIsSubmitting(false);
    setStep(1);
    return;
  }

  if (birth > death) {
    setError('არასწორი თარიღები: გარდაცვალების თარიღი ვერ იქნება დაბადების თარიღზე ადრე.');
    setIsSubmitting(false);
    setStep(1);
    return;
  }

  

    setIsSubmitting(true);
    setError('');

    try {
    
      const resultId = await createMemorialMutation({
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        deathDate: formData.deathDate,
        location: formData.location,
        epitaph: formData.epitaph,
        biography: formData.biography,
        mainPortraitUrl: '',
        musicTrack: formData.musicTrack,
        gravestoneModel: formData.gravestoneModel,
        enableCandle: formData.enableCandle,
        urlSlug: formData.urlSlug.toLowerCase().trim().replace(/\s+/g, '-'), 
        privacyType: formData.privacyType,
        requireModeration: formData.requireModeration,
        creatorId: user.id,
        creatorName: user.fullName || user.firstName || "ანონიმური",
        mainPortraitUrl: formData.mainPortraitUrl.trim() || undefined,
      });

      if (resultId) {
    
        router.push(`/discover/${formData.urlSlug}`);
      }
    } catch (err) {
      
      setError(err instanceof Error ? err.message : 'დაფიქსირდა შეცდომა. გთხოვთ სცადოთ ხელახლა.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-gray-300 font-sans selection:bg-[#D4AF37] selection:text-black py-20 px-6 relative overflow-hidden">
   
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-125 bg-linear-to-b from-[#1A150F] to-transparent opacity-40 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
       
        <div className="mb-12 flex items-center justify-between max-w-md mx-auto relative">
          {[1, 2, 3, 4].map((num) => (
            <div key={num} className="flex items-center relative z-10">
              <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-medium transition-all duration-500 ${
                step >= num 
                  ? 'bg-linear-to-r from-[#AA7C11] to-[#D4AF37] border-transparent text-black font-semibold shadow-[0_0_15px_rgba(212,175,55,0.2)]' 
                  : 'bg-[#121214]/60 border-white/5 text-gray-500'
              }`}>
                {num}
              </div>
              {num < 4 && (
                <div className={`w-16 md:w-24 h-px mx-2 transition-all duration-500 ${
                  step > num ? 'bg-[#D4AF37]/50' : 'bg-white/5'
                }`} />
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
                  <div className="relative">
                    <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="form-input pl-10 appearance-none" style={{ colorScheme: 'dark' }} />
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-400 font-light tracking-wide">გარდაცვალების თარიღი</label>
                  <div className="relative">
                    <input type="date" name="deathDate" value={formData.deathDate} onChange={handleChange} className="form-input pl-10" style={{ colorScheme: 'dark' }} />
                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 font-light tracking-wide">დაბადების / ცხოვრების ადგილი</label>
                <div className="relative">
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="მაგ: თბილისი, საქართველო" className="form-input pl-10" />
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 font-light tracking-wide">მთავარი პორტრეტის URL ბმული</label>
                <div className="relative">
                  <input 
                    type="url" 
                    name="mainPortraitUrl" 
                    value={formData.mainPortraitUrl} 
                    onChange={handleChange} 
                    placeholder="https://example.com/photo.jpg" 
                    className="form-input pl-10" 
                  />
                  <ImageIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
                <p className="text-[11px] text-gray-600 font-light pl-1">ჩასვით პირდაპირი ბმული ინტერნეტიდან (მაგალითად, Unsplash ან ნებისმიერი ჰოსტინგი).</p>
              </div>
            </div>
          )}

     
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="mb-6">
                <h2 className="font-serif text-2xl lg:text-3xl text-[#FFF5D6] font-light flex items-center gap-2">
                  <Sparkles size={20} className="text-[#D4AF37]" /> ცხოვრების ისტორია
                </h2>
                <p className="text-xs text-gray-500 mt-1">აღწერეთ მისი პიროვნება, მიღწევები და მემკვიდრეობა.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 font-light tracking-wide">მოკლე ეპიტაფია / ციტატა</label>
                <input type="text" name="epitaph" value={formData.epitaph} onChange={handleChange} placeholder="მაგ: ადამიანი, რომელმაც სამყარო უფრო ნათელი გახადა..." className="form-input" />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 font-light tracking-wide">ბიოგრაფია / მოგონებები</label>
                <textarea name="biography" value={formData.biography} onChange={handleChange} rows={6} placeholder="გააზიარეთ მისი ცხოვრების გზა..." className="form-input resize-none py-3" />
              </div>
            </div>
          )}

       
{step === 3 && (
  <div className="space-y-6 animate-fade-in">
    <div className="mb-6">
      <h2 className="font-serif text-2xl lg:text-3xl text-[#FFF5D6] font-light flex items-center gap-2">
        <MapPin size={22} className="text-[#D4AF37]" /> სამძიმრისა და დაკრძალვის დეტალები
      </h2>
      <p className="text-xs text-gray-500 mt-1">მიუთითეთ ინფორმაცია, რათა ახლობლებმა შეძლონ მოსვლა და გვერდში დგომა.</p>
    </div>


    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-400 font-light tracking-wide">სამძიმრის / პანიხიდის ადგილი</label>
        <input 
          type="text"
          name="funeralLocation" 
          placeholder="მაგ: საბურთალო, ამაღლების ქ. #12"
          value={formData.funeralLocation} 
          onChange={handleChange} 
          className="form-input bg-[#0D0D0F] border border-white/10 rounded-lg p-3 text-sm text-gray-200 focus:border-[#D4AF37] outline-none"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs text-gray-400 font-light tracking-wide">გამოსვენების დრო</label>
        <input 
          type="datetime-local"
          name="funeralTime" 
          value={formData.funeralTime} 
          onChange={handleChange} 
          className="form-input bg-[#0D0D0F] border border-white/10 rounded-lg p-3 text-sm text-gray-200 focus:border-[#D4AF37] outline-none"
        />
      </div>
    </div>

    <div className="flex flex-col gap-2">
      <label className="text-xs text-gray-400 font-light tracking-wide">საფლავის / ქელეხის ლოკაცია (სურვილისამებრ)</label>
      <input 
        type="text"
        name="cemeteryLocation" 
        placeholder="მაგ: კუკიის სასაფლაო / რესტორანი შარაგული"
        value={formData.cemeteryLocation} 
        onChange={handleChange} 
        className="form-input bg-[#0D0D0F] border border-white/10 rounded-lg p-3 text-sm text-gray-200 focus:border-[#D4AF37] outline-none"
      />
    </div>

    
    <div className="flex items-center justify-between p-4 rounded-xl bg-[#161619]/30 border border-white/5 mt-4">
      <div>
        <h4 className="text-sm font-medium text-gray-300">ციფრული სანთლის გააქტიურება</h4>
        <p className="text-xs text-gray-500">მნახველებს შეეძლებათ გვერდზე ვირტუალური სანთლის დანთება.</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer select-none">
        <input 
          type="checkbox" 
          name="enableCandle" 
          checked={formData.enableCandle} 
          onChange={handleChange} 
          className="sr-only peer" 
        />
        <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-gray-400 peer-checked:after:bg-black after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-[#AA7C11] peer-checked:to-[#D4AF37]" />
      </label>
    </div>

  
    <div className="p-5 rounded-xl bg-[#161619]/40 border border-[#D4AF37]/20 mt-4 backdrop-blur-xs flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="space-y-1 text-center sm:text-left">
        <h4 className="text-sm font-medium text-gray-200 flex items-center justify-center sm:justify-start gap-2">
          <Mail size={16} className="text-[#D4AF37]" /> ციფრული მოსაწვევი ბარათი
        </h4>
        <p className="text-xs text-gray-500 max-w-sm">
          ავტომატურად გენერირდება ტრადიციული, ღირსეული ელექტრონული ბარათი, რომლის გაზიარებასაც შეძლებთ სოციალურ ქსელებში.
        </p>
      </div>
      
      <button
        type="button"
        onClick={() => alert("მოსაწვევი ბარათის გენერაცია...")}
        className="cursor-pointer whitespace-nowrap bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] hover:from-[#BD8E1A] hover:to-[#E5C158] text-black text-xs font-medium px-4 py-3 rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
      >
        ბარათის ნახვა / გაზიარება
      </button>
    </div>
  </div>
)}

        
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="mb-6">
                <h2 className="font-serif text-2xl lg:text-3xl text-[#FFF5D6] font-light flex items-center gap-2">
                  <Shield size={20} className="text-[#D4AF37]" /> კონფიდენციალურობა და ბმული
                </h2>
                <p className="text-xs text-gray-500 mt-1">დაარეგულირეთ გვერდის წვდომისა და უსაფრთხოების პარამეტრები.</p>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 font-light tracking-wide">გვერდის უნიკალური ბმული (URL Slug)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 text-xs text-gray-600 font-sans">evertribute.ge/</span>
                  <input type="text" name="urlSlug" value={formData.urlSlug} onChange={handleChange} placeholder="elene-beridze" className="form-input pl-22.5" />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <label className="text-xs text-gray-400 font-light tracking-wide">წვდომის ტიპი</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`p-4 rounded-xl border flex flex-col gap-1 cursor-pointer transition ${formData.privacyType === 'public' ? 'bg-[#1A150F]/20 border-[#D4AF37]/30' : 'bg-[#161619]/20 border-white/5'}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="privacyType" value="public" checked={formData.privacyType === 'public' ? true : false} onChange={handleChange} className="accent-[#D4AF37]" />
                      <span className="text-sm font-medium text-gray-300">საჯარო (Public)</span>
                    </div>
                    <span className="text-xs text-gray-500 pl-5">მემორიალი ხელმისაწვდომია ყველასთვის და გამოჩნდება ძებნაში.</span>
                  </label>

                  <label className={`p-4 rounded-xl border flex flex-col gap-1 cursor-pointer transition ${formData.privacyType === 'private' ? 'bg-[#1A150F]/20 border-[#D4AF37]/30' : 'bg-[#161619]/20 border-white/5'}`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="privacyType" value="private" checked={formData.privacyType === 'private' ? true : false} onChange={handleChange} className="accent-[#D4AF37]" />
                      <span className="text-sm font-medium text-gray-300">პირადი (Private)</span>
                    </div>
                    <span className="text-xs text-gray-500 pl-5">გვერდის ნახვა შესაძლებელი იქნება მხოლოდ პირდაპირი ბმულით.</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-[#161619]/30 border border-white/5 mt-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-300">სამძიმრის კედლის მოდერაცია</h4>
                  <p className="text-xs text-gray-500">მნახველების მიერ დატოვებული პოსტები გამოჩნდება მხოლოდ თქვენი დასტურის შემდეგ.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="requireModeration" checked={formData.requireModeration} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-gray-400 peer-checked:after:bg-black after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linear-to-r peer-checked:from-[#AA7C11] peer-checked:to-[#D4AF37]" />
                </label>
              </div>
            </div>
          )}

          
          <div className="mt-10 pt-6 border-t border-white/5 flex justify-between">
            <button
              onClick={prevStep}
              disabled={step === 1 || isSubmitting}
              className={`px-5 py-2 rounded-xl border border-white/5 text-xs uppercase tracking-wider font-medium flex items-center gap-2 transition active:scale-[0.98] ${
                step === 1 || isSubmitting ? 'opacity-0 pointer-events-none' : 'hover:bg-white/5 text-gray-400 cursor-pointer'
              }`}
            >
              <ChevronLeft size={14} /> უკან
            </button>

            {step < 4 ? (
              <button
                onClick={nextStep}
                className="px-6 py-2 rounded-xl bg-linear-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 transition active:scale-[0.98] hover:brightness-110 cursor-pointer shadow-lg shadow-[#D4AF37]/5"
              >
                გაგრძელება <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl bg-linear-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition active:scale-[0.98] hover:brightness-110 cursor-pointer shadow-lg shadow-[#D4AF37]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'ქვეყნდება...' : 'მემორიალის გამოქვეყნება'}
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
        .form-input::placeholder {
          color: #4b5563;
          font-weight: 300;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease forwards;
        }
      `}</style>
    </div>
  );
};

export default CreateMemorial;