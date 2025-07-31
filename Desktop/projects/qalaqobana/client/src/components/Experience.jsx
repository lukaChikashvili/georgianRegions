import { grassFragment } from '@/shaders/grass/fragment';
import { grassVertex } from '@/shaders/grass/vertex';
import { OrbitControls, Sky, Stars, useGLTF } from '@react-three/drei'
import React, { useRef } from 'react'
import * as THREE from 'three'

const Experience = () => {
    
    // model
    const tower = useGLTF('./tower.glb');

    const shaderRef = useRef();
    
    const grassUniforms = useRef({
        uTime: { value: 0}
    });




  return (
    <>
    <OrbitControls makeDefault/>
       {/* field  */}
       <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeGeometry args={[100, 100, 256, 256]} />
        <shaderMaterial
          ref={shaderRef}
          vertexShader={grassVertex}
          fragmentShader={grassFragment}
          uniforms={grassUniforms.current}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Sky  */}

      <Sky />

      {/* Stars  */}
       
       <Stars />

       <primitive object={tower.scene} position = {[0, -4, 0]} scale = {0.5} />
       
    </>
  )
}

export default Experience
