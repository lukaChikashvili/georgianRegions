"use client"
import { OrbitControls, Stars } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import Experience from '../../components/Experience'

const Page = () => {
    return (
  
      <div className="relative w-full h-[calc(100vh-3rem)] mt-12"> 
        <Canvas camera={{ position: [5, 10, -30], fov: 45 }}
       
          className="w-full h-full"
        >  
         <OrbitControls />
         <Stars />
          <ambientLight intensity={1.5} />
            <Experience />
        </Canvas>
      </div>
    )
  }
  
  export default Page