"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Experience from "../../../components/Experience";
import { useRouter } from "next/navigation";
import { use } from "react";
import { ArrowLeft, Users } from "lucide-react";

export default function CityPage({ params }) {
  const { city } = use(params);
  const decodedCity = decodeURIComponent(city);
  const router = useRouter();

  const graves = useQuery(api.memorials.getCityGraves, { city: decodedCity });
  const allCities = useQuery(api.memorials.getAllCities);
  const cityInfo = allCities?.find((c) => c.name === decodedCity);

  if (graves === undefined) {
    return (
      <div className="w-full h-screen bg-[#0b0d12] flex items-center justify-center">
        <p className="text-gray-500 text-sm animate-pulse">{decodedCity} იტვირთება...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-[#0b0d12] mt-12">
      <Canvas camera={{ position: [0, 15, 30], fov: 50 }}>
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05}
          maxDistance={200}
        />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Experience graveRecords={graves ?? []} />
      </Canvas>

     
      <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/5 space-y-1">
        <p className="text-[10px] uppercase tracking-widest text-gray-500">ვირტუალური სასაფლაო</p>
        <h1 className="text-lg font-light text-white">{decodedCity}</h1>
        {cityInfo && (
          <p className="text-[11px] text-gray-500 flex items-center gap-1">
            <Users size={9} /> {cityInfo.plotCount} / {cityInfo.maxPlots} ადგილი
          </p>
        )}
      </div>

     
      <button
        onClick={() => router.push("/grave")}
        className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 text-xs text-gray-400 hover:text-white bg-black/30 hover:bg-black/50 border border-white/5 backdrop-blur-md rounded-xl transition-all"
      >
        <ArrowLeft size={12} /> სასაფლაოების სია
      </button>

      
      {graves.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-4xl mb-3">🪦</p>
            <p className="text-sm text-gray-500">{decodedCity}-ში ჯერ მემორიალი არ არის</p>
          </div>
        </div>
      )}
    </div>
  );
}