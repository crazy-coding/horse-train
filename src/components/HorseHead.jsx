import React from 'react'
import { motion } from 'framer-motion'

export default function HorseHead({ animation, typeId }) {
  const variants = {
    idle: { rotate: 0, x: 0, y: 0 },
    blink: { rotate: 0, x: 0, y: 0 },
    headTilt: { rotate: [0, 15, -15, 0], y: [0, -5, 5, 0] },
    closeEyes: { rotate: 0, x: 0, y: 0 },
    hungry: { rotate: [0, -2, 2, -1], y: [0, 5, 3, 5] },
    hurt: { rotate: [0, -5, 5, -5, 5, 0], x: [0, -4, 4, -4, 4, 0], y: [0, 2, 0, 2, 0, 0] },
    cute: { rotate: [0, 8, -8, 8, 0], y: [0, -8, -5, -8, 0] },
    brushed: { rotate: [0, 12, -12, 0], y: [0, -5, 0] },
    eat: { rotate: 0, x: 0, y: [0, -3, 0] },
    aegyo: { rotate: [0, -8, 8, 0], y: [-5, -8, -5, -5] }
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
      transformOrigin="120 60"
    >
      {/* Head */}
      <rect x="30" y="60" width="110" height="40" rx="20" fill="#8b5e3c" />
      {/* Snout */}
      <circle cx="130" cy="78" r="12" fill="#a67c52" />
    </motion.g>
  )
}
