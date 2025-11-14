import React from 'react'
import { motion } from 'framer-motion'

export default function HorseEyes({ animation, typeId }) {
  const variants = {
    idle: { scaleY: 1 },
    blink: { scaleY: [1, 0.15, 1] },
    headTilt: { scaleY: 1 },
    closeEyes: { scaleY: [1, 0.1, 0.1, 1] },
    hungry: { scaleY: [0.8, 0.7, 0.75, 0.7] },
    hurt: { scaleY: [1, 0.5, 1, 0.5, 1, 1] },
    cute: { scaleY: [1, 1.1, 1.05, 1.1, 1] },
    brushed: { scaleY: 1 },
    eat: { scaleY: [1, 0.9, 1] },
    aegyo: { scaleY: [1, 0.9, 1, 1] }
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
      transformOrigin="128 54"
    >
      {/* Main eye */}
      <circle cx="128" cy="54" r="4" fill="#000" />
      {/* Eye shine */}
      <circle cx="130" cy="52" r="1.5" fill="#fff" opacity="0.8" />
    </motion.g>
  )
}
