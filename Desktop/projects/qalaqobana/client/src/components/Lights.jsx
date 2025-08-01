import { useFrame } from '@react-three/fiber'
import React, { useRef } from 'react'
import * as THREE from 'three'

const Lights = () => {
  const sun = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const radius = 20;
    sun.current.position.set(
      Math.sin(t * 0.1) * radius,
      Math.cos(t * 0.1) * radius,
      10
    );

    sun.current.lookAt(0, 0, 0);
  })
  return (
    <>
       <ambientLight intensity={1}/>
       <directionalLight
        ref={sun}
        castShadow
        intensity={10}
        color = "#E67514"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
    </>
  )
}

export default Lights
