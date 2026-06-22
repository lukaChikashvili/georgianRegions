"use client";

import React, { useState, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from "@/convex/_generated/api";
import { Search, MapPin, Calendar, ArrowRight, Sparkles, Flame, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import Link from 'next/link';

function MemorialPortrait({ storageId, firstName }) {
  const url = useQuery(api.services.getStorageUrl, storageId ? { storageId } : "skip");
  return url ? (
    <img
      src={url}
      alt={firstName}
      className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-gray-600 bg-white/5">
      <Sparkles size={16} />
    </div>
  );
}

const AGE_RANGES = [
  { label: "ყველა", min: 0, max: Infinity },
  { label: "0–30", min: 0, max: 30 },
  { label: "31–60", min: 31, max: 60 },
  { label: "61–90", min: 61, max: 90 },
  { label: "90+", min: 90, max: Infinity },
];

const DECADE_OPTIONS = ["ყველა", "1920–1940", "1940–1960", "1960–1980", "1980–2000", "2000+"];

function getDecadeRange(label) {
  if (label === "ყველა") return null;
  if (label === "2000+") return [2000, Infinity];
  const [start, end] = label.split("–").map(Number);
  return [start, end];
}

const Discover = () => {
  const memorials = useQuery(api.memorials.getAllPublicMemorials);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [locationFilter, setLocationFilter] = useState('');
  const [ageRange, setAgeRange] = useState(AGE_RANGES[0]);
  const [decadeFilter, setDecadeFilter] = useState("ყველა");
  const [sortBy, setSortBy] = useState("newest");

 
  const locations = useMemo(() => {
    if (!memorials) return [];
    const locs = memorials
      .map(m => m.location)
      .filter(Boolean)
      .map(l => l.trim());
    return ["ყველა", ...Array.from(new Set(locs))];
  }, [memorials]);

  const activeFilterCount = [
    locationFilter && locationFilter !== "ყველა",
    ageRange.label !== "ყველა",
    decadeFilter !== "ყველა",
    sortBy !== "newest",
  ].filter(Boolean).length;

  const filteredMemorials = useMemo(() => {
    if (!memorials) return [];

    let result = [...memorials];

  
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(q)
      );
    }

  
    if (locationFilter && locationFilter !== "ყველა") {
      result = result.filter(m =>
        m.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    
    if (ageRange.label !== "ყველა") {
      result = result.filter(m => {
        if (!m.birthDate || !m.deathDate) return false;
        const birth = parseInt(m.birthDate.split('-')[0]);
        const death = parseInt(m.deathDate.split('-')[0]);
        const age = death - birth;
        return age >= ageRange.min && age <= ageRange.max;
      });
    }

   
    const decadeRange = getDecadeRange(decadeFilter);
    if (decadeRange) {
      result = result.filter(m => {
        if (!m.birthDate) return false;
        const birth = parseInt(m.birthDate.split('-')[0]);
        return birth >= decadeRange[0] && birth < decadeRange[1];
      });
    }

   
    if (sortBy === "newest") {
      result = result.reverse();
    } else if (sortBy === "oldest") {
    
    } else if (sortBy === "candles") {
      result = result.sort((a, b) => (b.candleCount || 0) - (a.candleCount || 0));
    } else if (sortBy === "name") {
      result = result.sort((a, b) => a.firstName.localeCompare(b.firstName));
    }

    return result;
  }, [memorials, searchQuery, locationFilter, ageRange, decadeFilter, sortBy]);

  const clearFilters = () => {
    setLocationFilter('');
    setAgeRange(AGE_RANGES[0]);
    setDecadeFilter("ყველა");
    setSortBy("newest");
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-gray-300 font-sans py-20 px-6 relative overflow-hidden selection:bg-[#c1a362] selection:text-black">

      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none blur-3xl opacity-40"
        style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto relative z-10 mt-4">

        
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-6 h-px bg-gradient-to-r from-transparent to-[#c1a362] opacity-60" />
            <span className="text-xs tracking-widest uppercase text-[#c1a362]/90 font-medium">
              გარდაცვლილთა ისტორიები
            </span>
            <div className="w-6 h-px bg-gradient-to-l from-transparent to-[#c1a362] opacity-60" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-[#FFF5D6] tracking-wide">
            მარადიული ხსოვნის არქივი
          </h1>
          <p className="text-sm text-gray-400 font-light leading-relaxed">
            აღმოაჩინეთ წარსული ცხოვრების კვალი, წაიკითხეთ და გააზიარეთ იმ ადამიანების ისტორიები, რომლებმაც წარუშლელი კვალი დატოვეს ჩვენს გულებში.
          </p>
        </div>

       
        <div className="max-w-2xl mx-auto mb-4 flex gap-3 items-center">
          <div className="relative group flex-1">
            <input
              type="text"
              placeholder="მოძებნეთ სახელით ან გვარით..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121214]/40 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm text-gray-200 outline-none transition-all focus:border-[#D4AF37]/40 focus:bg-[#121214]/60 placeholder:text-gray-600 font-light"
            />
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#D4AF37] transition-colors" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                <X size={14} />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 shrink-0 ${
              showFilters || activeFilterCount > 0
                ? 'bg-[#D4AF37]/10 border-[#c1a362]/40 text-[#c1a362]'
                : 'bg-[#121214]/40 border-white/5 text-gray-400 hover:text-white hover:border-white/10'
            }`}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">ფილტრი</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#c1a362] text-black text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

     
        {showFilters && (
          <div className="max-w-2xl mx-auto mb-8 bg-[#121214]/60 border border-white/5 rounded-2xl p-5 backdrop-blur-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

             
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#c1a362]/70 mb-2 block">
                  მდებარეობა
                </label>
                <div className="relative">
                  <select
                    value={locationFilter || "ყველა"}
                    onChange={(e) => setLocationFilter(e.target.value === "ყველა" ? '' : e.target.value)}
                    className="w-full appearance-none bg-[#0D0D0F]/80 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-[#D4AF37]/30 transition-all cursor-pointer"
                  >
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>

 
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#c1a362]/70 mb-2 block">
                  დალაგება
                </label>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-[#0D0D0F]/80 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-gray-300 outline-none focus:border-[#c1a362]/30 transition-all cursor-pointer"
                  >
                    <option value="newest">უახლესი</option>
                    <option value="oldest">ყველაზე ძველი</option>
                    <option value="candles">სანთლების რაოდენობა</option>
                    <option value="name">სახელი (ა-ბ)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>

          
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#c1a362]/70 mb-2 block">
                  ასაკი გარდაცვალებისას
                </label>
                <div className="flex gap-2 flex-wrap">
                  {AGE_RANGES.map(range => (
                    <button
                      key={range.label}
                      onClick={() => setAgeRange(range)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                        ageRange.label === range.label
                          ? 'bg-[#D4AF37]/15 border-[#c1a362]/50 text-[#c1a362]'
                          : 'bg-white/[0.03] border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              
              <div>
                <label className="text-[10px] tracking-widest uppercase text-[#c1a362]/70 mb-2 block">
                  დაბადების ათწლეული
                </label>
                <div className="flex gap-2 flex-wrap">
                  {DECADE_OPTIONS.map(d => (
                    <button
                      key={d}
                      onClick={() => setDecadeFilter(d)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                        decadeFilter === d
                          ? 'bg-[#c1a362]/15 border-[#c1a362]/50 text-[#c1a362]'
                          : 'bg-white/[0.03] border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

           
            {activeFilterCount > 0 && (
              <div className="mt-4 pt-4 border-t border-white/5 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#c1a362] transition-colors"
                >
                  <X size={13} /> ფილტრების გასუფთავება
                </button>
              </div>
            )}
          </div>
        )}

      
        {memorials !== undefined && (
          <div className="max-w-2xl mx-auto mb-8 text-center">
            <span className="text-xs text-gray-500">
              {filteredMemorials.length === 0
                ? 'მემორიალი ვერ მოიძებნა'
                : `${filteredMemorials.length} მემორიალი`}
            </span>
          </div>
        )}

  
        {memorials === undefined ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-[#121214]/20 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredMemorials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMemorials.map((memorial) => (
              <Link
                href={`/discover/${memorial.urlSlug}`}
                key={memorial._id}
                className="group relative flex flex-col justify-between h-[420px] rounded-2xl bg-gradient-to-b from-[#161619]/40 to-[#0F0F12]/80 border border-white/[0.04] p-6 shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-500 hover:border-[#D4AF37]/20 hover:-translate-y-1"
              >
                <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-transparent rounded-tr-2xl pointer-events-none group-hover:border-[#D4AF37]/10 transition-colors duration-500" />

                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full p-[1px] bg-gradient-to-b from-white/10 to-transparent group-hover:from-[#D4AF37]/40 transition-all duration-500">
                      <div className="w-full h-full rounded-full overflow-hidden bg-[#0D0D0F]">
                        <MemorialPortrait storageId={memorial.mainPortraitUrl} firstName={memorial.firstName} />
                      </div>
                    </div>
                    <div>
                      <h2 className="font-serif text-xl text-[#FFF5D6] tracking-wide group-hover:text-[#c1a362] transition-colors duration-300">
                        {memorial.firstName} {memorial.lastName}
                      </h2>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 font-light mt-0.5">
                        <Calendar size={12} className="text-[#c1a362]/60" />
                        <span>{memorial.birthDate?.split('-')[0]} – {memorial.deathDate?.split('-')[0]}</span>
                      </div>
                    </div>
                  </div>

                  {memorial.epitaph && (
                    <p className="text-xs text-gray-400 italic font-serif line-clamp-2 border-l border-[#D4AF37]/20 pl-3 mb-4 leading-relaxed">
                      "{memorial.epitaph}"
                    </p>
                  )}

                  <p className="text-xs text-gray-500 font-light line-clamp-4 leading-relaxed">
                    {memorial.biography}
                  </p>

                  <div className="flex mt-6 items-center gap-1.5 text-xs text-gray-500">
                    <Flame size={13} className="text-[#c1a362]/60" />
                    <span>{memorial.candleCount || 0}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.03] flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-gray-500 font-light">
                    <MapPin size={12} className="text-gray-600" />
                    <span>{memorial.location}</span>
                  </div>
                  <span className="text-[10px] tracking-widest uppercase text-[#c1a362]/70 font-medium flex items-center gap-1 group-hover:text-[#FFF5D6] transition-colors">
                    ისტორია <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#121214]/10 rounded-2xl border border-white/5 max-w-xl mx-auto">
            <p className="text-gray-500 text-sm font-light">მითითებული პარამეტრებით მემორიალი ვერ მოიძებნა.</p>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="mt-4 text-xs text-[#c1a362]/70 hover:text-[#c1a362] transition-colors underline underline-offset-4">
                ფილტრების გასუფთავება
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Discover;