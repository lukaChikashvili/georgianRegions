"use client";

import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRouter } from "next/navigation";
import Experience from "../../../components/Experience";


const DesignGrave = () => {
  const router = useRouter();

 
  const [designSettings, setDesignSettings] = useState({
    stoneType: "black_granite",
    fenceStyle: "none",        
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

  return (
    <div className="flex flex-col lg:flex-row w-full h-[calc(100vh-3rem)] mt-12 bg-[#0b0d12] overflow-hidden">
      
     
      <div className="w-full lg:w-[60%] h-[50vh] lg:h-full relative border-b lg:border-b-0 lg:border-r border-white/5">
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
        
       
        <div className="absolute bottom-4 left-4 text-xs text-gray-500 font-light pointer-events-none bg-black/40 px-3 py-1 rounded-md backdrop-blur-sm">
          ამოსატრიალებლად გამოიყენეთ მაუსი
        </div>
      </div>

      
      <div className="w-full lg:w-[40%] h-[50vh] lg:h-full flex flex-col justify-between p-6 lg:p-8 overflow-y-auto bg-[#0f1117]">
        
     
        <div className="space-y-8">
          <div>
            <h1 className="text-xl font-light text-white tracking-wide">მონუმენტის კონფიგურატორი</h1>
            <p className="text-xs text-gray-400 mt-1 font-light">შეცვალეთ დიზაინი რეალურ დროში</p>
          </div>

          <hr className="border-white/5" />

         
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-gray-400 font-medium">საფლავის ქვის მასალა</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateSetting("stoneType", "black_granite")}
                className={`py-3 px-4 rounded-xl border text-sm font-light transition-all ${
                  designSettings.stoneType === "black_granite"
                    ? "border-[#ffd700] bg-[#ffd700]/5 text-[#ffd700]"
                    : "border-white/5 bg-white/[0.02] text-gray-300 hover:border-white/10"
                }`}
              >
                შავი გრანიტი
              </button>
              <button
                onClick={() => updateSetting("stoneType", "gray_marble")}
                className={`py-3 px-4 rounded-xl border text-sm font-light transition-all ${
                  designSettings.stoneType === "gray_marble"
                    ? "border-[#ffd700] bg-[#ffd700]/5 text-[#ffd700]"
                    : "border-white/5 bg-white/[0.02] text-gray-300 hover:border-white/10"
                }`}
              >
                ნაცრისფერი მარმარილო
              </button>
            </div>
          </div>

         
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-wider text-gray-400 font-medium">პერსონალური მონაცემები</label>
            <input
              type="text"
              placeholder="სახელი და გვარი"
              value={designSettings.fullName}
              onChange={(e) => updateSetting("fullName", e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffd700] transition-colors"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="დაბადების წელი"
                value={designSettings.birthYear}
                onChange={(e) => updateSetting("birthYear", e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffd700] transition-colors"
              />
              <input
                type="text"
                placeholder="გარდაცვალების წელი"
                value={designSettings.deathYear}
                onChange={(e) => updateSetting("deathYear", e.target.value)}
                className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#ffd700] transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 space-y-3 bg-[#0f1117]">
          <button
            onClick={handlePublish}
            className="w-full py-3 text-sm font-medium text-[#0b0d12] bg-[#ffd700] hover:bg-[#ffe240] transition-all rounded-xl shadow-lg shadow-yellow-500/5 hover:scale-[1.01] active:scale-[0.99]"
          >
            დიზაინის შენახვა და გამოქვეყნება
          </button>
          <button
            onClick={() => router.back()}
            className="w-full py-3 text-sm font-light text-gray-400 hover:text-white transition-colors"
          >
            გაუქმება
          </button>
        </div>

      </div>
    </div>
  );
};

export default DesignGrave;