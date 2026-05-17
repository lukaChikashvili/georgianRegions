"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRouter } from "next/navigation";
import Experience from "../../../components/Experience";

const DesignGrave = () => {
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState("stone");


  const [designSettings, setDesignSettings] = useState({
    stoneType: "black_granite",
    fenceStyle: "none",        
    flowers: "none",       
    winePoured: false,     
    fullName: "",              
    birthYear: "",
    deathYear: "",
  });

  const updateSetting = (key, value) => {
    setDesignSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handlePublish = async () => {
    console.log("მონაცემები ბეკენდისთვის:", designSettings);
  };


  const categories = [
    { id: "stone", label: "ქვის სტილი", icon: "💎" },
    { id: "fence", label: "ღობე", icon: "🚧" },
    { id: "flowers", label: "ყვავილები", icon: "💐" },
    { id: "wine", label: "ღვინის დასხმა", icon: "🍷" },
    { id: "text", label: "წარწერა", icon: "📝" },
  ];

  return (
    
    <div className="relative w-full h-[calc(100vh-3rem)] mt-12 bg-[#0b0d12] overflow-hidden select-none">
      
    
      <Canvas camera={{ position: [0, 2, 8], fov: 45 }} className="w-full h-full">
        <OrbitControls 
          enableDamping 
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={4}
          maxDistance={15}
        />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade />
        <ambientLight intensity={0.4} />
        
        <Experience hasDesigned={true} settings={designSettings} />
      </Canvas>

     
      <div className="absolute top-6 left-6 pointer-events-none bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/5">
        <h1 className="text-base font-light tracking-wide text-white">მონუმენტის კონფიგურატორი</h1>
        <p className="text-[11px] text-gray-400 font-light mt-0.5">შექმენით ციფრული მემორიალი რეალურ დროში</p>
      </div>

     
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-xs font-light text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 border border-white/5 backdrop-blur-md rounded-xl transition-all"
        >
          გაუქმება
        </button>
        <button
          onClick={handlePublish}
          className="px-5 py-2 text-xs font-medium text-[#0b0d12] bg-[#ffd700] hover:bg-[#ffe240] rounded-xl shadow-lg shadow-yellow-500/5 transition-all"
        >
          შენახვა და გამოქვეყნება
        </button>
      </div>

    
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-2xl bg-[#0f1117]/85 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[280px]">
        
       
        <div className="flex justify-around items-center bg-black/20 border-b border-white/5 py-2 px-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-3 min-w-[75px] rounded-xl transition-all duration-200 group ${
                activeCategory === cat.id
                  ? "bg-[#ffd700]/10 border border-[#ffd700]/20 text-[#ffd700] scale-105"
                  : "border border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <span className="text-xl mb-0.5 transition-transform group-hover:scale-110 duration-150">
                {cat.icon}
              </span>
              <span className="text-[10px] font-light tracking-wide whitespace-nowrap">
                {cat.label}
              </span>
            </button>
          ))}
        </div>

      
        <div className="flex-1 p-5 overflow-y-auto min-h-[120px]">
          
        
          {activeCategory === "stone" && (
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto animate-fadeIn">
              <button
                onClick={() => updateSetting("stoneType", "black_granite")}
                className={`p-3 rounded-xl border text-xs text-left transition-all ${
                  designSettings.stoneType === "black_granite"
                    ? "border-[#ffd700] bg-[#ffd700]/5 text-[#ffd700]"
                    : "border-white/5 bg-white/[0.02] text-gray-300 hover:border-white/10"
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-stone-900 border border-white/20 mb-1" />
                <span className="font-medium block">შავი გრანიტი</span>
              </button>
              <button
                onClick={() => updateSetting("stoneType", "gray_marble")}
                className={`p-3 rounded-xl border text-xs text-left transition-all ${
                  designSettings.stoneType === "gray_marble"
                    ? "border-[#ffd700] bg-[#ffd700]/5 text-[#ffd700]"
                    : "border-white/5 bg-white/[0.02] text-gray-300 hover:border-white/10"
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-gray-400 border border-white/20 mb-1" />
                <span className="font-medium block">ნაცრისფერი მარმარილო</span>
              </button>
            </div>
          )}

        
          {activeCategory === "fence" && (
            <div className="grid grid-cols-3 gap-3 max-w-xl mx-auto">
              {[
                { id: "none", label: "ღობის გარეშე" },
                { id: "iron", label: "ჭედური რკინა" },
                { id: "stone", label: "ქვის ბორდიური" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => updateSetting("fenceStyle", item.id)}
                  className={`p-3 rounded-xl border text-xs text-center font-light transition-all ${
                    designSettings.fenceStyle === item.id
                      ? "border-[#ffd700] bg-[#ffd700]/5 text-[#ffd700]"
                      : "border-white/5 bg-white/[0.02] text-gray-300 hover:border-white/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

        
          {activeCategory === "flowers" && (
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              {[
                { id: "none", label: "მოცილება", icon: "⚪" },
                { id: "roses", label: "ვარდები", icon: "🌹" },
                { id: "carnations", label: "მიხაკები", icon: "🪻" },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => updateSetting("flowers", item.id)}
                  className={`p-2.5 rounded-xl border text-xs text-center transition-all ${
                    designSettings.flowers === item.id
                      ? "border-[#ffd700] bg-[#ffd700]/5 text-[#ffd700]"
                      : "border-white/5 bg-white/[0.02] text-gray-300 hover:border-white/10"
                  }`}
                >
                  <span className="text-base block mb-0.5">{item.icon}</span>
                  <span className="font-light block">{item.label}</span>
                </button>
              ))}
            </div>
          )}

          
          {activeCategory === "wine" && (
            <div className="max-w-md mx-auto">
              <button
                onClick={() => updateSetting("winePoured", !designSettings.winePoured)}
                className={`w-full p-3.5 rounded-xl border text-xs text-left flex items-center justify-between transition-all ${
                  designSettings.winePoured 
                    ? "border-red-500 bg-red-500/5 text-red-400" 
                    : "border-white/5 bg-white/[0.02] text-gray-300 hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🍷</span>
                  <div>
                    <p className="font-medium">დაღვარე ღვინო საფლავზე</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">მარმარილოზე გაჩნდება ტრადიციული შესანდობარის სველი კვალი</p>
                  </div>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[9px] ${designSettings.winePoured ? "border-red-500 bg-red-500 text-white" : "border-gray-600"}`}>
                  {designSettings.winePoured && "✓"}
                </div>
              </button>
            </div>
          )}

         
          {activeCategory === "text" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-wide">სახელი და გვარი</label>
                <input
                  type="text"
                  value={designSettings.fullName}
                  onChange={(e) => updateSetting("fullName", e.target.value)}
                  className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#ffd700]"
                  placeholder="სახელი"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-wide">დაბადების წელი</label>
                <input
                  type="text"
                  value={designSettings.birthYear}
                  onChange={(e) => updateSetting("birthYear", e.target.value)}
                  className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#ffd700]"
                  placeholder="1950"
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className="text-[10px] text-gray-400 uppercase tracking-wide">გარდაცვალების წელი</label>
                <input
                  type="text"
                  value={designSettings.deathYear}
                  onChange={(e) => updateSetting("deathYear", e.target.value)}
                  className="bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#ffd700]"
                  placeholder="2026"
                />
              </div>
            </div>
          )}

        </div>
      </div>

   
      <div className="absolute bottom-6 left-6 text-[11px] text-gray-500 font-light pointer-events-none bg-black/20 px-2.5 py-1 rounded-md backdrop-blur-sm">
        ამოსატრიალებლად გამოიყენეთ მაუსი
      </div>

    </div>
  );
};

export default DesignGrave;