"use client"
import React, { useEffect, useRef } from 'react'
import { vertex } from '@/shaders/vertex'
import { fragment } from '@/shaders/fragment'
import * as dat from "dat.gui";

const Experience = () => {
   // uniforms
   const uniforms = useRef({
      uBigWavesElevation: { value: 0.2}
   });

   useEffect(() => {
    let gui;

    import("dat.gui").then((dat) => {
      gui = new dat.GUI();

      gui
        .add(uniforms.current.uBigWavesElevation, "value", 0, 1, 0.01)
        .name("Big Waves Elevation");
    });


    return () => {
      if (gui) gui.destroy();
    };
  }, []);

  return (
    <>

    
  
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[5, 5]} />
       <shaderMaterial 
       vertexShader={vertex} 
       fragmentShader={fragment} uniforms={uniforms.current}/>
    </mesh>

    </>
  )
}

export default Experience
