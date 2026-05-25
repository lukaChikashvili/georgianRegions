"use client";

import { Grid, useGLTF, useTexture } from "@react-three/drei";
import React, { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

import { grassVertex } from "../../../shaders/vertex";
import { grassFragment } from "../../../shaders/fragment";
import SingleGraveInstance from "../../../components/SingleGraveInstance";

const ExperienceDesign = ({ graveRecords = [] }) => {

  const graveModel = useGLTF("/grave.glb");
  const ironFenceModel = useGLTF('/iron_fence.glb');

  const textures = useTexture({
    granite: "/black.avif",
    marble: "/gray.avif",
  });

  const uniforms = useRef({
    uTime: { value: 0 },
    uSeason: { value: 1.5 },
  });

  
  useMemo(() => {
    Object.values(textures).forEach((texture) => {
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
    });
  }, [textures]);

  useFrame((state) => {
    uniforms.current.uTime.value += 0.25;
  });

  const columnsCount = 4; 
  const spacingX = 12;   
  const spacingZ = 16;   

  
  const fenceStyle = graveRecords[0]?.fenceStyle || "none";

  return (
    <>
      <fog attach="fog" args={["#0b0d12", 40, 200]} />

      <Grid
        position={[0, -3.95, 0]}
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#1d1f22"
        sectionSize={5}
        sectionColor="#ffd700"
        fadeDistance={60}
      />

      <group position={[16, -4, 0]}>
        {graveRecords.map((record, index) => {
          const col = index % columnsCount;
          const row = Math.floor(index / columnsCount);
          const xPos = (col - (columnsCount - 1) / 2) * spacingX;
          const zPos = -row * spacingZ;

          return (
            <SingleGraveInstance
              key={record._id || index}
              record={record}
              position={[xPos, 0.1, zPos]}
              modelScene={graveModel.scene}
              baseTextures={textures}
            />
          );
        })}
      </group>


      {fenceStyle === "iron" && ironFenceModel.scene && (
        <primitive 
          object={ironFenceModel.scene.clone()} 
          position={[16, -4, 0]} 
          scale={[1, 1, 1]}
        />
      )}

      {fenceStyle === "stone" && (
        <group position={[16, -4, 0]}>
    
          <mesh position={[0, 0.1, -8]}>
            <boxGeometry args={[20, 0.3, 0.5]} />
            <meshStandardMaterial color="#666666" roughness={0.8} metalness={0.2} />
          </mesh>
         
          <mesh position={[0, 0.1, 8]}>
            <boxGeometry args={[20, 0.3, 0.5]} />
            <meshStandardMaterial color="#666666" roughness={0.8} metalness={0.2} />
          </mesh>
          
          <mesh position={[-10, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[16, 0.3, 0.5]} />
            <meshStandardMaterial color="#666666" roughness={0.8} metalness={0.2} />
          </mesh>
          
          <mesh position={[10, 0.1, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[16, 0.3, 0.5]} />
            <meshStandardMaterial color="#666666" roughness={0.8} metalness={0.2} />
          </mesh>
        </group>
      )}
      
 
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -20, 0]}>
        <planeGeometry args={[2000, 2000, 400, 400]} />
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

export default ExperienceDesign;