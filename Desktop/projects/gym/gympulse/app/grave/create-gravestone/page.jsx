"use client";

import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api"; 
import Experience from "../../../components/Experience";
import DesignPanel from "../../../components/DesignPanel"; 

const DesignGrave = () => {
  const router = useRouter();
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const savedDesignData = useQuery(api.memorials.getMyGraveDesign);
  const saveDesign = useMutation(api.memorials.saveMyGraveDesign);
  const deleteDesign = useMutation(api.memorials.deleteMyGraveDesign); 

  const [activeCategory, setActiveCategory] = useState("stone");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); 

  const defaultSettings = {
    stoneType: "black_granite",
    fenceStyle: "none",   
    floorStyle: "grass",     
    flowers: "none",       
    winePoured: false,
    voiceToast: null,
    portraitImg: null,
    fullName: "",
    birthYear: "",
    deathYear: "",
  };

  const [designSettings, setDesignSettings] = useState(defaultSettings);

  useEffect(() => {
    if (savedDesignData !== undefined && savedDesignData !== null) {
      setDesignSettings({
        stoneType: savedDesignData.stoneType || "black_granite",
        fenceStyle: savedDesignData.fenceStyle || "none",
        floorStyle: savedDesignData.floorStyle || "grass",
        flowers: savedDesignData.flowers || "none",
        winePoured: !!savedDesignData.winePoured,
        voiceToast: savedDesignData.voiceToast || null,
        portraitImg: savedDesignData.portraitImg || null,
        fullName: savedDesignData.fullName || "",
        birthYear: savedDesignData.birthYear || "",
        deathYear: savedDesignData.deathYear || "",
      });
    }
  }, [savedDesignData]);

  if (savedDesignData === undefined) {
    return (
      <div className="w-full h-screen bg-[#0b0d12] flex flex-col items-center justify-center text-white">
        <div className="w-8 h-8 border-2 border-[#ffd700] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-light text-gray-400 tracking-wider">იტვირთება 3D გარემო...</p>
      </div>
    );
  }

  const updateSetting = (key, value) => {
    setDesignSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await saveDesign({
        stoneType: designSettings.stoneType,
        fenceStyle: designSettings.fenceStyle,
        floorStyle: designSettings.floorStyle,
        flowers: designSettings.flowers,
        winePoured: designSettings.winePoured,
        voiceToast: designSettings.voiceToast,
        portraitImg: designSettings.portraitImg,
        fullName: designSettings.fullName,
        birthYear: designSettings.birthYear,
        deathYear: designSettings.deathYear,
      });
    
       router.push('/grave');
    } catch (error) {
      console.error("შეცდომა შენახვისას:", error);
      alert(error instanceof Error ? error.message : "დაფიქსირდა შეცდომა.");
    } finally {
      setIsPublishing(false);
    }
  };


  const handleDelete = async () => {
    if (!window.confirm("ნამდვილად გსურთ ამ ციფრული მემორიალის წაშლა?")) return;

    setIsDeleting(true);
    try {
      await deleteDesign();
      
      setDesignSettings(defaultSettings);
      console.log("მონუმენტი წარმატებით წაიშალა.");
      
      
      router.push("/grave");
    } catch (error) {
      console.error("შეცდომა წაშლისას:", error);
      alert(error instanceof Error ? error.message : "წაშლა ვერ მოხერხდა.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-3rem)] mt-12 bg-[#0b0d12] overflow-hidden select-none flex flex-col">
      <Canvas camera={{ position: [0, 2, 6], fov: 45 }}  className="w-full flex-grow">
        <OrbitControls 
          enableDamping 
          maxPolarAngle={Math.PI / 2 - 0.05}
          minDistance={3}
          maxDistance={12}
        />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
        
        
        <Experience 
          graveRecords={[
            {
              _id: "preview-id",
              stoneType: designSettings.stoneType,
              fenceStyle: designSettings.fenceStyle,
              floorStyle: designSettings.floorStyle,
              flowers: designSettings.flowers,
              winePoured: designSettings.winePoured,
              fullName: designSettings.fullName,
              birthYear: designSettings.birthYear,
              deathYear: designSettings.deathYear,
              portraitImg: designSettings.portraitImg,
            }
          ]} 
          designSettings={designSettings}
          isPreview={true}
        />
      </Canvas>

      <div className="absolute top-6 left-6 pointer-events-none bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/5 hidden sm:block">
        <h1 className="text-base font-light tracking-wide text-white">3D საფლავის დიზაინერი</h1>
        <p className="text-[11px] text-gray-400 font-light mt-0.5">
          ცვლილებები ავტომატურად ინახება თქვენს პროფილზე
        </p>
      </div>

      <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
       
        {savedDesignData && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-light text-red-400 hover:text-red-200 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 backdrop-blur-md rounded-xl transition-all disabled:opacity-50"
          >
            {isDeleting ? "იშლება..." : "მემორიალის წაშლა"}
          </button>
        )}

        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 text-xs font-light text-gray-400 hover:text-white bg-black/20 hover:bg-black/40 border border-white/5 backdrop-blur-md rounded-xl transition-all"
        >
          მთავარი
        </button>
        <button
          onClick={handlePublish}
          disabled={isPublishing}
          className="px-5 py-2 text-xs font-medium text-[#0b0d12] bg-[#ffd700] hover:bg-[#ffe240] rounded-xl shadow-lg transition-all disabled:opacity-50"
        >
          {isPublishing ? "ინახება..." : "დიზაინის შენახვა"}
        </button>
      </div>

      {!isPanelOpen && (
      <button 
        onClick={() => setIsPanelOpen(true)}
        className="absolute bottom-6 right-6 z-50 p-4 bg-[#D4AF37] text-black rounded-full shadow-lg hover:scale-105 transition-all"
      >
        🎨
      </button>
    )}

<div className={isPanelOpen ? "block" : "hidden"}>
      <DesignPanel 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory}
        designSettings={designSettings}
        updateSetting={updateSetting}
        onClose={() => setIsPanelOpen(false)} 
      />
    </div>
    </div>
  );
};

export default DesignGrave;