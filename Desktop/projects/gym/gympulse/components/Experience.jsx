import { useGLTF } from '@react-three/drei'
import React, { useRef } from 'react'
import * as THREE from 'three'
import { grassVertex } from '../shaders/vertex';
import { grassFragment } from '../shaders/fragment';

const Experience = () => {
    //const model = useGLTF('./grave.glb');

    const uniforms = useRef({
      uTime: { value: 0 },
      uSeason: { value: 1.5 }
    });

  return (
   <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position = {[0, -10, 0]}>
      <planeGeometry args={[400, 700, 400, 400]} />
      <shaderMaterial
        vertexShader={grassVertex}
        fragmentShader={grassFragment}
        uniforms={uniforms.current}
        side={THREE.DoubleSide}
      />
    </mesh>
   </>
  )
}

export default Experience
