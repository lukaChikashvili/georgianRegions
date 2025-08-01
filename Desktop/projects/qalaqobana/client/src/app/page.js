"use client"
import Experience from "@/components/Experience";
import Header from "@/components/Header";
import Lights from "@/components/Lights";
import { PerspectiveCamera } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three"
export default function Home() {
  return (
    <>
      <Canvas camera={{ position: [0, 10, 15], fov: 70, near: 0.1, far: 10000 }}
      shadows gl={{ physicallyCorrectLights: true }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.FogExp2(0xcce0ff, 0.002) 
        scene.background = new THREE.Color(0xcce0ff)  
      }} >
         <PerspectiveCamera
        makeDefault
        position={[0, 20, 50]}
        fov={70}
      />
        <Lights />
          <Experience />
      </Canvas>


      <div className="w-full absolute top-0 left-0">
        <Header />
      </div>
    </>
  );
}
