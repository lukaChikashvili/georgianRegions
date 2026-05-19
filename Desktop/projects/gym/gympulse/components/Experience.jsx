"use client";

import { Grid, useGLTF, useTexture } from "@react-three/drei";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { grassVertex } from "../shaders/vertex";
import { grassFragment } from "../shaders/fragment";

const Experience = ({ hasDesigned, settings, userData }) => {
  const uniforms = useRef({
    uTime: { value: 0 },
    uSeason: { value: 1.5 },
  });

 
  const [dynamicTexture, setDynamicTexture] = useState(null);

  useFrame((state) => {
    uniforms.current.uTime.value = state.clock.getElapsedTime();
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

  const clonedScene = useMemo(() => graveModel.scene.clone(), [graveModel]);

  
  useEffect(() => {
    if (!userData) return;

    
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    
    ctx.fillStyle = "#16171a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const drawTextAndCreateTexture = () => {
    
      ctx.fillStyle = "#ffd700";
      ctx.textAlign = "center";
      
      
      ctx.font = "bold 30px 'Helvetica Neue', Arial, sans-serif";
      ctx.fillText(userData.name || "სახელი გვარი", 256, 360);

     
      ctx.font = "22px 'Helvetica Neue', Arial, sans-serif";
      const yearsText = `${userData.birthYear || "????"} - ${userData.deathYear || "????"}`;
      ctx.fillText(yearsText, 256, 415);

      
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      setDynamicTexture(tex);
    };

    
    if (userData.imgUrl) {
      const img = new Image();
      img.crossOrigin = "anonymous"; 
      img.src = userData.imgUrl;
      
      img.onload = () => {
       
        ctx.save();
        ctx.beginPath();
        ctx.arc(256, 170, 100, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, 156, 70, 200, 200);
        ctx.restore();

        
        ctx.strokeStyle = "#ffd700";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(256, 170, 100, 0, Math.PI * 2);
        ctx.stroke();

        drawTextAndCreateTexture();
      };

      img.onerror = () => {
        drawTextAndCreateTexture(); 
      };
    } else {
     
      ctx.fillStyle = "#2c2e33";
      ctx.beginPath();
      ctx.arc(256, 170, 100, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = "#4a4e57";
      ctx.lineWidth = 2;
      ctx.stroke();

      drawTextAndCreateTexture();
    }
  }, [userData]);

 
  useEffect(() => {
    if (!settings) return;

    clonedScene.traverse((child) => {
      if (child.isMesh) {
        console.log("Mesh Found Name:", child.name);
        
        if (child.material) {
          child.material = child.material.clone(); 
          
         
          if (child.name === "pCube9_impala_0" && dynamicTexture) {
            child.material.map = dynamicTexture;
            child.material.color.set("#ffffff");
            child.material.roughness = 0.2;
            child.material.metalness = 0.1;
          } else {
           
            if (settings.stoneType === "black_granite") {
              child.material.map = textures.granite;
              child.material.color.set("#ffffff"); 
              child.material.roughness = 0.15; 
              child.material.metalness = 0.0; 
            } else if (settings.stoneType === "gray_marble") {
              child.material.map = textures.marble;
              child.material.color.set("#ffffff");
              child.material.roughness = 0.45; 
              child.material.metalness = 0.0;
            }
          }
  
          child.material.needsUpdate = true;
        }
      }
    });
  }, [clonedScene, settings, textures, dynamicTexture]);

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
          <primitive 
            object={clonedScene} 
            scale={0.07} 
            position={[0, 0.1, 0]}
          />
        </group>
      )}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -20, 0]}>
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