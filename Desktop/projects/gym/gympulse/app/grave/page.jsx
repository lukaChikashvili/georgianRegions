"use client"
import { OrbitControls, Stars } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Experience from '../../components/Experience'

const Page = () => {
  const router = useRouter()
  
  
  const [hasDesigned, setHasDesigned] = useState(false)

  return (
    <div className="relative w-full h-[calc(100vh-3rem)] mt-12 bg-[#0b0d12]"> 
      
   
      <Canvas 
      
        camera={{ position: [5, 8, 25], fov: 45 }}
        className="w-full h-full"
      >  
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 - 0.05} 
          minDistance={8}
          maxDistance={40}
        />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
       
        <ambientLight intensity={0.3} />
        
      
        <Experience hasDesigned={hasDesigned} />
      </Canvas>

      
      {!hasDesigned && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/40 backdrop-blur-[1px]">
          
        
          <div className="max-w-md p-8 text-center border pointer-events-auto rounded-2xl bg-[#16181e]/85 border-white/10 backdrop-blur-md shadow-2xl mx-4">
            <h2 className="text-xl font-light text-white tracking-wide mb-3">
              შექმენი ციფრული მემორიალი
            </h2>
            <p className="text-sm text-gray-400 mb-6 font-light leading-relaxed">
              დიზაინის სტუდია საშუალებას გაძლევთ შეარჩიოთ საფლავის ქვის სტილი, მასალა, მოაწყოთ გარემო და უკვდავყოთ თქვენთვის ძვირფასი ადამიანის სახელი.
            </p>
            
            <button 
              onClick={() => router.push("/grave/create-gravestone")}
              className="w-full py-3 px-6 text-sm font-medium text-[#0b0d12] bg-[#ffd700] hover:bg-[#ffe240] transition-all duration-300 rounded-xl shadow-lg shadow-yellow-500/5 hover:scale-[1.02] active:scale-[0.98]"
            >
              მონუმენტის დიზაინის დაწყება
            </button>
          </div>

        </div>
      )}
    </div>
  )
}

export default Page