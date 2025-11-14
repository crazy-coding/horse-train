<!-- Project README generated: full guide for 2D & 3D usage -->

# Cute Horse Game — README

This repository is a small demo/game showing a cute horse with a house and troughs. It supports both a 2D UI driven by Framer Motion and an optional 3D view powered by React Three Fiber (Three.js). This README covers getting started, development, 2D/3D usage, and how to swap in a GLB model with multiple animation clips.

---

## Table of contents

- Getting started
- Development (run / build)
- Project layout
- 2D (framer-motion) usage
- 3D (react-three-fiber) usage
- Using a GLB model (exporting from Blender and wiring it up)
- Animation state contract
- Troubleshooting
- Contributing
- License

---

## Getting started

Prerequisites:
- Node.js (16+ recommended)
- npm (comes with Node)

Install dependencies (Windows PowerShell):

```powershell
cd C:\Users\Administrator\Downloads\next-download\horse-train
npm install
# If you encounter dependency resolution issues for @react-three/fiber, use:
# npm install three @react-three/fiber@8.17.0 @react-three/drei --legacy-peer-deps
```

Notes:
- During development `@react-three/fiber@8.17.0` was used to avoid React 19 peer dependency restrictions.
- If you add a GLB file later you do not need to re-install these packages unless you add new packages.

---

## Development: run & build

Start the dev server (PowerShell):

```powershell
npm run dev
```

Open the app in your browser (Vite will show the local URL). On my machine it was accessible at `http://localhost:5173` by default.

Build for production:

```powershell
npm run build
npm run preview
```

---

## Project layout (relevant files)

```
/ (repo root)
  README.md                    # This file
  public/
    assets/
      horses/                  # 2D horse assets
      houses/                  # house images
      horse-model/             # place GLB here when using a 3D model

  src/
    App.jsx                    # main app + 2D/3D toggle
    main.jsx
    index.css
    components/
      Horse.jsx                # 2D horse (framer-motion) and fallback
      HorseBody.jsx
      HorseHead.jsx
      HorseEyes.jsx
      Horse3D.jsx               # 3D procedural horse + useFrame animations
      HorseCanvas.jsx           # Canvas wrapper for Three.js
      Horse3DGLBTemplate.jsx    # Template that shows how to load/drive a GLB model
      CarrotAnimation.jsx       # animated carrot particle
      House.jsx
      Trough.jsx
      Shop.jsx
    context/
      AssetContext.jsx
      SoundContext.jsx

  scripts/
    generate-asset-manifest.js
```

---

## 2D vs 3D usage

The UI supports both 2D and 3D. Click the **3D Mode** button in the header to toggle.

2D mode (default):
- Uses `Horse.jsx` with Framer Motion variants for expressions and gestures.
- Buttons in the HUD call functions like `makeEat()`, `makeAegyo()` that set `horse.animation` in app state. Those values drive the Framer Motion `animate` prop.

3D mode:
- Uses `HorseCanvas.jsx` which renders a Three.js `Canvas` and `Horse3D.jsx`.
- `Horse3D.jsx` currently includes a procedural horse (built from geometries) with independent parts (body/head/eyes/tail) animated inside `useFrame()`.
- Animations are triggered by the same `horse.animation` prop — the 3D component reads that prop and applies transforms.

You can keep the 2D assets and still use 3D; the code is written to be backward compatible.

---

## Animation state contract

The app uses a small animation contract so both 2D and 3D systems understand the requested action. The animation string values are:

- `idle`
- `eat`
- `blink`
- `headTilt`
- `closeEyes`
- `hungry` (looping)
- `hurt`
- `cute`
- `brushed`
- `aegyo`

Behavior expectations:
- Non-looping animations should revert to `idle` after their duration.
- `hungry` is intended to loop until changed.
- Button handlers in `App.jsx` set the animation string and optionally play a sound via `useSound()`.

Duration reference (used by UI to reset animation):

```js
const durations = {
  idle: 0.3,
  eat: 0.8,
  blink: 0.4,
  headTilt: 1.0,
  closeEyes: 1.2,
  hungry: 1.5,
  hurt: 0.6,
  cute: 1.0,
  brushed: 0.9,
  aegyo: 0.9,
}
```

When you add a GLB model, make sure the clip names match these strings or map them inside `Horse3D.jsx` when using `useAnimations()`.

---

## Using a GLB model (Blender → GLB → useAnimations)

