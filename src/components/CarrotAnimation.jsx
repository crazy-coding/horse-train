import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CarrotAnimation({ isAnimating, onAnimationComplete }) {
  useEffect(() => {
    if (isAnimating) {
      // Set a timer to call onAnimationComplete after animation finishes
      const timer = setTimeout(() => {
        onAnimationComplete()
      }, 1200) // Match the animation duration
      
      return () => clearTimeout(timer)
    }
  }, [isAnimating, onAnimationComplete])

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          key={`carrot-${Date.now()}`}
          initial={{ 
            x: -200, 
            y: 500, 
            opacity: 1, 
            scale: 1,
            rotate: 0
          }}
          animate={{ 
            x: 450, 
            y: -100, 
            opacity: 0, 
            scale: 0.3,
            rotate: 360
          }}
          exit={{ 
            opacity: 0,
            scale: 0
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
          }}
          className="fixed pointer-events-none text-4xl"
          style={{
            zIndex: 9999,
            left: 0,
            bottom: 0,
          }}
        >
          🥕
        </motion.div>
      )}
    </AnimatePresence>
  )
}
