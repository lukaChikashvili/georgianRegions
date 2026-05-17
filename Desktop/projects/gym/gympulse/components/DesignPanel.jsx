"use client";

import React, { useState } from "react";

const DesignPanel = ({ designSettings, updateSetting, handlePublish, router }) => {

  const [activeCategory, setActiveCategory] = useState("stone");


  const categories = [
    { id: "stone", label: "ქვის სტილი", icon: "ინ" },
    { id: "fence", label: "ღობე & ბაქანი", icon: "🚧" },
    { id: "flowers", label: "ყვავილები", icon: "💐" },
    { id: "wine", label: "ღვინის დასხმა", icon: "🍷" },
    { id: "voice", label: "ხმოვანი ტოსტი", icon: "🎙️" },
    { id: "text", label: "წარწერა ქვაზე", icon: "📝" },
  ];

  return (
    <div className="w-full bg-[#0d0f14] border-t border-white/5 flex flex-col h-[360px] lg:h-[280px] text-white">
      
    
      <div className="flex justify-center gap-2 lg:gap-6 py-3 px-4 bg-[#111319] border-b border-white/5 overflow-x-auto scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`flex flex-col items-center justify-center p-2 min-w-[75px] lg:min-w-[90px] rounded-xl transition-all duration-300 group ${
              activeCategory === cat.id
                ? "bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] scale-105"
                : "border border-transparent text-gray-400 hover:text-white hover:bg-white/[0.02]"
            }`}
          >
           
            <span className="text-2xl mb-1 transition-transform group-hover:scale-110 duration-200">
              {cat.icon}
            </span>
            
            <span className="text-[10px] lg:text-xs font-light tracking-wide text-center">
              {cat.label}
            </span>
          </button>
        ))}
      </div>

    
      <div className="flex-1 p-6 overflow-y-auto bg-[#0d0f14]/50">
        
        
        {activeCategory === "stone" && (
          <div className="space-y-3 animate-fadeIn">
            <p className="text-xs text-gray-400 uppercase tracking-wider">აირჩიეთ მონუმენტის ფორმა და მასალა</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => updateSetting("stoneType", "black_granite")}
                className={`p-3 rounded-xl border text-sm text-left transition-all ${designSettings.stoneType === "black_granite" ? "border-[#ffd700] bg-[#ffd700]/5" : "border-white/5 bg-white/[0.01]"}`}
              >
                <div className="w-4 h-4 rounded-full bg-stone-900 border border-white/20 mb-1" />
                <span className="block font-medium">შავი გრანიტი</span>
              </button>
              <button
                onClick={() => updateSetting("stoneType", "gray_marble")}
                className={`p-3 rounded-xl border text-sm text-left transition-all ${designSettings.stoneType === "gray_marble" ? "border-[#ffd700] bg-[#ffd700]/5" : "border-white/5 bg-white/[0.01]"}`}
              >
                <div className="w-4 h-4 rounded-full bg-gray-400 border border-white/20 mb-1" />
                <span className="block font-medium">ნაცრისფერი მარმარილო</span>
              </button>
            </div>
          </div>
        )}


        {activeCategory === "fence" && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider">საფლავის გარშემო პერიმეტრის მოწყობა</p>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { id: "none", name: "ღობის გარეშე", desc: "მხოლოდ მწვანე ველი" },
                { id: "iron", name: "ჭედური რკინა", desc: "ტრადიციული ქართული ღობე" },
                { id: "stone", name: "ქვის ბორდიური", desc: "დაბალი თანამედროვე ჩარჩო" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => updateSetting("fenceStyle", f.id)}
                  className={`p-3 rounded-xl border text-sm text-left transition-all ${designSettings.fenceStyle === f.id ? "border-[#ffd700] bg-[#ffd700]/5 text-[#ffd700]" : "border-white/5 bg-white/[0.01]"}`}
                >
                  <span className="block font-medium text-white">{f.name}</span>
                  <span className="text-[11px] text-gray-500 block mt-0.5">{f.desc}</span>
                </button>
              ))}
            </div>
          </div>
        )}

     
        {activeCategory === "flowers" && (
          <div className="space-y-3">
            <p className="text-xs text-gray-400 uppercase tracking-wider">მიიტანეთ და დაასვენეთ ყვავილები ქვაზე</p>
            <div className="grid grid-cols-3 gap-3 max-w-lg">
              {[
                { id: "none", name: "ცარიელი", icon: "⚪" },
                { id: "roses", name: "წითელი ვარდები", icon: "🌹" },
                { id: "carnations", name: "მიხაკები", icon: "🪻" },
              ].map((fl) => (
                <button
                  key={fl.id}
                  onClick={() => updateSetting("flowers", fl.id)}
                  className={`p-3 rounded-xl border text-sm text-center transition-all ${designSettings.flowers === fl.id ? "border-[#ffd700] bg-[#ffd700]/5 text-[#ffd700]" : "border-white/5 bg-white/[0.01]"}`}
                >
                  <span className="text-lg block mb-1">{fl.icon}</span>
                  <span className="text-xs block font-light">{fl.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

   
        {activeCategory === "wine" && (
          <div className="space-y-3 max-w-md">
            <p className="text-xs text-gray-400 uppercase tracking-wider">ტრადიციული შესანდობარი</p>
            <button
              onClick={() => updateSetting("winePoured", !designSettings.winePoured)}
              className={`w-full p-4 rounded-xl border text-sm text-left flex items-center justify-between transition-all ${
                designSettings.winePoured ? "border-red-500 bg-red-500/5 text-red-400" : "border-white/5 bg-white/[0.01] text-gray-300 hover:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🍷</span>
                <div>
                  <p className="font-medium">დაღვარე ღვინო საფლავზე</p>
                  <p className="text-xs text-gray-500 mt-0.5">ქვის ფილაზე გაჩნდება წითელი ღვინის სველი კვალი</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${designSettings.winePoured ? "border-red-500 bg-red-500 text-white" : "border-gray-600"}`}>
                {designSettings.winePoured && "✓"}
              </div>
            </button>
          </div>
        )}

        
        {activeCategory === "voice" && (
          <div className="space-y-3 max-w-xl">
            <p className="text-xs text-gray-400 uppercase tracking-wider">ხმოვანი მოგონების დატოვება</p>
            <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎙️</span>
                <div>
                  <p className="text-sm font-medium">ჩაწერეთ ხმოვანი შესანდობარი</p>
                  <p className="text-xs text-gray-500 mt-0.5">სტუმრები შეძლებენ მოუსმინონ თქვენს ხმას მემორიალის მონახულებისას</p>
                </div>
              </div>
              <button className="py-2.5 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 text-xs font-medium transition-all whitespace-nowrap">
                🔴 ჩაწერა
              </button>
            </div>
          </div>
        )}

      
        {activeCategory === "text" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl">
            <div className="flex flex-col space-y-1">
              <label className="text-[11px] text-gray-400 uppercase">სახელი და გვარი</label>
              <input
                type="text"
                value={designSettings.fullName}
                onChange={(e) => updateSetting("fullName", e.target.value)}
                className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffd700]"
                placeholder="გიორგი კალანდაძე"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[11px] text-gray-400 uppercase">დაბადების წელი</label>
              <input
                type="text"
                value={designSettings.birthYear}
                onChange={(e) => updateSetting("birthYear", e.target.value)}
                className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffd700]"
                placeholder="1955"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-[11px] text-gray-400 uppercase">გარდაცვალების წელი</label>
              <input
                type="text"
                value={designSettings.deathYear}
                onChange={(e) => updateSetting("deathYear", e.target.value)}
                className="bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#ffd700]"
                placeholder="2023"
              />
            </div>
          </div>
        )}

      </div>

     
      <div className="px-6 py-3 border-t border-white/5 bg-[#0a0b0f] flex items-center justify-between gap-4">
        <button
          onClick={() => router.back()}
          className="text-xs font-light text-gray-500 hover:text-white transition-colors"
        >
          ← გაუქმება და უკან დაბრუნება
        </button>
        
        <button
          onClick={handlePublish}
          className="py-2 px-5 text-xs font-medium text-[#0b0d12] bg-[#ffd700] hover:bg-[#ffe240] transition-all rounded-lg shadow-lg shadow-yellow-500/5 hover:scale-[1.01]"
        >
          დიზაინის შენახვა
        </button>
      </div>

    </div>
  );
};

export default DesignPanel;