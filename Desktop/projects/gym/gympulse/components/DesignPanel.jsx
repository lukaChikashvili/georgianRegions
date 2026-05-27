"use client";

import React, { useState } from "react";

const DesignPanel = ({ activeCategory, setActiveCategory, designSettings, updateSetting }) => {
  const categories = [
    { id: "stone", label: "ქვის სტილი", icon: "💎" },
    { id: "fence", label: "ღობე & ბაქანი", icon: "🚧" },
    { id: "flowers", label: "ყვავილები", icon: "💐" },
    { id: "wine", label: "ღვინის დასხმა", icon: "🍷" },
    { id: "text", label: "წარწერა ქვაზე", icon: "📝" },
  ];

  return (
    <div className="w-1/2 mx-auto rounded-lg absolute bottom-0 left-0 right-0 bg-[#0d0f14]/95 backdrop-blur-md border-t border-white/5 flex flex-col h-[320px] md:h-[280px] z-10 text-white">
     
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
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
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
            <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto">
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

     
        {activeCategory === "flowers" && (
          <div className="space-y-3 animate-fadeIn">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-light">ყვავილების დასვენება</p>
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
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
              <div className="flex items-center gap-3 ">
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
                <label className="text-[10px] text-gray-400 uppercase font-light">პორტრეტის URL</label>
                <input
                  type="text"
                  value={designSettings.portraitImg || ""}
                  onChange={(e) => updateSetting("portraitImg", e.target.value)}
                  className="bg-white/[0.02] border border-white/5 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#ffd700] text-white placeholder-gray-700"
                  placeholder="https://image.link"
                />
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
      </div>
    </div>
  );
};

export default DesignPanel;