If you want a professionally rigged horse with skeletal animations, follow these steps.

1) Create/prepare animation clips in Blender

- Rig the horse with an armature (bones). Skin the mesh.
- For each action (e.g. `eat`) create a separate Action in the Action Editor.
- Keep action names matching the above strings. Consistent naming is important.
- Make sure to store actions as NLA tracks or keep them in the Action Editor (so they are exported).

2) Export the GLB

File → Export → glTF 2.0 (.glb)
- Format: GLB (binary) recommended
- Include: Mesh, Armature, Animations
- Under "Animation" options, export all actions. Consider grouping or naming via NLA for clarity.

3) Put the file into the public folder

Create folder `public/assets/horse-model/` and copy your `horse.glb` there.

4) Wire up `Horse3D.jsx` to use the GLB

A template is provided in `src/components/Horse3DGLBTemplate.jsx`.

Key steps inside the component:

```js
const { scene: modelScene, animations } = useGLTF('/assets/horse-model/horse.glb')
const { actions } = useAnimations(animations, groupRef)

useEffect(() => {
  if (!actions) return
  // stop/blend out existing actions then play the requested one
  Object.values(actions).forEach(a => a?.stop())
  actions[animation]?.reset()?.fadeIn(0.2)?.play()
}, [animation, actions])
```

Notes:
- Use `console.log(Object.keys(actions))` to inspect available clip names.
- Clip names in the GLB must match your `horse.animation` strings, or provide a name mapping inside `Horse3D.jsx`.
- `useAnimations` returns clips keyed by name — you can crossfade using `.fadeOut()` and `.fadeIn()`.

---

## Development tips and debugging

Common quick checks:

- Dev server not starting / port in use: Vite will try the next port. Check terminal output for the local URL (usually http://localhost:5173 or 5174).
- NPM peer dependency errors installing react-three packages: use the `--legacy-peer-deps` flag (see the install snippet above).
- GLB model not loading: verify the path is correct (`/assets/horse-model/horse.glb`) and the file is inside `public` (not `src`). Check browser network tab and console errors.
- Animation clips not found: open the console and `console.log(Object.keys(actions))` inside the GLB loader.

Powerful debugging patterns:

- Temporarily show available animations and their lengths from `useAnimations`.
- For GLB, open the model in Blender and make sure the actions are exported and have unique names.
- If the model looks deformed, ensure transforms are applied (`Ctrl-A`) before export and that scale/rotation are baked.

---

## How to extend / add new animations

1. Add a new action name to the contract (both `App.jsx` and `Horse3D.jsx`).
2. For 2D: add a Framer Motion variant in `Horse.jsx` and a button handler in `App.jsx`.
3. For 3D: add a new clip in Blender with the exact name or map inside `Horse3D.jsx`.
4. Provide a sensible duration in the `durations` object so UI can reset to idle.

---

## Troubleshooting & FAQ

Q: "3D Mode" button doesn’t appear
- Ensure your `src/components/HorseCanvas.jsx` exists and `App.jsx` imports it.

Q: GLB animations not playing
- Run `console.log(Object.keys(actions))` inside the GLB loader to inspect available clip names.
- Map your `horse.animation` to the clip names if they differ.

Q: Development server shows HMR updates but the 3D canvas is blank
- Check the browser console for WebGL errors.
- Ensure `three` package is installed, and the correct version of `@react-three/fiber` is used.

Q: I see artifacts or odd mesh deformations after loading GLB
- In Blender, apply transforms (Ctrl-A) and ensure you export with "Apply Modifiers" if needed.
- Check bone weights and ensure the mesh is skinned correctly.

---

## Contributing

Contributions are welcome. Suggested workflow:

```powershell
# create branch
git checkout -b feat/3d-horse-improvements
# make changes
git add .
git commit -m "Improve Horse3D animation and GLB loader"
git push
```

Please open a pull request and describe the change. Add screenshots and the browser console output if related to rendering.

---

## License

This demo project is provided under the MIT license. See `LICENSE` if provided or add one if you plan to publish.

---

If you want, I can:
- Run through converting `Horse3D.jsx` fully to GLB-based `useGLTF` usage and swap out the procedural geometry for a real model (I can implement the code once you add your `horse.glb`).
- Add sample GLB (low-poly) to `public/assets/horse-model/` to demonstrate exact wiring and clip names.

If you'd like me to write `README.md` to a different format or add example screenshots, tell me where and I'll add them.

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
