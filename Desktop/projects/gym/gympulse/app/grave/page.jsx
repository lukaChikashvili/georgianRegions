"use client"
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import React from 'react'
import Experience from '../../components/Experience'

const Page = () => {
    return (
  
      <div className="relative w-full h-[calc(100vh-3rem)] mt-12"> 
        <Canvas 
       
          className="w-full h-full"
        >  
         <OrbitControls />
          <ambientLight intensity={1.5} />
            <Experience />
        </Canvas>
      </div>
    )
  }
  
  export default Page