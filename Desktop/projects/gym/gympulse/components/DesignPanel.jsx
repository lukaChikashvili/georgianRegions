"use client";

import React, { useRef } from "react";

const DesignPanel = ({ activeCategory, setActiveCategory, designSettings, updateSetting, onClose, onPortraitUpload, uploadProgress, cityInput, onCityChange, allCities }) => {
  const fileInputRef = useRef(null);


  const categories = [
    { id: "stone", label: "ქვის სტილი", icon: "💎" },
    { id: "fence", label: "ღობე & ბაქანი", icon: "🚧" },
    { id: "floor", label: "იატაკი", icon: "🧱" },
    { id: "flowers", label: "ყვავილები", icon: "💐" },
    { id: "wine", label: "ღვინის დასხმა", icon: "🍷" },
    { id: "text", label: "წარწერა ქვაზე", icon: "📝" },
    { id: "city", label: "ქალაქი", icon: "🏙️" },
  ];

  return (
    <div className="w-full md:w-[600px] lg:w-[800px] mx-auto rounded-t-2xl md:rounded-lg absolute bottom-0 left-0 right-0 bg-[#0d0f14]/95 backdrop-blur-md border-t border-white/10 flex flex-col h-[300px] z-10 text-white shadow-2xl">

      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <span className="text-[10px] uppercase text-gray-500 tracking-widest">დიზაინის პანელი</span>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="flex justify-start md:justify-center items-center gap-2 md:gap-6 px-4 py-3 border-b border-white/5 overflow-x-auto scrollbar-none snap-x">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex flex-col items-center justify-center min-w-[80px] p-2 rounded-xl transition-all duration-200 snap-center ${
              activeCategory === cat.id
                ? "bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700]"
                : "border border-transparent text-gray-400 hover:text-white"
            }`}
          >
            <span className="text-xl mb-1">{cat.icon}</span>
            <span className="text-[11px] font-light tracking-wide whitespace-nowrap">{cat.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 p-5 overflow-y-auto max-w-4xl mx-auto w-full">

        {activeCategory === "stone" && (
          <div className="space-y-3 animate-fadeIn">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-light">აირჩიეთ მონუმენტის მასალა</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => updateSetting("stoneType", "black_granite")}
                className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center gap-3 ${
                  designSettings.stoneType === "black_granite" ? "border-[#ffd700] bg-[#ffd700]/5" : "border-white/5 bg-white/[0.01]"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-stone-900 border border-white/20" />
                <span className="font-light">შავი გრანიტი</span>
              </button>
              <button
                onClick={() => updateSetting("stoneType", "gray_marble")}
                className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center gap-3 ${
                  designSettings.stoneType === "gray_marble" ? "border-[#ffd700] bg-[#ffd700]/5" : "border-white/5 bg-white/[0.01]"
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-gray-400 border border-white/20" />
                <span className="font-light">ნაცრისფერი მარმარილო</span>
              </button>
            </div>
          </div>
        )}

        {activeCategory === "fence" && (
          <div className="space-y-3 animate-fadeIn">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-light">პერიმეტრის მოწყობა</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
              {[
                { id: "none", name: "ღობის გარეშე", desc: "მწვანე ველი" },
                { id: "iron", name: "ჭედური რკინა", desc: "ტრადიციული" },
                { id: "wood", name: "ხის ღობე", desc: "ძველებური" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => updateSetting("fenceStyle", f.id)}
                  className={`p-3 rounded-xl border text-xs text-left transition-all ${
                    designSettings.fenceStyle === f.id ? "border-[#ffd700] bg-[#ffd700]/5 text-[#ffd700]" : "border-white/5 bg-white/[0.01]"
                  }`}
                >
                  <span className="block font-medium text-white">{f.name}</span>
                  <span className="text-[10px] text-gray-500 block mt-0.5">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeCategory === "floor" && (
          <div className="space-y-3 animate-fadeIn">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-light">აირჩიეთ საფარის ტიპი</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
              {[
                { id: "grass", name: "ბალახი", icon: "🌱", desc: "ბუნებრივი" },
                { id: "brick", name: "აგური", icon: "🧱", desc: "წითელი აგური" },
                { id: "stone", name: "ქვის ფილა", icon: "⬛", desc: "მუქი ნაცრისფერი" },
                { id: "marble_tile", name: "მარმარილო", icon: "⚪", desc: "თეთრი პრიალა" },
              ].map((fl) => (
                <button
                  key={fl.id}
                  onClick={() => updateSetting("floorStyle", fl.id)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    designSettings.floorStyle === fl.id ? "border-[#ffd700] bg-[#ffd700]/5 text-[#ffd700]" : "border-white/5 bg-white/[0.01]"
                  }`}
                >
                  <span className="text-lg block mb-1">{fl.icon}</span>
                  <span className="block font-medium text-white text-[11px]">{fl.name}</span>
                  <span className="text-[9px] text-gray-500 block">{fl.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeCategory === "flowers" && (
          <div className="space-y-3 animate-fadeIn">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-light">ყვავილების დასვენება</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: "none", name: "ცარიელი", icon: "⚪" },
                { id: "roses", name: "ვარდები", icon: "🌹" },
                { id: "tulips", name: "ტიტები", icon: "🪻" },
              ].map((fl) => (
                <button
                  key={fl.id}
                  onClick={() => updateSetting("flowers", fl.id)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    designSettings.flowers === fl.id ? "border-[#ffd700] bg-[#ffd700]/5 text-[#ffd700]" : "border-white/5 bg-white/[0.01]"
                  }`}
                >
                  <span className="text-base block mb-1">{fl.icon}</span>
                  <span className="text-[11px] font-light block">{fl.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeCategory === "wine" && (
          <div className="space-y-3 animate-fadeIn max-w-md mx-auto">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-light">ტრადიციული რიტუალი</p>
            <button
              onClick={() => updateSetting("winePoured", !designSettings.winePoured)}
              className={`w-full p-3.5 rounded-xl border text-xs text-left flex items-center justify-between transition-all ${
                designSettings.winePoured ? "border-red-500 bg-red-500/5 text-red-400" : "border-white/5 bg-white/[0.01] text-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🍷</span>
                <div>
                  <p className="font-medium">დაღვარე ღვინო საფლავზე</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">ქვის ფილაზე გაჩნდება წითელი სველი კვალი</p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${designSettings.winePoured ? "border-red-500 bg-red-500 text-white" : "border-gray-600"}`}>
                {designSettings.winePoured && "✓"}
              </div>
            </button>
          </div>
        )}

        {activeCategory === "text" && (
          <div className="space-y-3 animate-fadeIn">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-light">მონუმენტის წარწერა</p>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">

          
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-gray-400 uppercase font-light">პორტრეტი</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && onPortraitUpload) onPortraitUpload(file);
                   
                    e.target.value = "";
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={!!uploadProgress}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border px-3 py-3 text-xs transition-all w-full ${
                    uploadProgress
                      ? "border-white/10 bg-white/[0.01] text-gray-500 cursor-wait"
                      : designSettings.portraitImg
                      ? "border-[#ffd700]/40 bg-[#ffd700]/5 text-[#ffd700] hover:bg-[#ffd700]/10"
                      : "border-white/5 bg-white/[0.01] text-gray-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {uploadProgress ? (
                    <>
                      <span className="text-lg animate-pulse">⏳</span>
                      <span className="text-[10px]">{uploadProgress}</span>
                    </>
                  ) : designSettings.portraitImg ? (
                    <>
                      <span className="text-lg">✅</span>
                      <span className="text-[10px]">ატვირთულია</span>
                      <span
                        className="text-[9px] text-gray-500 underline mt-0.5"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateSetting("portraitImg", null);
                        }}
                      >
                        წაშლა
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-lg">📷</span>
                      <span>ფოტოს ატვირთვა</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-gray-400 uppercase font-light">სახელი გვარი</label>
                <input
                  type="text"
                  value={designSettings.fullName || ""}
                  onChange={(e) => updateSetting("fullName", e.target.value)}
                  className="bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#ffd700] text-white placeholder-gray-700"
                  placeholder="სახელი გვარი"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-gray-400 uppercase font-light">დაბადების წელი</label>
                <input
                  type="text"
                  value={designSettings.birthYear || ""}
                  onChange={(e) => updateSetting("birthYear", e.target.value)}
                  className="bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#ffd700] text-white placeholder-gray-700"
                  placeholder="1950"
                />
              </div>

              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-gray-400 uppercase font-light">გარდაცვალების წელი</label>
                <input
                  type="text"
                  value={designSettings.deathYear || ""}
                  onChange={(e) => updateSetting("deathYear", e.target.value)}
                  className="bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#ffd700] text-white placeholder-gray-700"
                  placeholder="2024"
                />
              </div>
            </div>
          </div>
        )}

{activeCategory === "city" && (
  <div className="space-y-3 animate-fadeIn max-w-md mx-auto">
    <p className="text-[11px] text-gray-400 uppercase tracking-wider font-light">
      აირჩიეთ ქალაქი
    </p>
    <input
      type="text"
      value={designSettings.city || ""}
      onChange={(e) => updateSetting("city", e.target.value)}
      placeholder="მაგ: თბილისი, ქუთაისი, ბათუმი..."
      className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#ffd700] text-white placeholder-gray-700"
    />

   
    {allCities?.length > 0 && (
      <div className="space-y-1">
        <p className="text-[10px] text-gray-600 uppercase tracking-wider">არსებული სასაფლაოები</p>
        <div className="flex flex-wrap gap-2">
          {allCities.map((c) => (
            <button
              key={c._id}
              onClick={() => updateSetting("city", c.name)}
              className={`text-[11px] px-3 py-1.5 rounded-lg border transition-all ${
                designSettings.city === c.name
                  ? "border-[#ffd700]/50 bg-[#ffd700]/10 text-[#ffd700]"
                  : "border-white/5 bg-white/[0.01] text-gray-400 hover:text-white hover:border-white/20"
              }`}
            >
              {c.name}
              <span className="ml-1.5 text-[9px] text-gray-600">
                {c.plotCount}/{c.maxPlots}
              </span>
            </button>
          ))}
        </div>
      </div>
    )}

  
    {designSettings.city && allCities?.find(c => c.name === designSettings.city)?.plotCount >= 
     allCities?.find(c => c.name === designSettings.city)?.maxPlots && (
      <p className="text-[11px] text-red-400 border border-red-500/20 bg-red-500/5 rounded-lg px-3 py-2">
        ⚠️ ეს სასაფლაო სავსეა — სხვა ქალაქი აირჩიეთ
      </p>
    )}
  </div>
)}
      </div>
    </div>
  );
};

export default DesignPanel;