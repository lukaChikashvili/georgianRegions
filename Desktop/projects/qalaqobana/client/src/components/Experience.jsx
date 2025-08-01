import { grassFragment } from '@/shaders/grass/fragment';
import { grassVertex } from '@/shaders/grass/vertex';
import { OrbitControls, Sky, Stars, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import Rope from './Rope';





const Experience = () => {
    
  const lampRef = useRef();



    
    // model
    const tower = useGLTF('./tower.glb');
    const lamp = useGLTF('./lamp.glb');

  




    useFrame((state) => {
      const elapsed = state.clock.getElapsedTime();

      grassUniforms.current.uTime.value += 0.025;

      if (lampRef.current) {
        lampRef.current.rotation.z = Math.sin(elapsed * 1.5) * 0.2; 
        lampRef.current.rotation.x = Math.cos(elapsed * 1.5) * 0.03; 
      }
    });
  

    const shaderRef = useRef();
    
    const grassUniforms = useRef({
        uTime: { value: 0},
        uSeason: { value: 2.3}
    });

    

    // clone towers
    const towerClones = useMemo(() => {
      const instances = [];
      const count = 20; 
      for (let i = 0; i < count; i++) {
        const x = THREE.MathUtils.randFloatSpread(200) ;
        const z = THREE.MathUtils.randFloatSpread(200);
        const y = -4 ;
        const scale = 2.4;
        instances.push({ position: [x, y, z], scale });

      }
      return instances
    }, []);

   





  return (
    <>
    <OrbitControls makeDefault/>
       {/* field  */}
       <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeGeometry args={[500, 600, 800, 800]} />
        <shaderMaterial
          ref={shaderRef}
          vertexShader={grassVertex}
          fragmentShader={grassFragment}
          uniforms={grassUniforms.current}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sky  */}

      <Sky
        distance={45000}
      sunPosition={[1, 1, 1]}
        inclination={0.49}
        azimuth={0.25}
        mieCoefficient={0.05}
        mieDirectionalG={0.4}
        rayleigh={3}
        turbidity={50}
        
      />

      {/* Stars  */}
       
      <Stars
  radius={100}        
  depth={50}          
  count={10000}      
  factor={4}          
  saturation={0}      
  fade                
  speed={0.01}        
/>

      {towerClones.map((data, index) => (
        <primitive
          key={index}
          object={tower.scene.clone()}
          position={data.position}
          scale={data.scale}
        />
      ))}

  {/* lamp  */}
  
    <primitive object={lamp.scene} ref ={lampRef}  scale = {2} position = {[-10, 18, 40]} />
    <Rope />

  {/* board  */}
   <mesh position = {[3, 18, 40]} >
     <boxGeometry args = {[5, 3, 0.3]} />
    
   </mesh>


       
    </>
  )
}

export default Experience
