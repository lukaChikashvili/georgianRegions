"use client";

import React, { useState } from 'react';
import { User, Calendar, MapPin, Music, Laylo, Shield, ChevronRight, ChevronLeft, Upload, Sparkles } from 'lucide-react';

const CreateMemorial = () => {
  const [step, setStep] = useState(1);
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
    requireModeration: false
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

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-gray-300 font-sans selection:bg-[#D4AF37] selection:text-black py-20 px-6 relative overflow-hidden">
      
     
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-125 bg-linear-to-b from-[#1A150F] to-transparent opacity-40 blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        
 
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

          
              <div className="flex flex-col gap-2 pt-2">
                <label className="text-xs text-gray-400 font-light tracking-wide">მთავარი პორტრეტი</label>
                <div className="border border-dashed border-white/10 hover:border-[#D4AF37]/30 bg-[#161619]/20 transition rounded-xl p-8 text-center cursor-pointer group">
                  <Upload size={24} className="mx-auto text-gray-500 group-hover:text-[#D4AF37] transition mb-2" />
                  <p className="text-xs text-gray-400">ატვირთეთ ფოტო (ავტომატურად გადავა შავ-თეთრ ტონალობაში)</p>
                </div>
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
                  <Music size={20} className="text-[#D4AF37]" /> მემორიალური პარამეტრები
                </h2>
                <p className="text-xs text-gray-500 mt-1">პრემიუმ ფუნქციები ატმოსფერული გარემოს შესაქმნელად.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-400 font-light tracking-wide">ფონური მელოდია</label>
                  <select name="musicTrack" value={formData.musicTrack} onChange={handleChange} className="form-input appearance-none bg-[#0D0D0F]">
                    <option value="piano">მოგონებების მელოდია (ფორტეპიანო)</option>
                    <option value="guitar">ნაზი აკორდები (აკუსტიკური გიტარა)</option>
                    <option value="nature">ბუნების სიმშვიდე (ქარი და წვიმა)</option>
                    <option value="none">მუსიკის გარეშე</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-400 font-light tracking-wide">საფლავის ქვის 3D მოდელი</label>
                  <select name="gravestoneModel" value={formData.gravestoneModel} onChange={handleChange} className="form-input appearance-none bg-[#0D0D0F]">
                    <option value="classic_marble">კლასიკური მარმარილო (მუქი)</option>
                    <option value="modern_granite">თანამედროვე გრანიტი (ოქროსფერი კანტებით)</option>
                    <option value="minimalist_stone">მინიმალისტური ობელისკი</option>
                  </select>
                </div>
              </div>

             
              <div className="flex items-center justify-between p-4 rounded-xl bg-[#161619]/30 border border-white/5 mt-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-300">ციფრული სანთლის გააქტიურება</h4>
                  <p className="text-xs text-gray-500">მნახველებს შეეძლებათ გვერდზე ვირტუალური სანთლის დანთება 24 საათით.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="enableCandle" checked={formData.enableCandle} onChange={handleChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-white/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-gray-400 peer-checked:after:bg-black after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-linear-to-r peer-checked:from-[#AA7C11] peer-checked:to-[#D4AF37]" />
                </label>
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
              disabled={step === 1}
              className={`px-5 py-2 rounded-xl border border-white/5 text-xs uppercase tracking-wider font-medium flex items-center gap-2 transition active:scale-[0.98] ${
                step === 1 ? 'opacity-0 pointer-events-none' : 'hover:bg-white/5 text-gray-400 cursor-pointer'
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
                onClick={() => console.log("დასრულდა:", formData)}
                className="px-6 py-2 rounded-xl bg-linear-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition active:scale-[0.98] hover:brightness-110 cursor-pointer shadow-lg shadow-[#D4AF37]/20"
              >
                მემორიალის გამოქვეყნება
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