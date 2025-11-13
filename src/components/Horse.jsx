import React from 'react'
import { motion } from 'framer-motion'
import { useAssets } from '../context/AssetContext'

export default function Horse({horse}){
  const {age, animation, stats, typeId} = horse
  const { get } = useAssets()
  // try common asset keys: nice default is `cute_horse (N)` in the manifest
  const assetKey1 = `cute_horse (${typeId})`
  const altKey = `horse-${String(typeId).padStart(2,'0')}-${age}`
  const img = get('horses', assetKey1) || get('horses', altKey)
  const dominant = Object.entries(stats).sort((a,b)=> b[1]-a[1])[0]
  const [key, value] = dominant || []

  const variants = {
    idle: { y: 0, rotate: 0, scale: 1 },
    aegyo: { y: -10, rotate: [0, -8, 8, 0], scale: [1, 1.06, 1.04, 1] }
  }

  return (
    <div className="w-44">
      <motion.div
        className="inline-block"
        animate={animation === 'aegyo' ? 'aegyo' : 'idle'}
        variants={variants}
        transition={{ duration: 0.9, times: [0,0.35,0.7,1] }}
        aria-hidden
      >
        {img ? (
          <img src={img} alt={`horse-${typeId}`} className="block w-44 h-36 object-contain" />
        ) : (
          <svg width="180" height="160" viewBox="0 0 180 160" xmlns="http://www.w3.org/2000/svg" className="block">
            <g fill="#8b5e3c">
              <ellipse cx="90" cy="100" rx="56" ry="32" />
              <rect x="30" y="60" width="110" height="40" rx="20" />
              <circle cx="120" cy="60" r="20" fill="#6b4a33" />
            </g>
            <circle cx="128" cy="54" r="3" fill="#000" />
          </svg>
        )}
      </motion.div>

      <div className="mt-2 text-xs text-gray-700">
        <div className="font-medium">{age}</div>
        {key && <div className="inline-block mt-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-[11px]">{key}: {Math.round(value)}</div>}
      </div>
    </div>
  )
}
