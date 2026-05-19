"use client";

import React, { useEffect, useState, useMemo } from "react";
import * as THREE from "three";

const SingleGraveInstance = ({ record, position, modelScene, baseTextures }) => {
  const [dynamicTexture, setDynamicTexture] = useState(null);

  
  const instanceScene = useMemo(() => modelScene.clone(), [modelScene]);

  
  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    const drawDynamicOverlays = () => {
      const circleX = 256;
      const circleY = 110;
      const radius = 75;

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
      const yearsText = `${record.birthYear || "????"} - ${record.deathYear || "????"}`;
      ctx.fillText(yearsText, 256, 295);

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
    bgImage.onerror = () => {
      ctx.fillStyle = record.stoneType === "gray_marble" ? "#555555" : "#16171a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawDynamicOverlays();
    };
  }, [record]);

  
  useEffect(() => {
    instanceScene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();

        if (child.name === "pCube9_impala_0" && dynamicTexture) {
          child.material.map = dynamicTexture;
          child.material.transparent = false;
          child.material.color.set("#ffffff");
          child.material.roughness = record.stoneType === "gray_marble" ? 0.45 : 0.15;
          child.material.metalness = 0.0;
        } else {
          if (record.stoneType === "black_granite") {
            child.material.map = baseTextures.granite;
            child.material.color.set("#ffffff");
            child.material.roughness = 0.15;
            child.material.metalness = 0.0;
          } else if (record.stoneType === "gray_marble") {
            child.material.map = baseTextures.marble;
            child.material.color.set("#ffffff");
            child.material.roughness = 0.45;
            child.material.metalness = 0.0;
          }
        }
        child.material.needsUpdate = true;
      }
    });
  }, [instanceScene, record, dynamicTexture, baseTextures]);

  return (
    <primitive 
      object={instanceScene} 
      scale={0.07} 
      position={position} 
    />
  );
};

export default SingleGraveInstance;