import { grassFragment } from '@/shaders/grass/fragment';
import { grassVertex } from '@/shaders/grass/vertex';
import { OrbitControls, Sky, Stars, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'




const Experience = () => {
    
    // model
    const tower = useGLTF('./tower.glb');

    const sunPosition = useRef(new THREE.Vector3(0, 1, 0))



    const [sunPosArray, setSunPosArray] = useState(sunPosition.current.toArray());

    useFrame((state) => {
      const elapsed = state.clock.getElapsedTime();
  
      const radius = 5;
      const speed = 0.025; 
      const angle = elapsed * speed;
  
      const x = Math.sin(angle) * radius;
      const y = Math.cos(angle) * radius * 0.5;
      const z = Math.cos(angle) * radius;
  
      sunPosition.current.set(x, y, z);
      grassUniforms.current.uTime.value += 0.025;
  
   
      setSunPosArray(sunPosition.current.toArray());
    });
  

    const shaderRef = useRef();
    
    const grassUniforms = useRef({
        uTime: { value: 0}
    });

    

    // clone towers
    const towerClones = useMemo(() => {
      const instances = [];
      const count = 12; 
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
        sunPosition={sunPosArray}
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


       
    </>
  )
}

export default Experience
