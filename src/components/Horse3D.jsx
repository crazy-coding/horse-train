import React, { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useAnimations, useGLTF, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

/**
 * Horse3D Component
 * 
 * Currently uses procedural geometry (boxes, spheres, cylinders).
 * 
 * To upgrade to a GLB model:
 * 1. Place your GLB file in public/assets/horse-model/horse.glb
 * 2. Uncomment the GLB loading code below (marked with GLBMODEL)
 * 3. The component will automatically use useAnimations() for clip playback
 * 
 * See 3D_HORSE_GUIDE.md for full instructions.
 */

export default function Horse3D({ animation = 'idle' }) {
  const groupRef = useRef()
  const headRef = useRef()
  const leftEyeRef = useRef()
  const rightEyeRef = useRef()
  const tailRef = useRef()
  const bodyRef = useRef()
  const { scene, camera } = useThree()
  const [animationState, setAnimationState] = useState('idle')

  useEffect(() => {
    setAnimationState(animation)
  }, [animation])

  useEffect(() => {
    if (camera) {
      camera.position.set(0, 1.5, 3)
      camera.lookAt(0, 1, 0)
    }
  }, [camera])

  // Apply animations based on animation state
  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    if (!headRef.current || !bodyRef.current) return

    switch (animationState) {
      case 'eat': {
        bodyRef.current.position.y = 1 + Math.sin(time * 4) * 0.1
        headRef.current.position.y = 1.3 + Math.sin(time * 4) * 0.08
        break
      }
      case 'blink': {
        const blink = Math.sin(time * 3) * 0.1
        if (leftEyeRef.current) leftEyeRef.current.scale.y = Math.max(0.2, 1 - Math.abs(blink))
        if (rightEyeRef.current) rightEyeRef.current.scale.y = Math.max(0.2, 1 - Math.abs(blink))
        break
      }
      case 'headTilt': {
        headRef.current.rotation.z = Math.sin(time * 1.5) * 0.3
        headRef.current.rotation.x = Math.cos(time * 1.5) * 0.2
        break
      }
      case 'closeEyes': {
        const closeProgress = Math.min(1, time * 2)
        if (leftEyeRef.current) leftEyeRef.current.scale.y = 1 - closeProgress * 0.8
        if (rightEyeRef.current) rightEyeRef.current.scale.y = 1 - closeProgress * 0.8
        break
      }
      case 'hungry': {
        bodyRef.current.position.y = 0.8 + Math.sin(time * 2) * 0.1
        bodyRef.current.scale.y = 0.9 + Math.sin(time * 2) * 0.05
        headRef.current.rotation.x = 0.3 + Math.sin(time * 2) * 0.1
        break
      }
      case 'hurt': {
        bodyRef.current.position.x = Math.sin(time * 8) * 0.1
        bodyRef.current.position.y = 1 + Math.sin(time * 8) * 0.1
        bodyRef.current.rotation.z = Math.sin(time * 8) * 0.1
        break
      }
      case 'cute': {
        bodyRef.current.position.y = 1 + Math.sin(time * 2) * 0.2
        headRef.current.rotation.z = Math.sin(time * 2) * 0.2
        bodyRef.current.scale.x = 1 + Math.sin(time * 2) * 0.05
        break
      }
      case 'brushed': {
        bodyRef.current.position.y = 1 + Math.sin(time * 1.5) * 0.1
        bodyRef.current.scale.y = 1 + Math.sin(time * 1.5) * 0.08
        headRef.current.rotation.z = Math.sin(time * 1.5) * 0.15
        break
      }
      case 'aegyo': {
        bodyRef.current.position.y = 1 - 0.15 + Math.sin(time * 2.5) * 0.1
        headRef.current.rotation.z = Math.sin(time * 2.5) * 0.2
        bodyRef.current.rotation.z = Math.sin(time * 2.5) * 0.05
        break
      }
      case 'idle':
      default: {
        bodyRef.current.position.y = 1 + Math.sin(time * 1) * 0.02
        headRef.current.rotation.z = 0
        headRef.current.rotation.x = 0
        if (tailRef.current) {
          tailRef.current.rotation.z = 0.2 + Math.sin(time * 1.5) * 0.1
        }
        break
      }
    }
  })

  return (
    <>
      <group ref={groupRef}>
        {/* Procedural Horse Body */}
        <mesh ref={bodyRef} position={[0, 1, 0]} scale={1}>
          <boxGeometry args={[0.8, 0.6, 1.5]} />
          <meshStandardMaterial color="#8b5e3c" />
        </mesh>

        {/* Head */}
        <mesh ref={headRef} position={[0, 1.3, 0.8]} scale={0.6}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#8b5e3c" />
        </mesh>

        {/* Neck */}
        <mesh position={[0, 1.2, 0.4]}>
          <cylinderGeometry args={[0.25, 0.35, 0.6, 16]} />
          <meshStandardMaterial color="#8b5e3c" />
        </mesh>

        {/* Snout */}
        <mesh position={[0, 1.2, 1.2]} scale={0.3}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#a67c52" />
        </mesh>

        {/* Eyes */}
        <mesh ref={leftEyeRef} position={[-0.15, 1.4, 1.0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#000" />
        </mesh>
        <mesh ref={rightEyeRef} position={[0.15, 1.4, 1.0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#000" />
        </mesh>

        {/* Ears */}
        <mesh position={[-0.25, 1.65, 0.8]} rotation={[0, 0, -0.3]}>
          <coneGeometry args={[0.15, 0.4, 8]} />
          <meshStandardMaterial color="#6b4a33" />
        </mesh>
        <mesh position={[0.25, 1.65, 0.8]} rotation={[0, 0, 0.3]}>
          <coneGeometry args={[0.15, 0.4, 8]} />
          <meshStandardMaterial color="#6b4a33" />
        </mesh>

        {/* Front Left Leg */}
        <mesh position={[-0.25, 0.3, 0.3]}>
          <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
          <meshStandardMaterial color="#6b4a33" />
        </mesh>

        {/* Front Right Leg */}
        <mesh position={[0.25, 0.3, 0.3]}>
          <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
          <meshStandardMaterial color="#6b4a33" />
        </mesh>

        {/* Back Left Leg */}
        <mesh position={[-0.25, 0.3, -0.3]}>
          <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
          <meshStandardMaterial color="#6b4a33" />
        </mesh>

        {/* Back Right Leg */}
        <mesh position={[0.25, 0.3, -0.3]}>
          <cylinderGeometry args={[0.1, 0.1, 0.8, 8]} />
          <meshStandardMaterial color="#6b4a33" />
        </mesh>

        {/* Tail */}
        <mesh ref={tailRef} position={[0, 1, -1]} rotation={[0, 0, 0.2]}>
          <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
          <meshStandardMaterial color="#5a3d28" />
        </mesh>
      </group>

      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, 5, 5]} intensity={0.4} />

      {/* Controls */}
      <OrbitControls
        autoRotate
        autoRotateSpeed={2}
        enableZoom={true}
        enablePan={true}
      />
    </>
  )
}
