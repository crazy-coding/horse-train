import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useSound } from '../context/SoundContext'
import { useAssets } from '../context/AssetContext'

export default function Trough({label, level, onFill, type, upgradeLevel}){
  const resolvedType = type || String(label || '').toLowerCase()
  const pct = Math.max(0, Math.min(1, level)) * 100
  const [pressed, setPressed] = useState(false)
  const [showFull, setShowFull] = useState(false)
  const prevLevel = useRef(level)

  const { playChime, playNamedSound } = useSound()
  const { get } = useAssets()

  // Get trough image based on upgrade level
  let troughImg = null
  const imgLevel = upgradeLevel || 1
  if(resolvedType === 'food' || resolvedType === 'feed'){
    troughImg = get('food-trough', `level-${imgLevel}`)
  } else if(resolvedType === 'water'){
    troughImg = get('water-trough', `level-${imgLevel}`)
  }

  function handleClick(){
    if(typeof onFill === 'function') onFill()
    // play fill sound
    playNamedSound(resolvedType === 'food' || resolvedType === 'feed' ? 'feed' : 'water-fill')
    setPressed(true)
    setTimeout(()=> setPressed(false), 220)
  }

  useEffect(()=>{
    // detect transition to full
    if(prevLevel.current < 1 && level >= 1){
      setShowFull(true)
      // play completion sound
      const soundName = resolvedType === 'food' || resolvedType === 'feed' ? 'eating' : 'water-splash'
      try{ playNamedSound && playNamedSound(soundName) }catch(e){ playChime() }
      const t = setTimeout(()=> setShowFull(false), 900)
      return ()=> clearTimeout(t)
    }
    prevLevel.current = level
  }, [level, playNamedSound, playChime, resolvedType])

  

  const confetti = resolvedType === 'food' ? [
    { x: 6, y: 6, c: '#F97316' },
    { x: 28, y: 10, c: '#F43F5E' },
    { x: 10, y: 26, c: '#F59E0B' },
    { x: 34, y: 30, c: '#D97706' },
  ] : [
    { x: 6, y: 6, c: '#60A5FA' },
    { x: 28, y: 10, c: '#3B82F6' },
    { x: 10, y: 26, c: '#38BDF8' },
    { x: 34, y: 30, c: '#06B6D4' },
  ]

  const status = level >= 1 ? 'Full' : level > 0.6 ? 'Good' : level > 0.25 ? 'Low' : 'Empty'
  const barClass = resolvedType === 'food' || resolvedType === 'feed' ? 'bg-amber-400' : 'bg-blue-400'
  const badgeClass = status === 'Full' ? 'bg-green-100 text-green-800' : status === 'Low' ? 'bg-yellow-100 text-yellow-800' : status === 'Empty' ? 'bg-red-100 text-red-800' : 'bg-sky-100 text-sky-800'

  return (
    <motion.div
      className="relative w-24 p-2 rounded shadow-sm border cursor-pointer overflow-hidden"
      onClick={handleClick}
      whileTap={{ scale: 0.96 }}
      animate={pressed ? { scale: 1.04 } : { scale: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 20 }}
      role="button"
      tabIndex={0}
      onKeyDown={(e)=> { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick() } }}
      style={{
        backgroundImage: troughImg ? `url(${troughImg})` : 'none',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center top',
        backgroundColor: 'white'
      }}
    >
      {/* Content overlay */}
      <div className="relative z-10">
        <div className="text-xs text-gray-600 mb-12 flex items-center justify-between">
          <div className="text-[11px] font-semibold">{label}</div>
          <div className={`text-[10px] px-1.5 py-0.5 rounded ${badgeClass}`}>{status}</div>
        </div>
        <div className="w-full h-8 bg-gray-200 rounded overflow-hidden flex items-end relative border border-gray-300">
          <motion.div
            className={`w-full ${barClass}`}
            style={{height: `${pct}%`}}
            animate={{ height: `${pct}%` }}
            transition={{ ease: 'easeInOut', duration: 0.35 }}
          />
          {showFull && (
            <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
              <div className="relative w-full h-full">
                {/* simple confetti circles */}
                {confetti.map((f, i)=> (
                  <motion.span key={i}
                    initial={{ opacity: 0, y: 0, scale: 0.6 }}
                    animate={{ opacity: 1, y: -18 - (i*6), scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    style={{ left: f.x, top: f.y, background: f.c }}
                    className="absolute rounded-full w-2.5 h-2.5"
                  
                    >
                    </motion.span>
                ))}
                {/* glow pulse */}
                <motion.div
                  className="absolute inset-0 rounded"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.12, scale: [0.98,1.02,1] }}
                  transition={{ duration: 0.9 }}
                  style={{ background: resolvedType === 'food' ? 'radial-gradient(circle at 50% 20%, rgba(245,158,11,0.14), transparent 40%)' : 'radial-gradient(circle at 50% 20%, rgba(59,130,246,0.12), transparent 40%)' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
