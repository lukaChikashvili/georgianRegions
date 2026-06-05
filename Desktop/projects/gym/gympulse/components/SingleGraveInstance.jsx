"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useFrame } from "@react-three/fiber";

const PLOT_SIZE = 20;
const FENCE_SCALE = 7;

const ironSides = [
  { pos: [30, 0,  30],  rot: [0, 0, 0] },
  { pos: [30, 0,  14],  rot: [0, 0, 0] },
  { pos: [30, 0,  -2],  rot: [0, 0, 0] },
  { pos: [30, 0, -18],  rot: [0, 0, 0] },
  { pos: [-30, 0,  30], rot: [0, 0, 0] },
  { pos: [-30, 0,  14], rot: [0, 0, 0] },
  { pos: [-30, 0,  -2], rot: [0, 0, 0] },
  { pos: [-30, 0, -18], rot: [0, 0, 0] },
  { pos: [ 14.5, 0, 31], rot: [0, 1.6, 0] },
  { pos: [  -1,  0, 31], rot: [0, 1.6, 0] },
  { pos: [-17,   0, 31], rot: [0, 1.6, 0] },
  { pos: [ 30,   0, 31], rot: [0, 1.6, 0] },
  { pos: [-17,  0, -31], rot: [0, 1.6, 0] },
  { pos: [  -1, 0, -31.5], rot: [0, 1.6, 0] },
  { pos: [ 15,  0, -32], rot: [0, 1.6, 0] },
  { pos: [ 30,  0, -32], rot: [0, 1.6, 0] },
];

const woodSides = ironSides;

const SingleGraveInstance = ({ record, position, modelScene, baseTextures, visitorWine = false }) => {
  const [dynamicTexture, setDynamicTexture] = useState(null);

  const { scene: ironFenceScene } = useGLTF('/iron_fence.glb');
  const { scene: woodFenceScene } = useGLTF('/fence.glb');
  const { scene: tableScene }     = useGLTF('/side_table.glb');
  const { scene: bottleScene }    = useGLTF('/wine_bottle.glb');
  const { scene: flowersScene }   = useGLTF('/flowers.glb');
  const { scene: tulipScene }     = useGLTF('/simple_tulip.glb');

  const bottleRef = useRef();

  const bottleCallbackRef = (node) => {
    bottleRef.current = node;
    if (node) {
      
      node.position.set(START_POS.x, START_POS.y, START_POS.z);
      node.rotation.set(0, 0, 0);
      wineProgressRef.current = 0;
    }
  };


  const wineRef = useRef();
  const wineProgressRef = useRef(0); 

  const START_POS = { x: -13, y: 7, z: -10 };
  const POUR_POS  = { x: 0,   y: 18, z: 5  };



  useFrame((_, delta) => {
    if (!visitorWine) return;
    console.log("useFrame running, bottleRef:", bottleRef.current, "progress:", wineProgressRef.current);

  
    const p = wineProgressRef.current;
    wineProgressRef.current = Math.min(p + delta * 0.3, 1);
  
    if (bottleRef.current) {
      const phase1 = Math.min(p / 0.3, 1);          
      const phase2 = Math.min(Math.max((p - 0.3) / 0.3, 0), 1);
      const phase3 = Math.min(Math.max((p - 0.6) / 0.4, 0), 1); 
  

      const liftY = THREE.MathUtils.lerp(START_POS.y, START_POS.y + 8, phase1);
  
   
      const moveX = THREE.MathUtils.lerp(START_POS.x, POUR_POS.x, phase2);
      const moveZ = THREE.MathUtils.lerp(START_POS.z, POUR_POS.z, phase2);
      const moveY = THREE.MathUtils.lerp(liftY, POUR_POS.y, phase2);
  
      bottleRef.current.position.set(moveX, moveY, moveZ);
  
      bottleRef.current.rotation.z = THREE.MathUtils.lerp(0, -Math.PI * 0.65, phase3);
   
      bottleRef.current.rotation.x = THREE.MathUtils.lerp(0, Math.PI * 0.1, phase3);
    }
  
    if (wineRef.current) {
      const phase3 = Math.min(Math.max((p - 0.6) / 0.4, 0), 1);
      const s = THREE.MathUtils.lerp(0.01, 1, phase3);
      wineRef.current.scale.set(s, 1, s);
      wineRef.current.material.opacity = THREE.MathUtils.lerp(0, 0.9, phase3);
    }
  });




  const instanceScene = useMemo(() => modelScene.clone(), [modelScene]);

  const portraitUrl = useQuery(
    api.services.getStorageUrl,
    record.portraitImg && !record.portraitImg.startsWith("http")
      ? { storageId: record.portraitImg }
      : "skip"
  );

  const portraitImg = record.portraitImg?.startsWith("http")
  ? record.portraitImg
  : portraitUrl ?? null;

  const fenceStyle  = record.fenceStyle  || "none";
  const floorStyle  = record.floorStyle  || "grass";
  const flowerStyle = record.flowers     || "none";
  const winePoured  = record.winePoured  || false;


const fullName    = record.fullName    || "";
const birthYear   = record.birthYear   || "";
const deathYear   = record.deathYear   || "";
const stoneType   = record.stoneType   || "black_granite";

useEffect(() => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");

  const renderTextLines = () => {
    ctx.fillStyle = "#ffd700";
    ctx.textAlign = "center";
    ctx.font = "bold 28px Arial, sans-serif";
    ctx.fillText(fullName || "სახელი გვარი", 256, 245);
    ctx.font = "22px Arial, sans-serif";
    ctx.fillText(`${birthYear || "????"} - ${deathYear || "????"}`, 256, 295);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    setDynamicTexture(tex);
  };

  const drawPortrait = () => {
    const circleX = 256;
    const circleY = 110;
    const radius = 75;

    if (portraitImg && portraitImg.startsWith("http")) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = portraitImg;
      img.onload = () => {
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, circleX - radius, circleY - radius, radius * 2, radius * 2);
        ctx.restore();
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
        ctx.stroke();
       
        renderTextLines();
      };
      img.onerror = (e) => {
       
        renderTextLines();
      };
    }
  };

  const bgImage = new Image();
  bgImage.crossOrigin = "anonymous"; 

  const bgSrc = stoneType === "gray_marble" ? "/gray.avif" : "/black.avif";
  bgImage.src = bgSrc;
  bgImage.onload = () => {
    ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
    drawPortrait();
  };
  bgImage.onerror = () => drawPortrait();

}, [portraitImg, fullName, birthYear, deathYear, stoneType]);

