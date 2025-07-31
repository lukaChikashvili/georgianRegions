import { RopeCurve } from '@/rope';
import React, { useMemo } from 'react'


const Rope = () => {
  
    const ropeCurve = useMemo(() => {
        return new RopeCurve([-25, 5, 0], [25, 5, 0]);

    }, []);


  return (
    <>
    <mesh position={[0, 17.3, 40]} scale={0.6}>
      <tubeGeometry args={[ropeCurve, 64, 0.05, 8, false]} />
      <meshStandardMaterial color="white" /> 
    </mesh>
    </>
  )
}

export default Rope
