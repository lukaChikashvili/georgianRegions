"use client"
import Experience from "@/components/Experience";
import Lights from "@/components/Lights";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three"
export default function Home() {
  return (
    <>
      <Canvas camera={{ position: [-1, 2, 5], fov: 75, near: 0.1, far: 1000 }}
      shadows >
        <Lights />
          <Experience />
      </Canvas>
    </>
  );
}
