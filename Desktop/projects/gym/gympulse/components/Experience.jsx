"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import React, { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { grassVertex } from "../shaders/vertex";
import { grassFragment } from "../shaders/fragment";
import SingleGraveInstance from "./SingleGraveInstance";

const Experience = ({ graveRecords = [],  isPreview = false }) => {
  const uniforms = useRef({
    uTime: { value: 0 },
    uSeason: { value: 1.5 },
  });

  useFrame(() => {
    uniforms.current.uTime.value += 0.005;
  });

  const graveModel = useGLTF("/grave.glb");

  const textures = useTexture({
    granite: "/black.avif",
    marble: "/gray.avif",
    grass: "/grass.avif",
    brick: "/brick.avif",
    stone: "/stone.webp",
    marble_tile: "/marble.jpg",
  });

  const tilingTextures = ["grass", "brick", "stone", "marble_tile", "granite", "marble"];
  Object.entries(textures).forEach(([name, texture]) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(tilingTextures.includes(name) ? 4 : 1, tilingTextures.includes(name) ? 4 : 1);
    texture.needsUpdate = true;
  });

  const spacingX = 75;
  const spacingZ = 75;
  const gravesPerRow = 3;

  return (
    <>
      <fog attach="fog" args={["#0b0d12", 60, 250]} />

      <group position={isPreview ? [0, -4, -20] : [50, -4, -20]}>
        {graveRecords.map((record, index) => {
          const row = Math.floor(index / gravesPerRow);
          const indexInRow = index % gravesPerRow;
          const offset =
            indexInRow === 0
    ? 0
    : Math.ceil(indexInRow / 2) * (indexInRow % 2 === 1 ? -1 : 1);

          const xPos = offset * spacingX;
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

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -13.05, 0]}>
        <planeGeometry args={[500, 500, 350, 350]} />
        <shaderMaterial
          vertexShader={grassVertex}
          fragmentShader={grassFragment}
          uniforms={uniforms.current}
          side={THREE.DoubleSide}
        />
      </mesh>

      <ambientLight intensity={1} />
      <directionalLight position={[20, 30, 10]} intensity={1.2} color="#8ea3ff" />
      <directionalLight position={[-20, 10, -30]} intensity={0.4} color="#4d5cff" />
    </>
  );
};

export default Experience;