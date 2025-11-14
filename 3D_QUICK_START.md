# 3D Horse Quick Reference

## Current Status ✨

Your horse-train game now has full 3D support using React Three Fiber!

### Key Features:
- ✅ **Toggle between 2D and 3D** - Use "3D Mode" button in header
- ✅ **All 8 animations work in 3D** - eat, blink, headTilt, closeEyes, hungry, hurt, cute, brushed
- ✅ **Procedural horse** - Works immediately, no external files needed
- ✅ **Interactive 3D view** - Rotate, zoom, pan with mouse
- ✅ **Auto-rotating preview** - Smooth auto-rotation in idle state

## Package Installation ✓

Already installed:
```
three@^15.0.0
@react-three/fiber@^8.17.0
@react-three/drei@^11.0.0
```

## File Structure

```
src/
├── components/
│   ├── Horse.jsx                    (2D Framer Motion horse)
│   ├── HorseHead.jsx                (2D head animations)
│   ├── HorseBody.jsx                (2D body animations)
│   ├── HorseEyes.jsx                (2D eye animations)
│   ├── Horse3D.jsx                  (3D procedural horse) ⭐
│   ├── HorseCanvas.jsx              (Three.js Canvas wrapper)
│   └── Horse3DGLBTemplate.jsx       (GLB template - for future use)
└── App.jsx                          (Main app with 2D/3D toggle)

public/
├── assets/
│   └── horse-model/                 (For GLB files - create if using models)
│       └── horse.glb                (Your 3D model here)
```

## Animation System

### How It Works:

1. **App.jsx** manages `horse.animation` state
2. Button clicks call animation functions (makeEat, makeBlink, etc.)
3. State updates trigger `<HorseCanvas animation={horse.animation} />`
4. Horse3D component reads animation prop and applies transforms

### Animation States:

```javascript
const animations = [
  'idle',      // Default breathing
  'eat',       // Bobbing motion
  'blink',     // Eye scaling
  'headTilt',  // Head rotation
  'closeEyes', // Eyes closing
  'hungry',    // Drooping pose (loops)
  'hurt',      // Shaking
  'cute',      // Bouncing
  'brushed',   // Satisfied pose
  'aegyo'      // Cute gesture
]
```

## Testing Animations

1. Click "3D Mode" button
2. Scroll down to "Horse Animations" section
3. Click any animation button to see it in 3D:
   - 🍽️ Eat
   - 👁️ Blink
   - 🤔 Head Tilt
   - 😴 Close Eyes
   - 😫 Hungry
   - 😢 Hurt
   - ✨ Cute
   - 💇 Brushed

## Upgrading to GLB Model

### Simple 3-Step Process:

**Step 1: Prepare Model**
- Blender > Create horse model > Rig with bones
- Create animation clips for each animation type
- File > Export > glTF 2.0 > Export as .glb

**Step 2: Add Files**
- Create folder: `public/assets/horse-model/`
- Place `horse.glb` in that folder

**Step 3: Update Code**
- Copy `Horse3DGLBTemplate.jsx` content
- Paste into `Horse3D.jsx`
- That's it! All animations will work automatically

### Animation Naming in Blender:
```
idle        → Default/breathing animation
eat         → Eating/chewing motion
blink       → Eye blink
headTilt    → Head side-to-side tilt
closeEyes   → Eyes closing/sleeping
hungry      → Drooping, hungry pose
hurt        → Pain/shaking animation
cute        → Playful/bouncing pose
brushed     → Groomed/satisfied pose
aegyo       → Cute/adorable gesture
```

## Performance Tips

### Current (Procedural):
- ✅ No loading time
- ✅ ~2000 polygons
- ✅ Instant rendering

### When Using GLB:
1. **Optimize model** → Keep under 50k polygons
2. **Bake textures** → Use single texture atlas
3. **Simplify animations** → Reduce keyframes
4. **Use LOD** → Different detail levels for distance

## Troubleshooting

| Problem | Solution |
|---------|----------|
| 3D Mode button missing | Check App.jsx imports HorseCanvas |
| 3D view is black | Check lighting in Horse3D.jsx |
| Animations don't play in 3D | Check animation names match |
| GLB model won't load | Verify path: `/assets/horse-model/horse.glb` |
| Performance slow | Reduce model polygon count, disable auto-rotate |

## Next Steps 🚀

1. **Test current 3D animations** - Click "3D Mode" and try each animation
2. **Create GLB model** (Optional) - Follow Blender export steps
3. **Optimize for mobile** - Reduce polygon count for better performance
4. **Add more horses** - Create variant models with different colors/breeds

## Useful Resources

- [Three.js Docs](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)
- [Blender Export Guide](https://docs.blender.org/manual/en/latest/addons/io_scene_gltf2/)
- [Drei Components](https://drei.pmnd.rs/)

## Code Examples

### Playing Custom Animation:
```jsx
const makeCustomAnimation = () => {
  setHorse(h => ({...h, animation: 'eat'}))
  setTimeout(() => setHorse(h => ({...h, animation: 'idle'})), 800)
}
```

### Getting Available Animations in GLB:
```jsx
// In Horse3D.jsx console
const { scene, animations } = useGLTF('/assets/horse-model/horse.glb')
console.log(animations.map(a => a.name))
```

---

**Questions?** See `3D_HORSE_GUIDE.md` for detailed documentation.
