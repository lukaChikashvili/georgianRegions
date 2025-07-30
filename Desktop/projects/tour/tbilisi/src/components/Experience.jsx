"use client"
import React, { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { vertex } from '@/shaders/vertex'
import { fragment } from '@/shaders/fragment'
import { Sky, Stars, useGLTF } from '@react-three/drei'

const getWaveElevation = (x, z, time, frequency, elevation) => {
  return (
    Math.sin(x * frequency.x + time) *
    Math.sin(z * frequency.y + time) *
    elevation
  );
};

const Experience = () => {
  
  //  models
  const boat = useGLTF('./wooden_boat.glb');

  const boatGroup = useRef();

  useFrame((state) => {
    const boatObj = boatGroup.current;
  
    if (boatObj) {
      const time = uniforms.current.uTime.value;
      const freq = uniforms.current.uBigWavesFrequency.value;
      const elev = uniforms.current.uBigWavesElevation.value;
  
      
      const x = boatObj.position.x;
      const z = boatObj.position.z;
  
      
      const y = getWaveElevation(x, z, time, freq, elev);
  
     
      boatObj.position.y = y;
  

      const dx = 0.1;
      const dz = 0.1;
      const heightX1 = getWaveElevation(x + dx, z, time, freq, elev);
      const heightX2 = getWaveElevation(x - dx, z, time, freq, elev);
      const heightZ1 = getWaveElevation(x, z + dz, time, freq, elev);
      const heightZ2 = getWaveElevation(x, z - dz, time, freq, elev);
  
      const slopeX = (heightX1 - heightX2) / (2 * dx);
      const slopeZ = (heightZ1 - heightZ2) / (2 * dz);
  
      boatObj.rotation.x = -slopeZ * 0.5;
      boatObj.rotation.z = slopeX * 0.5;
    }
  });

  let gui;

  const debugObject = {};

  debugObject.depthColor = '#0a2a4d';
  debugObject.surfaceColor = '#1ca3ec';


  const uniforms = useRef({
    uTime: {value: 0},
    uBigWavesElevation: { value: 0.15 },
    uBigWavesFrequency: { value: new THREE.Vector2(1.75, 1.1) },
    uDepthColor: { value: new THREE.Color(debugObject.depthColor)},
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor)},
    uColorOffset: { value: 0.12},
    uColorMultiplier: { value: 5}
  });

  useFrame(() => {
     uniforms.current.uTime.value += 0.0025;
  })


  const materialRef = useRef()

  const initGUI = async () => {
    if (!gui) {
      const dat = await import('dat.gui')
      gui = new dat.GUI()

      gui
        .add(uniforms.current.uBigWavesElevation, 'value', 0, 1, 0.01)
        .name('Big Waves Elevation')

      gui
        .add(uniforms.current.uBigWavesFrequency.value, 'x', 0, 10, 0.01)
        .name('Big Waves Frequency X')

      gui
        .add(uniforms.current.uBigWavesFrequency.value, 'y', 0, 10, 0.01)
        .name('Big Waves Frequency Y')

        gui.addColor(debugObject, 'depthColor').name('depthColor').onChange(() => {uniforms.current.uDepthColor.value.set(debugObject.depthColor)});
        gui.addColor(debugObject, 'surfaceColor').name('surfaceColor').onChange(() => {uniforms.current.uSurfaceColor.value.set(debugObject.surfaceColor)});

        gui
        .add(uniforms.current.uColorOffset, 'value', 0, 10, 0.01)
        .name('color offset');
      
      gui
        .add(uniforms.current.uColorMultiplier, 'value', 0, 10, 0.01)
        .name('color multiplier');
    }
  }

  useEffect(() => {
    initGUI()

    return () => {
      if (gui) {
        gui.destroy()
        gui = null
      }
    }
  }, []);
  

  return (
    <>
  
   <Sky  distance={45000}
  sunPosition={[0, 0, -10]} 
  inclination={0.55} 
  azimuth={0.25} 
  mieCoefficient={0.005}
  mieDirectionalG={0.8}
  rayleigh={1.2}  />

{/* sea  */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 20,  500, 500]} />
      <shaderMaterial
        ref = {materialRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        side={THREE.DoubleSide}
        uniforms={uniforms.current}
      />
    </mesh>

    <group ref={boatGroup} position={[0, 4, 0]}>
  {/* Boat model */}
  <primitive object={boat.scene} />

  {/* Pole */}
  <mesh position={[0.5, 0.3, 0]} >
    <cylinderGeometry args={[0.005, 0.005, 1]}  />
    <meshBasicMaterial color="black"  />
  </mesh>

  {/* Flag */}
  <mesh position={[0.74, 0.7, 0]}>
    <planeGeometry args={[0.5, 0.2, 100, 100]} />
    <meshBasicMaterial color="red" side = {THREE.DoubleSide}/>
  </mesh>
</group>
    
    </>
  )
}

export default Experience
