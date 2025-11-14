import React from 'react'
import { Canvas } from '@react-three/fiber'
import Horse3D from './Horse3D'

export default function HorseCanvas({ animation = 'idle' }) {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [0, 1.5, 3], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={['#f0f7fb']} />
        <Horse3D animation={animation} />
      </Canvas>
    </div>
  )
}
