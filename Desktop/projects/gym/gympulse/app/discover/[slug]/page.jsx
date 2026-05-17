"use client";

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { useParams } from 'next/navigation';
import { Calendar, MapPin, Flame, Heart, CheckCircle } from 'lucide-react';

const MemorialPage = () => {
  const params = useParams();
  const slug = params.slug;

  const memorial = useQuery(api.memorials.getMemorialBySlug, { urlSlug: slug });
  const lightCandleMutation = useMutation(api.memorials.lightCandle);
  
 
  const attendFuneralMutation = useMutation(api.memorials.attendFuneral);

  const [hasLitCandle, setHasLitCandle] = useState(false);
  const [isLighting, setIsLighting] = useState(false);

  
  const [hasRSVPed, setHasRSVPed] = useState(false);
  const [isRSVPing, setIsRSVPing] = useState(false);

  useEffect(() => {
    if (slug) {
      const alreadyLit = localStorage.getItem(`candle_lit_${slug}`);
      if (alreadyLit) setHasLitCandle(true);

      
      const alreadyRSVPed = localStorage.getItem(`funeral_rsvp_${slug}`);
      if (alreadyRSVPed) setHasRSVPed(true);
    }
  }, [slug]);

  const handleLightCandle = async () => {
    if (hasLitCandle || !memorial) return;
    
    setIsLighting(true);
    try {
      await lightCandleMutation({ id: memorial._id });
      setHasLitCandle(true);
      localStorage.setItem(`candle_lit_${slug}`, 'true');
    } catch (err) {
      console.error("სანთლის ანთება ვერ მოხერხდა:", err);
    } finally {
      setIsLighting(false);
    }
  };

 
  const handleAttendFuneral = async () => {
    if (hasRSVPed || !memorial) return;

    setIsRSVPing(true);
    try {
      await attendFuneralMutation({ id: memorial._id });
      setHasRSVPed(true);
      localStorage.setItem(`funeral_rsvp_${slug}`, 'true');
    } catch (err) {
      console.error("დასწრების დაფიქსირება ვერ მოხერხდა:", err);
    } finally {
      setIsRSVPing(false);
    }
  };

 
  const formatGeorgianDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleString('ka-GE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (memorial === undefined) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (memorial === null) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-gray-400 flex flex-col items-center justify-center">
        <h2 className="text-xl font-light mb-2">მემორიალური გვერდი ვერ მოიძებნა</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-gray-300 font-sans pb-24 relative overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-[#1A150F] to-transparent opacity-40 blur-3xl pointer-events-none" />

      <header className="relative z-10 pt-28 pb-16 text-center max-w-3xl mx-auto px-6 flex flex-col items-center">
        <div className="relative group mb-8">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#AA7C11] via-[#D4AF37] to-transparent opacity-30 blur-md" />
          <div className="relative w-44 h-44 md:w-52 md:h-52 rounded-full p-[1.5px] bg-gradient-to-b from-[#FFF5D6] via-[#D4AF37] to-[#1A1A1A]">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#121214]">
              {memorial.mainPortraitUrl ? (
                <img src={memorial.mainPortraitUrl} alt={memorial.firstName} className="w-full h-full object-cover grayscale contrast-110 opacity-90" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-700 bg-white/5">
                  <Heart size={32} className="opacity-40" />
                </div>
              )}
            </div>
          </div>
        </div>

        <h1 className="font-serif text-4xl md:text-6xl font-light text-transparent bg-clip-text bg-gradient-to-b from-[#FFF5D6] via-[#D4AF37] to-[#AA7C11] tracking-wide mb-3">
          {memorial.firstName} {memorial.lastName}
        </h1>
        
        <div className="flex items-center gap-2 text-sm text-gray-500 font-light tracking-widest uppercase">
          <Calendar size={14} className="text-[#D4AF37]/70" />
          <span>{memorial.birthDate.replace(/-/g, '.')}</span>
          <span className="text-[#D4AF37] mx-1">•</span>
          <span>{memorial.deathDate.replace(/-/g, '.')}</span>
        </div>

        <p className="mt-8 font-serif text-lg md:text-xl text-gray-400 italic max-w-xl border-l border-r border-[#D4AF37]/20 px-6">
          "{memorial.epitaph}"
        </p>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-[#121214]/40 border border-white/5 rounded-2xl p-8 backdrop-blur-xl">
            <h2 className="font-serif text-xl text-[#FFF5D6] mb-6 flex items-center gap-3">
              <span className="w-[1.5px] h-5 bg-gradient-to-b from-[#D4AF37] to-[#AA7C11]" />
              ცხოვრების ისტორია
            </h2>
            <p className="leading-relaxed text-gray-400 font-light text-base whitespace-pre-line">
              {memorial.biography}
            </p>
          </section>
        </div>

        <div className="space-y-8">
          {memorial.enableCandle && (
            <section className="bg-gradient-to-b from-[#161619]/60 to-[#0F0F12]/80 border border-[#D4AF37]/15 rounded-2xl p-6 text-center">
              <h3 className="font-serif text-base text-[#FFF5D6] mb-4 tracking-wide">
                ვირტუალური პანაშვიდი
              </h3>
              
              <div className="flex flex-col items-center justify-center my-6 space-y-2">
                <div className={`p-4 rounded-full border transition-all duration-500 ${
                  hasLitCandle 
                    ? 'bg-[#1A150F] border-[#D4AF37]/40 text-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.2)] animate-pulse' 
                    : 'bg-[#121214] border-white/5 text-gray-600'
                }`}>
                  <Flame size={32} />
                </div>
                
                <span className="font-sans text-2xl font-light text-gray-200">
                  {memorial.candleCount}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-light">
                  ანთებული სანთელი
                </span>
              </div>

              <button
                onClick={handleLightCandle}
                disabled={hasLitCandle || isLighting}
                className={`w-full py-3 px-4 rounded-xl font-medium text-xs uppercase tracking-wider transition-all duration-300 ${
                  hasLitCandle
                    ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                    : 'bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black font-semibold hover:brightness-110 cursor-pointer active:scale-[0.98]'
                }`}
              >
                {isLighting ? 'ინთება...' : hasLitCandle ? 'სანთელი ანთებულია' : 'აანთე სანთელი'}
              </button>
            </section>
          )}

        
          <section className="bg-[#121214]/30 border border-white/5 rounded-2xl p-6 space-y-6">
            <h3 className="font-serif text-base text-[#FFF5D6] border-b border-white/5 pb-3 tracking-wide">
              საორგანიზაციო ინფორმაცია
            </h3>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-[#161619] text-[#D4AF37]/80 shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-light">ცხოვრების ადგილი</h4>
                  <p className="text-sm text-gray-300 font-light mt-0.5">{memorial.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-[#161619] text-[#D4AF37]/80 shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-light">სამძიმრის ადგილი</h4>
                  <p className="text-sm text-gray-300 font-light mt-0.5">{memorial.funeralLocation}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-[#161619] text-[#D4AF37]/80 shrink-0">
                  <Calendar size={16} />
                </div>
                <div>
                  <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-light">გამოსვენების დრო</h4>
                  <p className="text-sm text-gray-300 font-light mt-0.5">
                    {formatGeorgianDate(memorial.funeralTime)}
                  </p>
                </div>
              </div>

              {memorial.cemeteryLocation && (
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-xl bg-[#161619] text-[#D4AF37]/80 shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-widest text-gray-500 font-light">საფლავის / ქელეხის ლოკაცია</h4>
                    <p className="text-sm text-gray-300 font-light mt-0.5">{memorial.cemeteryLocation}</p>
                  </div>
                </div>
              )}
            </div>
          </section>

         
          <section className="bg-gradient-to-br from-[#121214]/80 to-[#1A150F]/40 border border-[#D4AF37]/10 rounded-2xl p-5 flex flex-col items-center text-center space-y-4">
            <div className="space-y-1">
              <h4 className="text-md font-serif text-[#FFF5D6] tracking-wide">პანაშვიდსა და დაკრძალვაზე დასწრება</h4>
              <p className="text-[13px] text-gray-500 max-w-xs font-light">
                დაადასტურეთ თქვენი მოსვლა, რათა დაეხმაროთ ორგანიზატორებს საორგანიზაციო დეტალების დაგეგმვაში.
              </p>
            </div>

           
            <div className="bg-[#0D0D0F]/60 border border-white/5 rounded-xl px-4 py-2 flex items-center gap-3">
              <span className="text-sm font-light text-gray-400">დასწრებას ადასტურებს:</span>
              <span className="text-base font-medium text-[#D4AF37]">
                {memorial.attendeesCount || 0} ადამიანი
              </span>
            </div>

            <button 
              onClick={handleAttendFuneral}
              disabled={hasRSVPed || isRSVPing}
              className={`w-full py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 ${
                hasRSVPed 
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5' 
                  : 'cursor-pointer bg-gradient-to-r from-[#AA7C11] via-[#D4AF37] to-[#AA7C11] text-black hover:brightness-110 shadow-md'
              }`}
            >
              {isRSVPing ? (
                'ფიქსირდება...'
              ) : hasRSVPed ? (
                <>
                  <CheckCircle size={14} className="text-gray-500" /> დასწრება დადასტურებულია
                </>
              ) : (
                'დავესწრები პანაშვიდს'
              )}
            </button>
          </section>

        </div>
      </main>
    </div>
  );
};

export default MemorialPage;