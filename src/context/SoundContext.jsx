import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'

const SoundContext = createContext(null)

export function SoundProvider({ children }){
  const [muted, setMuted] = useState(false)

  const toggleMute = useCallback(()=> setMuted(v => !v), [])

  const playChime = useCallback(()=>{
    if(muted) return
    try{
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if(!AudioCtx) return
      const ctx = new AudioCtx()
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.setValueAtTime(880, ctx.currentTime)
      g.gain.setValueAtTime(0, ctx.currentTime)
      o.connect(g)
      g.connect(ctx.destination)
      const now = ctx.currentTime
      g.gain.linearRampToValueAtTime(0.001, now + 0.001)
      g.gain.linearRampToValueAtTime(0.12, now + 0.02)
      o.start(now)
      o.frequency.setValueAtTime(880, now + 0)
      o.frequency.linearRampToValueAtTime(1320, now + 0.12)
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
      o.stop(now + 0.52)
      setTimeout(()=>{ try{ ctx.close() }catch(e){} }, 800)
    }catch(e){ /* ignore */ }
  }, [muted])

  const playAudioFile = useCallback((url)=>{
    if(muted) return
    try{
      const a = new Audio(url)
      a.play().catch(()=>{})
    }catch(e){}
  }, [muted])

  // load asset manifest (optional) so we can play named sounds if present
  const [assetManifest, setAssetManifest] = useState(null)
  useEffect(()=>{
    let mounted = true
    fetch('/assets/asset-manifest.json').then(r=>{
      if(!r.ok) throw new Error('no manifest')
      return r.json()
    }).then(json=>{
      if(mounted) setAssetManifest(json)
    }).catch(()=>{})
    return ()=> { mounted = false }
  }, [])

  const playNamedSound = useCallback((name)=>{
    if(muted) return
    try{
      const url = assetManifest && assetManifest.sounds && assetManifest.sounds[name]
      if(url){
        const a = new Audio(url)
        a.play().catch(()=>{})
        return
      }
    }catch(e){}
    // fallback to web-audio chime
    playChime()
  }, [muted, assetManifest, playChime])

  return (
    <SoundContext.Provider value={{ muted, toggleMute, playChime, playAudioFile, playNamedSound, assetManifest }}>
      {children}
    </SoundContext.Provider>
  )
}

export function useSound(){
  const ctx = useContext(SoundContext)
  if(!ctx) throw new Error('useSound must be used inside SoundProvider')
  return ctx
}

export default SoundContext
