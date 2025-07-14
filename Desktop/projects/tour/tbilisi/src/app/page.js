"use client"
import Experience from "@/components/Experience";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";


export default function Home() {
  return (
   <>
<Canvas
  camera={{ position: [4, 2, 6], fov: 50, near: 0.1, far: 100 }}
>
  <ambientLight intensity={1.5} />
  <OrbitControls
    enableDamping
    
  />
  <Experience />
</Canvas>

    

   </>
  );
}
