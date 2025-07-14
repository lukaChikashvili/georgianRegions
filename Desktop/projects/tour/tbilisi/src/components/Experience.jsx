
import React from 'react'
import { vertex } from '@/shaders/vertex'
import { fragment } from '@/shaders/fragment'
const Experience = () => {


  return (
    <>
  
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[5, 5]} />
       <shaderMaterial vertexShader={vertex} fragmentShader={fragment}/>
    </mesh>

    </>
  )
}

export default Experience
