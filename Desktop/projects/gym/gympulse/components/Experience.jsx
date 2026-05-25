"use client";

import { Grid, useGLTF, useTexture } from "@react-three/drei";
import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { grassVertex } from "../shaders/vertex";
import { grassFragment } from "../shaders/fragment";
import SingleGraveInstance from "./SingleGraveInstance";

const Experience = ({ graveRecords = [] }) => {

  
  const uniforms = useRef({
    uTime: { value: 0 },
    uSeason: { value: 1.5 },
  });



  useFrame((state) => {
    uniforms.current.uTime.value += 0.25;
  });

  const graveModel = useGLTF("/grave.glb");

  const textures = useTexture({
    granite: "/black.avif",
    marble: "/gray.avif",
  });

  Object.values(textures).forEach((texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
  });


  const columnsCount = 4; 
  const spacingX = 12;   
  const spacingZ = 16;   

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

export default Experience;