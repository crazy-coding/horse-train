import React, { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useAnimations, useGLTF, OrbitControls } from '@react-three/drei'

/**
 * TEMPLATE: Horse3D with GLB Model
 * 
 * This is a template showing how to implement GLB model loading.
 * Copy this code and replace the procedural Horse3D.jsx when ready.
 * 
 * Steps before using:
 * 1. Create a horse model in Blender
 * 2. Create animation clips: idle, eat, blink, headTilt, closeEyes, hungry, hurt, cute, brushed, aegyo
 * 3. Export as GLB format
 * 4. Place in public/assets/horse-model/horse.glb
 * 5. Replace Horse3D.jsx with this template
 */

export default function Horse3DGLBTemplate({ animation = 'idle' }) {
  const groupRef = useRef()
  const { camera } = useThree()

  // Load GLB model
  const { scene: modelScene, animations } = useGLTF('/assets/horse-model/horse.glb')
  
  // Get animation actions
  const { actions, mixer } = useAnimations(animations, groupRef)

  // Set camera position
  useEffect(() => {
    if (camera) {
      camera.position.set(0, 1.5, 3)
      camera.lookAt(0, 1, 0)
    }
  }, [camera])

  // Handle animation changes
  useEffect(() => {
    if (!actions || !actions[animation]) {
      console.warn(`Animation "${animation}" not found. Available animations:`, Object.keys(actions || {}))
      return
    }

    // Stop all animations
    Object.values(actions).forEach(action => {
      if (action) {
        action.fadeOut(0.2)
      }
    })

    // Play new animation
    const action = actions[animation]
    if (action) {
      action
        .reset()
        .fadeIn(0.3)
        .play()
    }
  }, [animation, actions])

  return (
    <>
      <group ref={groupRef}>
        <primitive object={modelScene} />
      </group>

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, 5, 5]} intensity={0.4} />

      {/* Interactive controls */}
      <OrbitControls
        autoRotate
        autoRotateSpeed={2}
        enableZoom={true}
        enablePan={true}
      />
    </>
  )
}

/**
 * USAGE NOTES:
 * 
 * Animation Naming:
 * - Animation clip names in Blender MUST match exactly:
 *   'idle', 'eat', 'blink', 'headTilt', 'closeEyes', 'hungry', 'hurt', 'cute', 'brushed', 'aegyo'
 * 
 * Blender Export:
 * 1. Select all actions: File > Export > glTF 2.0
 * 2. Check "Animation" in export options
 * 3. Check "Group by NLA Track" for cleaner animation names
 * 4. Export as .glb format
 * 
 * Troubleshooting:
 * - If animations don't play, check console for available animation names
 * - Use console.log(Object.keys(actions)) to debug
 * - Ensure animation clips are marked as "Action" in Blender NLA Editor
 * 
 * Performance:
 * - Optimize model before export (reduce vertices, use textures)
 * - Bake lighting if possible
 * - Use LOD for distant views if needed
 */
