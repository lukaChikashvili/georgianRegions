import { grassFragment } from '@/shaders/grass/fragment';
import { grassVertex } from '@/shaders/grass/vertex';
import { OrbitControls, Sky, Stars, useGLTF, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import Rope from './Rope';
import { clothVertex } from '@/shaders/cloth/vertex';
import { clothFragment } from '@/shaders/cloth/fragment';





const Experience = () => {
    
  const lampRef = useRef();



    
    // model
    const tower = useGLTF('./tower.glb');
    const lamp = useGLTF('./lamp.glb');
    const board = useGLTF('./board.glb');

    const boardTexture = useTexture('./menu.png');


  

  
    // textures
    const clothTexture = useTexture('./texture.webp');

    // cloth uniforms
    const clothUniforms = useRef({
      uTime: {value: 0},
       uAmplitude: { value: 0.25},
       uWaveLength: { value: 2.0},
       uTexture: { value: clothTexture}
    });

  // grass
    const grassUniforms = useRef({
      uTime: { value: 0},
      uSeason: { value: 1.3}
  });





    useFrame((state) => {
      const elapsed = state.clock.getElapsedTime();

      grassUniforms.current.uTime.value += 0.025;
     
      clothUniforms.current.uTime.value += 0.025;


      if (lampRef.current) {
        lampRef.current.rotation.z = Math.sin(elapsed * 1.5) * 0.2; 
        lampRef.current.rotation.x = Math.cos(elapsed * 1.5) * 0.03; 
      }
    });
  

    const shaderRef = useRef();
  


    

    // clone towers
    const towerClones = useMemo(() => {
      const instances = [];
      const count = 10; 
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

  {/* Lamp  */}
  
    <primitive object={lamp.scene} ref ={lampRef}  scale = {2} position = {[-10, 18, 40]} />
    <Rope />

  {/* Cloth  */}
   <mesh position = {[3, 18, 40]} >
   <planeGeometry args={[2, 3, 100, 500]} />
     <shaderMaterial vertexShader={clothVertex} 
     fragmentShader={clothFragment} uniforms={clothUniforms.current} />
   </mesh>


 {/* Board  */}
       
       <primitive position = {[23, 5, 30]} rotation = {[0, -4, 0]}
       object={board.scene} scale = {12} />


    </>
  )
}

export default Experience
