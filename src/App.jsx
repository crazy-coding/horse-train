import React, { useEffect, useState } from 'react'
import { useSound } from './context/SoundContext'
import Horse from './components/Horse'
import House from './components/House'

export default function App(){
  const [horse, setHorse] = useState({
    id: 'h1',
    typeId: 1,
    age: 'adult',
    stats: {hunger:40, sleepy:10, dizzy:0, bored:20, hurt:0},
    animation: 'idle',
  })

  const [house, setHouse] = useState({styleId:1, mode:'single', foodLevel:0.6, waterLevel:0.4})

  useEffect(()=>{
    const iv = setInterval(()=>{
      setHorse(h => ({
        ...h,
        stats: {
          ...h.stats,
          hunger: Math.min(100, h.stats.hunger + 1),
          sleepy: Math.min(100, h.stats.sleepy + 0.4),
          bored: Math.min(100, h.stats.bored + 0.5)
        }
      }))
    }, 60000)
    return ()=> clearInterval(iv)
  },[])

  const { playNamedSound } = useSound()

  function feed(){
    setHouse(hs => ({...hs, foodLevel: Math.max(0, hs.foodLevel - 0.2)}))
    setHorse(h => ({...h, stats:{...h.stats, hunger: Math.max(0, h.stats.hunger - 30)}, animation: 'eat'}))
    playNamedSound('eating')
    setTimeout(()=> setHorse(h => ({...h, animation:'idle'})), 1200)
  }

  function makeAegyo(){
    setHorse(h => ({...h, animation:'aegyo'}))
    playNamedSound('aegyo')
    setTimeout(()=> setHorse(h => ({...h, animation:'idle'})), 1000)
  }

  const { muted, toggleMute } = useSound()

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cute Horse Game — Demo</h1>
          <p className="text-sm text-gray-600">Simple prototype based on the README design.</p>
        </div>
        <div>
          <button onClick={toggleMute} className="px-3 py-1 bg-gray-100 rounded text-sm">
            {muted ? 'Unmute' : 'Mute'}
          </button>
        </div>
      </header>

      <main className="space-y-4">
        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
          <House
            styleId={house.styleId}
            mode={house.mode}
            foodLevel={house.foodLevel}
            waterLevel={house.waterLevel}
            onFillFeed={() => {
              setHouse(hs => ({...hs, foodLevel: Math.min(1, hs.foodLevel + 0.3)}))
              playNamedSound('feed')
            }}
            onFillWater={() => {
              setHouse(hs => ({...hs, waterLevel: Math.min(1, hs.waterLevel + 0.3)}))
              playNamedSound('water-fill')
            }}
          />
          {/* Horse positioned in front of house */}
          <div className="absolute left-8 bottom-0 z-20">
            <Horse horse={horse} />
          </div>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded font-medium hover:bg-indigo-700 transition" onClick={feed}>Feed</button>
          <button className="px-4 py-2 bg-pink-500 text-white rounded font-medium hover:bg-pink-600 transition" onClick={makeAegyo}>Aegyo</button>
        </div>
      </main>

      <footer className="mt-6 text-xs text-gray-500">Built: lightweight demo with assets</footer>

      <section className="mt-6 p-4 bg-white rounded shadow">
        <h2 className="text-sm font-semibold mb-2">Horse statistics</h2>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
          <div>Hunger: <span className="font-medium">{horse.stats.hunger}</span></div>
          <div>Sleepy: <span className="font-medium">{horse.stats.sleepy.toFixed(1)}</span></div>
          <div>Dizzy: <span className="font-medium">{horse.stats.dizzy}</span></div>
          <div>Bored: <span className="font-medium">{horse.stats.bored}</span></div>
          <div>Hurt: <span className="font-medium">{horse.stats.hurt}</span></div>
          <div>Animation: <span className="font-medium">{horse.animation}</span></div>
        </div>
      </section>
    </div>
  )
}
