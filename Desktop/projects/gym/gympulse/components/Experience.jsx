"use client";

import { Grid, useGLTF } from "@react-three/drei";
import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { grassVertex } from "../shaders/vertex";
import { grassFragment } from "../shaders/fragment";

const Experience = ({ hasDesigned }) => {
  const uniforms = useRef({
    uTime: { value: 0 },
    uSeason: { value: 1.5 },
  });

  useFrame((state) => {
    uniforms.current.uTime.value = state.clock.getElapsedTime();
  });

  const graveModel = useGLTF("./grave.glb");

  return (
    <>
      <fog attach="fog" args={["#0b0d12", 30, 150]} />

   
      <Grid
        position={[0, -3.95, 0]}
        args={[40, 40]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1d1f22"
        sectionSize={5}
        sectionColor="#ffd700"
        fadeDistance={40}
      />

      
      {hasDesigned && (
        <group position={[0, -4, 0]}>
       
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[4, 0.1, 5]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.3} />
          </mesh>
          
        
          <primitive 
            object={graveModel.scene.clone()} 
            scale={0.12} 
            position={[0, 0.1, 0]}
          />
        </group>
      )}

     
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -6, 0]}>
        <planeGeometry args={[1000, 1000, 400, 400]} />
        <shaderMaterial
          vertexShader={grassVertex}
          fragmentShader={grassFragment}
          uniforms={uniforms.current}
          side={THREE.DoubleSide}
        />
      </mesh>

   
      <ambientLight intensity={0.2} />
      <directionalLight position={[20, 30, 10]} intensity={1.2} color="#8ea3ff" />
      <directionalLight position={[-20, 10, -30]} intensity={0.4} color="#4d5cff" />
    </>
  );
};

export default Experience;