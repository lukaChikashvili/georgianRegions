"use client";

import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'convex/react'; 
import { api } from '../../convex/_generated/api'; 
import Experience from '../../components/Experience';

const Page = () => {
  const router = useRouter();
  
 
  const allGraves = useQuery(api.memorials.getAllGraveDesigns);
  
  
  const myGrave = useQuery(api.memorials.getMyGraveDesign);
  const hasDesigned = !!myGrave;

  if (allGraves === undefined) {
    return (
      <div className="w-full h-[calc(100vh-3rem)] mt-12 bg-[#0b0d12] flex items-center justify-center">
        <p className="text-sm text-gray-500 font-light tracking-widest animate-pulse">
          ვირტუალური სასაფლაო იტვირთება...
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-3rem)] mt-12 bg-[#0b0d12]"> 
      <Canvas 
        camera={{ position: [0, 15, 30], fov: 50 }}
        className="w-full h-full"
      >  
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05} 
          maxDistance={80} 
        />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
       
        <Experience graveRecords={allGraves} />
      </Canvas>

      
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xl px-4 pointer-events-none">
        <div className="flex items-center justify-between p-4 border pointer-events-auto rounded-xl bg-[#16181e]/90 border-white/5 backdrop-blur-md shadow-xl">
          <div className="text-left">
            <p className="text-xs font-light text-gray-400 tracking-wider">
              ვირტუალური სივრცე
            </p>
            <h3 className="text-sm font-medium text-white tracking-wide mt-0.5">
              {hasDesigned ? myGrave.fullName : "მემორიალი არ არის შექმნილი"}
            </h3>
          </div>

          <button 
            onClick={() => router.push("/grave/create-gravestone")}
            className="flex items-center gap-2 py-2 px-4 text-xs font-medium text-[#0b0d12] bg-[#ffd700] hover:bg-[#ffe240] transition-all duration-300 rounded-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            {hasDesigned ? "დიზაინის შეცვლა" : "მონუმენტის განთავსება"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;