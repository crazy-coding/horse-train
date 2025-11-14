import React from 'react'
import { motion } from 'framer-motion'
import { useAssets } from '../context/AssetContext'
import HorseHead from './HorseHead'
import HorseBody from './HorseBody'
import HorseEyes from './HorseEyes'

export default function Horse({horse}){
  const {age, animation, stats, typeId} = horse
  const { get } = useAssets()
  // try common asset keys: nice default is `cute_horse (N)` in the manifest
  const assetKey1 = `cute_horse (${typeId})`
  const altKey = `horse-${String(typeId).padStart(2,'0')}-${age}`
  const img = get('horses', assetKey1) || get('horses', altKey)
  const dominant = Object.entries(stats).sort((a,b)=> b[1]-a[1])[0]
  const [key, value] = dominant || []

  // If we have an image asset, use it (fallback for custom images)
  if (img) {
    const containerVariants = {
      idle: { y: 0 },
      eat: { y: [0, -5, 0] },
      blink: { y: 0 },
      headTilt: { y: [0, -3, 2, 0] },
      closeEyes: { y: 0 },
      hungry: { y: [0, 10, 5, 10], scale: [1, 0.95, 0.93, 0.95] },
      hurt: { x: [0, -8, 8, -8, 8, 0], y: [0, 5, 0, 5, 0, 0] },
      cute: { y: [0, -15, -10, -15, 0], scale: [1, 1.08, 1.05, 1.08, 1] },
      brushed: { y: [0, -8, 0], scale: [1, 1.1, 1] },
      aegyo: { y: -10, scale: [1, 1.06, 1.04, 1] }
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
      <div className="w-44">
        <motion.div
          className="inline-block"
          animate={animation}
          variants={containerVariants}
          transition={{ 
            duration: getTransitionDuration(), 
            repeat: animation === 'hungry' ? Infinity : 0,
            repeatType: animation === 'hungry' ? 'mirror' : 'loop'
          }}
          aria-hidden
        >
          <img src={img} alt={`horse-${typeId}`} className="block w-44 h-36 object-contain" />
        </motion.div>

        <div className="mt-2 text-xs text-gray-700">
          <div className="font-medium">{age}</div>
          {key && <div className="inline-block mt-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-[11px]">{key}: {Math.round(value)}</div>}
        </div>
      </div>
    )
  }

  // SVG fallback with separated body, head, and eyes components
  return (
    <div className="w-44">
      <svg width="180" height="160" viewBox="0 0 180 160" xmlns="http://www.w3.org/2000/svg" className="block">
        {/* Body component */}
        <HorseBody animation={animation} typeId={typeId} />
        
        {/* Head component */}
        <HorseHead animation={animation} typeId={typeId} />
        
        {/* Eyes component */}
        <HorseEyes animation={animation} typeId={typeId} />
      </svg>

      <div className="mt-2 text-xs text-gray-700">
        <div className="font-medium">{age}</div>
        {key && <div className="inline-block mt-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-[11px]">{key}: {Math.round(value)}</div>}
      </div>
    </div>
  )
}
