<!-- Keep the existing README intentionally; a small demo scaffolding has been added alongside it. -->
// CuteHorseGame - Single-file example + implementation plan
// Language: English
// Description: This document outlines the full architecture and sample implementation for a React-based web game featuring a 'cute horse character + house background' system.
// All assets (sprites, Lottie files, SVGs) are placeholders.

/*
Overview
- Horse
  - Species: 30 types
  - Age: 'adult' | 'foal'
  - States: hunger, sleepy, dizzy, bored, hurt (0–100 or enum)
  - Animations: idle, walk, aegyo (cute gesture), sleep, dizzy, hurt, eat
  - Data model: each horse has id, typeId, age, stats, currentAnimation
  - Visuals: sprite sheet or Lottie (recommended to separate body, eyes, tail)

- House
  - Styles: 20 variations (house-01 ~ house-20)
  - Mode: single | pair (one or two horses)
  - Background effects: lighting, weather, simple particles
  - Feed/water troughs: fill level (0..1) -> shown via SVG mask or CSS height

- Tech stack & libraries
  - React (v18+)
  - TailwindCSS (for fast UI composition)
  - framer-motion or GSAP (for animations)
  - lottie-web (optional for complex motion)
  - zustand or useReducer (global state management)
  - localStorage / IndexedDB (persistence)

- Performance tips
  - Use sprite sheets or SVG symbols to minimize image requests
  - Lazy-load only visible horses/houses
  - Use requestAnimationFrame loops or framer-motion for smooth motion

Data Schema (TypeScript-style)

interface Horse {
  id: string; // uuid
  typeId: number; // 1..30
  age: 'adult' | 'foal';
  stats: {
    hunger: number; // 0..100
    sleepy: number; // 0..100
    dizzy: number; // 0..100
    bored: number; // 0..100
    hurt: number; // 0..100
  };
  animation: string; // 'idle' | 'aegyo' | 'eat' | ...
  lastUpdated: number; // timestamp
}

interface House {
  id: string;
  styleId: number; // 1..20
  mode: 'single' | 'pair';
  foodLevel: number; // 0..1
  waterLevel: number; // 0..1
}

Architecture
- /src
  - /assets
    - /horses (horse-01-adult.png, horse-01-foal.png ...)
    - /houses (house-01.svg ...)
  - /components
    - Horse.jsx
    - House.jsx
    - Trough.jsx
    - HUD.jsx
  - /state
    - store.js (zustand or reducer)
  - App.jsx

Animation Strategy
1) Animation complexity levels
   - Simple: CSS keyframes + sprite sheet
   - Medium: framer-motion for partial body motion (eyes blink, tail wag)
   - Advanced: Spine or Lottie for joint-based natural movement

2) Implementing 'aegyo' (cute gesture)
   - Short triggered animation (0.8–1.2s): tilting head, enlarging eyes, raising hoof
   - Priority: aegyo > eat > idle. When aegyo triggers, other animations pause.
   - Triggered by user tap/click or probabilistic timer.

State Machine (simplified)
- State storage: Horse.stats
- Periodic updates (timer)
  - Every minute: hunger += 2, sleepy += 1, bored += 1
  - When fed: hunger -= 30, waterLevel -= 0.2

- Visual priority by state
  1) hurt → red marks or sad animation
  2) dizzy → swirl icon, rolling eyes
  3) sleepy → closing eyes + zzz
  4) hunger → begging pose
  5) bored → shaking or slow sway

Example React Implementation (App + Horse + House)

import React, {useState, useEffect} from 'react';

export default function App(){
  const [horse, setHorse] = useState({
    id: 'h1',
    typeId: 1,
    age: 'adult',
    stats: {hunger:40, sleepy:10, dizzy:0, bored:20, hurt:0},
    animation: 'idle',
  });

  const [house, setHouse] = useState({styleId:1, mode:'single', foodLevel:0.6, waterLevel:0.4});

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
      }));
    }, 60000);
    return ()=> clearInterval(iv);
  },[]);

  function feed(){
    setHouse(hs => ({...hs, foodLevel: Math.max(0, hs.foodLevel - 0.2)}));
    setHorse(h => ({...h, stats:{...h.stats, hunger: Math.max(0, h.stats.hunger - 30)}, animation: 'eat'}));
    setTimeout(()=> setHorse(h => ({...h, animation:'idle'})), 1200);
  }

  function makeAegyo(){
    setHorse(h => ({...h, animation:'aegyo'}));
    setTimeout(()=> setHorse(h => ({...h, animation:'idle'})), 1000);
  }

  return (
    <div className="w-screen h-screen bg-gradient-to-b from-sky-200 to-green-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-white/40 rounded-2xl p-6 shadow-lg">
          <House styleId={house.styleId} mode={house.mode} foodLevel={house.foodLevel} waterLevel={house.waterLevel} />
          <div className="absolute left-8 bottom-12">
            <Horse horse={horse} />
          </div>
          <div className="mt-4 flex gap-2">
            <button className="px-3 py-1 bg-indigo-500 text-white rounded" onClick={feed}>Feed</button>
            <button className="px-3 py-1 bg-pink-400 text-white rounded" onClick={makeAegyo}>Aegyo</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Horse({horse}){
  const {typeId, age, animation, stats} = horse;
  const dominant = Object.entries(stats).sort((a,b)=> b[1]-a[1])[0];

  return (
    <div className="w-48 h-48 relative">
      <div className={`absolute inset-0 flex items-end justify-center transform ${animation==='aegyo'? 'animate-bounce-fast' : ''}`}>
        <div className="w-36 h-36 bg-[url('/assets/horses/horse-01-adult.png')] bg-contain bg-no-repeat" />
      </div>
      <div className="absolute top-0 right-0 p-1 text-xs bg-white/60 rounded">{age}</div>
      <div className="absolute -top-4 left-0">
        <StateBadges dominant={dominant} />
      </div>
    </div>
  );
}

function StateBadges({dominant}){
  const [key, value] = dominant || [];
  if(!key) return null;
  const labelMap = {hunger:'Hungry', sleepy:'Sleepy', dizzy:'Dizzy', bored:'Bored', hurt:'Hurt'};
  return (
    <div className="flex gap-1 items-center">
      <div className="text-sm bg-yellow-200 px-2 py-1 rounded shadow">{labelMap[key]} {Math.round(value)}</div>
    </div>
  );
}

function House({styleId, mode, foodLevel, waterLevel}){
  return (
    <div className={`w-full h-64 rounded-xl p-6 relative bg-[url('/assets/houses/house-${String(styleId).padStart(2,'0')}.svg')] bg-contain bg-right`}>
      <div className="absolute left-6 bottom-6 w-28">
        <Trough label="Feed" level={foodLevel} />
      </div>
      <div className="absolute right-6 bottom-6 w-28">
        <Trough label="Water" level={waterLevel} />
      </div>
      {mode === 'pair' && <div className="absolute left-20 bottom-10 text-sm">Two horses</div>}
    </div>
  );
}

function Trough({label, level}){
  return (
    <div className="bg-white/70 p-2 rounded shadow">
      <div className="text-xs mb-1">{label}</div>
      <div className="w-full h-20 bg-gray-200 rounded overflow-hidden">
        <div style={{height: `${Math.max(0, Math.min(1, level))*100}%`}} className="origin-bottom transition-[height] duration-500 ease-in-out bg-blue-400" />
      </div>
    </div>
  );
}

/*
Additional Implementation Notes
- Assets: prepare 3–6 animation frames or Lottie JSONs per horse type and age.
- If you layer horse animations (head/body/eyes/tail), you can mix and match expressions.
- Display states via HUD, icon bubbles above the horse, and trough fill levels.
- Save immediately to localStorage; restore using timestamps.
- For multiple houses/horses, render only visible ones to save performance.
- Accessibility: add speed controls and ARIA labels.

Prototyping suggestions
1) Draw quick SVG mockups (or export from Figma)
2) Test simple motion with CSS animations
3) Use framer-motion or Lottie for smoother animation when ready
*/