useEffect(() => {
  instanceScene.traverse((child) => {
    if (child.isMesh && child.material) {
      child.material = child.material.clone();
      if (child.name === "pCube9_impala_0") {
        child.material.map = dynamicTexture || 
          (record.stoneType === "gray_marble" ? baseTextures.marble : baseTextures.granite);
      } else {
        child.material.map =
          record.stoneType === "gray_marble" ? baseTextures.marble : baseTextures.granite;
      }
      child.material.needsUpdate = true;
    }
  });
}, [instanceScene, record.stoneType, dynamicTexture, baseTextures]);

const showBottle = record.winePoured || visitorWine;


  return (
    <group position={position}>
     
      <primitive object={instanceScene} scale={0.12} position={[0, 0, 10]} />

   
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[PLOT_SIZE * 3, PLOT_SIZE * 3]} />
        <meshStandardMaterial map={baseTextures[floorStyle]} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>

     
      <primitive object={tableScene.clone()} scale={8} position={[-13, 2, -10]} />

      {record.winePoured && !visitorWine && (
  <group position={[-13, 7, -10]}>
    <primitive object={bottleScene.clone()} scale={0.9} />
  </group>
)}
     
   

     {visitorWine && (
  <group ref={bottleCallbackRef}>
    <primitive object={bottleScene.clone()} scale={0.9} />
  </group>
)}

{visitorWine && (
  <mesh
    ref={wineRef}
    rotation={[-Math.PI / 2, 0, 0]}
    position={[0, 0.02, 5]}
    scale={[0.01, 1, 0.01]}
  >
    <circleGeometry args={[5, 32]} />
    <meshStandardMaterial
      color="#6B0000"
      transparent
      opacity={0}
      roughness={0.15}
      metalness={0.2}
    />
  </mesh>
)}

      
      {flowerStyle === "roses" && (
        <primitive object={flowersScene.clone()} scale={0.2} position={[1, 7, -10]}  />
      )}
      {flowerStyle === "tulips" && (
        <primitive object={tulipScene.clone()} scale={1.5} rotation={[-1.5, 0, 0]} position={[-10, 5.6, -1]} />
      )}

      
      {fenceStyle === "iron" && ironSides.map((s, i) => (
        <primitive key={i} object={ironFenceScene.clone()} scale={FENCE_SCALE} position={s.pos} rotation={s.rot} />
      ))}

     
      {fenceStyle === "wood" && woodSides.map((s, i) => (
        <primitive key={i} object={woodFenceScene.clone()} scale={FENCE_SCALE} position={s.pos} rotation={s.rot} />
      ))}
    </group>
  );
};

export default SingleGraveInstance;