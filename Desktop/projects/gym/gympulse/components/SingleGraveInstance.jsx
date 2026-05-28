"use client";

import React, { useEffect, useState, useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

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

const SingleGraveInstance = ({ record, position, modelScene, baseTextures }) => {
  const [dynamicTexture, setDynamicTexture] = useState(null);

  const { scene: ironFenceScene } = useGLTF('/iron_fence.glb');
  const { scene: woodFenceScene } = useGLTF('/fence.glb');
  const { scene: tableScene }     = useGLTF('/side_table.glb');
  const { scene: bottleScene }    = useGLTF('/wine_bottle.glb');
  const { scene: flowersScene }   = useGLTF('/flowers.glb');
  const { scene: tulipScene }     = useGLTF('/simple_tulip.glb');

  const instanceScene = useMemo(() => modelScene.clone(), [modelScene]);

  const fenceStyle  = record.fenceStyle  || "none";
  const floorStyle  = record.floorStyle  || "grass";
  const flowerStyle = record.flowers     || "none";
  const winePoured  = record.winePoured  || false;

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    const drawDynamicOverlays = () => {
      const circleX = 256;
      const circleY = 110;
      const radius  = 75;

      if (record.portraitImg) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = record.portraitImg;
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
        img.onerror = () => renderTextLines();
      } else {
        ctx.strokeStyle = "rgba(255, 215, 0, 0.4)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(circleX, circleY, radius, 0, Math.PI * 2);
        ctx.stroke();
        renderTextLines();
      }
    };

    const renderTextLines = () => {
      ctx.fillStyle = "#ffd700";
      ctx.textAlign = "center";
      ctx.font = "bold 32px 'Helvetica Neue', Arial, sans-serif";
      ctx.fillText(record.fullName || "სახელი გვარი", 256, 245);
      ctx.font = "24px 'Helvetica Neue', Arial, sans-serif";
      ctx.fillText(`${record.birthYear || "????"} - ${record.deathYear || "????"}`, 256, 295);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      setDynamicTexture(tex);
    };

    const bgImage = new Image();
    bgImage.src = record.stoneType === "gray_marble" ? "/gray.avif" : "/black.avif";
    bgImage.onload = () => {
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height);
      drawDynamicOverlays();
    };
  }, [record]);

  useEffect(() => {
    instanceScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        if (child.name === "pCube9_impala_0" && dynamicTexture) {
          child.material.map = dynamicTexture;
        } else {
          child.material.map =
            record.stoneType === "gray_marble" ? baseTextures.marble : baseTextures.granite;
        }
        child.material.needsUpdate = true;
      }
    });
  }, [instanceScene, record, dynamicTexture, baseTextures]);

  return (
    <group position={position}>
     
      <primitive object={instanceScene} scale={0.12} position={[0, 0, 10]} />

   
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[PLOT_SIZE * 3, PLOT_SIZE * 3]} />
        <meshStandardMaterial map={baseTextures[floorStyle]} roughness={0.8} side={THREE.DoubleSide} />
      </mesh>

     
      <primitive object={tableScene.clone()} scale={4} position={[8, 2, 18]} />

     
      {winePoured && (
        <primitive object={bottleScene.clone()} scale={0.5} position={[8, 5, 18]} />
      )}

      
      {flowerStyle === "roses" && (
        <primitive object={flowersScene.clone()} scale={0.1} position={[-8, 0, 15]} />
      )}
      {flowerStyle === "tulips" && (
        <primitive object={tulipScene.clone()} scale={0.7} rotation={[-1.5, 0, 0]} position={[-8, -0.7, 15]} />
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