import React from 'react'
import { motion } from 'framer-motion'

export default function HorseBody({ animation, typeId }) {
  const variants = {
    idle: { y: 0, scale: 1, rotate: 0 },
    blink: { y: 0, scale: 1, rotate: 0 },
    headTilt: { y: [0, -2, 2, 0], scale: [1, 0.98, 0.98, 1] },
    closeEyes: { y: 0, scale: 1, rotate: 0 },
    hungry: { y: [0, 8, 5, 8], scale: [1, 0.93, 0.92, 0.93], rotate: [0, -1, 1, -1] },
    hurt: { x: [0, -6, 6, -6, 6, 0], y: [0, 3, 0, 3, 0, 0], scale: 1 },
    cute: { y: [0, -12, -8, -12, 0], scale: [1, 1.05, 1.03, 1.05, 1] },
    brushed: { y: [0, -6, 0], scale: [1, 1.08, 1], rotate: [0, 5, -5, 0] },
    eat: { y: [0, -4, 0], scale: [1, 1.01, 1] },
    aegyo: { y: [-8, -12, -8, -8], scale: [1, 1.04, 1.02, 1] }
  }

  const getTransitionDuration = () => {
    const durations = {
      idle: 0.3,
      eat: 0.8,
      blink: 0.4,
      headTilt: 1,
      closeEyes: 1.2,
      hungry: 1.5,
      hurt: 0.6,
      cute: 1,
      brushed: 0.9,
      aegyo: 0.9
    }
    return durations[animation] || 0.3
  }

  return (
    <motion.g
      animate={animation}
      variants={variants}
      transition={{ 
        duration: getTransitionDuration(),
        repeat: animation === 'hungry' ? Infinity : 0,
        repeatType: animation === 'hungry' ? 'mirror' : 'loop'
      }}
    >
      {/* Body */}
      <ellipse cx="90" cy="100" rx="56" ry="32" fill="#8b5e3c" />
      {/* Legs */}
      <rect x="50" y="125" width="12" height="25" rx="6" fill="#6b4a33" />
      <rect x="90" y="125" width="12" height="25" rx="6" fill="#6b4a33" />
      <rect x="130" y="125" width="12" height="25" rx="6" fill="#6b4a33" />
    </motion.g>
  )
}
