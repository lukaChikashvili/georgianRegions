"use client";

import { Grid, useGLTF, useTexture } from "@react-three/drei";
import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { grassVertex } from "../shaders/vertex";
import { grassFragment } from "../shaders/fragment";
import SingleGraveInstance from "./SingleGraveInstance";

const Experience = ({ graveRecords = [], designSettings  }) => {

  
  const uniforms = useRef({
    uTime: { value: 0 },
    uSeason: { value: 1.5 },
  });





  useFrame((state) => {
    uniforms.current.uTime.value += 0.25;
  });

  const graveModel = useGLTF("/grave.glb");
  const fenceModel = useGLTF('/iron_fence.glb');
  const woodFenceModel = useGLTF('/fence.glb');
  const smallTable = useGLTF('/side_table.glb');
  const { scene: bottleScene } = useGLTF('/wine_bottle.glb');
  const flowers = useGLTF('/flowers.glb');
  const tulip = useGLTF('/simple_tulip.glb');



  const fenceStyle = graveRecords[0]?.fenceStyle || "none";
  const flowerStyle = graveRecords[0]?.flowers || "none";

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


    {flowerStyle === "roses" && (
       <primitive object={flowers.scene} position = {[-1.5, 0, -10]}    scale = {0.1} />
    )}

{flowerStyle === "tulips" && (
       <primitive object={tulip.scene} rotation = {[-1.5, 0, 0]} position = {[-6.5, -0.7, -7]}    scale = {0.7} />
    )}











     
      {fenceStyle === "iron" && (
        <>
        
         <primitive object={fenceModel.scene.clone()} scale = {6}
                    position = {[22, -5, 6]} />
                    <primitive object={fenceModel.scene.clone()} scale = {6}
                    position = {[22, -5, -8]} />
                     <primitive object={fenceModel.scene.clone()} scale = {6}
                    position = {[22, -5, -23]} />
                     <primitive object={fenceModel.scene.clone()} scale = {6}
                    position = {[22, -5, -38]} />

          <primitive object={fenceModel.scene.clone()} scale = {6}
                    position = {[9, -5, -51]} rotation = {[0, 1.6, 0]} />  
                    <primitive object={fenceModel.scene.clone()} scale = {6}
                    position = {[-4.5, -5, -51]} rotation = {[0, 1.6, 0]} />  
                    <primitive object={fenceModel.scene.clone()} scale = {6}
                    position = {[-17.5, -5, -51]} rotation = {[0, 1.6, 0]} /> 
                    <primitive object={fenceModel.scene.clone()} scale = {6}
                    position = {[22, -5, -51]} rotation = {[0, 1.6, 0]} />  

<primitive object={fenceModel.scene.clone()} scale = {6}
                    position = {[-30, -5, 6]} />
                    <primitive object={fenceModel.scene.clone()} scale = {6}
                    position = {[-30, -5, -8]} />
                     <primitive object={fenceModel.scene.clone()} scale = {6}
                    position = {[-30, -5, -23]} />
                     <primitive object={fenceModel.scene.clone()} scale = {6}
                    position = {[-30, -5, -38]} />

<primitive object={fenceModel.scene.clone()} scale = {6}
                    position = {[9, -5, 8]} rotation = {[0, 1.6, 0]} />  
                    <primitive object={fenceModel.scene.clone()} scale = {6}
                    position = {[-4.5, -5, 8]} rotation = {[0, 1.6, 0]} />  
                    <primitive object={fenceModel.scene.clone()} scale = {6}
                    position = {[-17.5, -5, 8]} rotation = {[0, 1.6, 0]} /> 
                    <primitive object={fenceModel.scene.clone()} scale = {6}
                    position = {[22, -5, 8]} rotation = {[0, 1.6, 0]} />  

                    </>
      )}


{fenceStyle === "wood" && (
        <>
        
           <primitive object={woodFenceModel.scene.clone()} scale = {6}
                    position = {[36, -5, 6]} rotation = {[0, -0.3, 0]} />
                    <primitive object={woodFenceModel.scene.clone()} scale = {6}
                    position = {[34, -5,-19.5]} rotation = {[0, -0.3, 0]} />
                    <primitive object={woodFenceModel.scene.clone()} scale = {6}
                    position = {[37, -5,-45]} rotation = {[0, -0.3, 0]} />

       

          <primitive object={woodFenceModel.scene.clone()} scale = {6}
                    position = {[19, -5, -51]} rotation = {[0, 1.2, 0]} />  
                    <primitive object={woodFenceModel.scene.clone()} scale = {6}
                    position = {[-33, -5, -49]} rotation = {[0, 1.2, 0]} /> 
                   <primitive object={woodFenceModel.scene.clone()} scale = {6}
                    position = {[-7, -5, -49]} rotation = {[0, 1.2, 0]} />   
                  

<primitive object={woodFenceModel.scene.clone()} scale = {6}
                    position = {[-30, -5, 6]} rotation = {[0, -0.3, 0]} />
                    <primitive object={woodFenceModel.scene.clone()} scale = {6}
                    position = {[-31, -5,-19.5]} rotation = {[0, -0.3, 0]} />
                    <primitive object={woodFenceModel.scene.clone()} scale = {6}
                    position = {[-32, -5,-45]} rotation = {[0, -0.3, 0]} />



                    </>
      )}



   <primitive object={smallTable.scene} scale = {4} position = {[-10, -2, -13]}  />


   {(designSettings?.winePoured ?? graveRecords[0]?.winePoured) && bottleScene && (
  <primitive 
    object={bottleScene.clone()} 
    scale={0.5} 
    position={[-10, 0.5, -13]} 
  />
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

export default Experience;