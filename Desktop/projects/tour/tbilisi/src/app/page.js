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
    dampingFactor={0.05}
    maxPolarAngle={Math.PI / 2.1}
    minPolarAngle={Math.PI / 3}
    enablePan={false}
    rotateSpeed={0.6}
  />
  <Experience />
</Canvas>

    

   </>
  );
}
