# 3D Horse Implementation Guide

## Current Setup

The horse-train game now supports **3D animated horses** using React Three Fiber! You can toggle between 2D (Framer Motion) and 3D (Three.js) modes using the **"3D Mode"** button in the top right.

## Architecture

### Components

1. **HorseCanvas.jsx** - Canvas wrapper for Three.js rendering
2. **Horse3D.jsx** - Main 3D horse component with procedural geometry and animations
3. **App.jsx** - Main app with toggle between 2D and 3D modes

### Current Features

✨ **Procedural Horse Model** - Created with Three.js geometries:
- Body (box geometry)
- Head (sphere)
- Legs (4 cylinders)
- Ears (2 cones)
- Eyes (2 spheres with shine)
- Tail (cylinder)
- Snout (sphere)

🎬 **Animation System** - All 8 animations work in 3D:
- eat - body bobbing
- blink - eye scaling
- headTilt - head rotation
- closeEyes - eyes closing
- hungry - drooping pose
- hurt - shaking
- cute - bouncing with head tilt
- brushed - satisfied pose
- idle - gentle breathing

## Using a GLB Model (Advanced)

To use a professional GLB model instead of the procedural horse:

### Step 1: Prepare Your GLB Model

1. Download or create a horse model in Blender
2. In Blender, create animation clips for:
   - idle (looping breathing)
   - eat (chewing motion)
   - blink (eye blink)
   - headTilt (head side-to-side)
   - closeEyes (eyes closed)
   - hungry (drooping pose)
   - hurt (pain/shaking)
   - cute (playful pose)
   - brushed (groomed satisfaction)

3. Export as GLB format (File > Export > glTF 2.0 (.glb/.gltf))

### Step 2: Add GLB to Project

1. Place the GLB file in `public/assets/horse-model/` (create the folder if needed)
2. Name it `horse.glb` or update the path in Horse3D.jsx

### Step 3: Update Horse3D.jsx

Replace the procedural horse code with GLB loader:

```jsx
import { useGLTF, useAnimations } from '@react-three/drei'

export default function Horse3D({ animation = 'idle' }) {
  const groupRef = useRef()
  const { scene, animations } = useGLTF('/assets/horse-model/horse.glb')
  const { actions } = useAnimations(animations, groupRef)

  useEffect(() => {
    if (actions[animation]) {
      // Stop all animations
      Object.values(actions).forEach(action => action.stop())
      // Play the requested animation
      actions[animation].reset().play()
    }
  }, [animation, actions])

  return (
    <>
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <OrbitControls autoRotate autoRotateSpeed={2} />
    </>
  )
}
```

### Step 4: Build Animation Clips in Blender

For each animation in Blender:

1. Go to Action Editor
2. Create new Action with animation name (e.g., "eat")
3. Set keyframes for the animation
4. Mark as Non-Linear Animation (optional, for better control)
5. Export with all actions included

## File Structure

```
public/
  assets/
    horse-model/
      horse.glb          (Your 3D model)

src/
  components/
    Horse3D.jsx         (3D horse component)
    HorseCanvas.jsx     (Three.js Canvas wrapper)
    Horse.jsx           (Original 2D horse - still available)
```

## Animation Durations

Each animation has a specific duration used for the UI:

```javascript
const durations = {
  idle: 0.3,      // Default breathing
  eat: 0.8,       // Eating/chewing
  blink: 0.4,     // Quick blink
  headTilt: 1,    // Head tilting
  closeEyes: 1.2, // Eyes closing
  hungry: 1.5,    // Hungry pose (loops)
  hurt: 0.6,      // Pain/shaking
  cute: 1,        // Playful gesture
  brushed: 0.9,   // Grooming satisfaction
  aegyo: 0.9      // Cute gesture
}
```

## Current Limitations & Next Steps

### Current Procedural Setup Benefits:
✅ No external model required
✅ Easy to modify colors and shapes
✅ Works immediately
✅ Lightweight

### Next Steps for GLB Integration:
1. Create/acquire a professional horse model
2. Rig the model with bones in Blender
3. Create animation clips for each action
4. Test animation transitions
5. Optimize model for web (reduce polygon count)

## Switching Between 2D and 3D

Users can toggle between modes using the **"3D Mode"** / **"2D Mode"** button in the header. The button:
- Shows current mode
- Toggles between 2D Framer Motion animations
- Toggles between 3D Three.js animations

All other game mechanics (inventory, troughs, stats) remain the same regardless of viewing mode.

## Performance Tips

1. **Model Optimization**
   - Keep polygon count under 50,000
   - Use texture atlasing
   - Bake lighting where possible

2. **Animation Optimization**
   - Use action blending instead of hard cuts
   - Optimize animation frame count
   - Use LOD (Level of Detail) for distant views

3. **Rendering**
   - The Canvas defaults to antialiasing enabled
   - Background matches the 2D interface
   - OrbitControls allow user interaction

## Troubleshooting

**Error: Cannot find module 'three'**
- Run: `npm install three @react-three/fiber @react-three/drei --legacy-peer-deps`

**3D model not loading**
- Check file path in `useGLTF('/path/to/model.glb')`
- Ensure model is in public folder
- Check browser console for errors

**Animations not playing**
- Verify animation names in GLB match the animation state strings
- Check that animations are exported in Blender
- Use `console.log(Object.keys(actions))` to see available animations

## Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber Guide](https://docs.pmnd.rs/react-three-fiber/)
- [Blender GLB Export](https://docs.blender.org/manual/en/latest/addons/io_scene_gltf2/export.html)
- [Drei useAnimations](https://drei.pmnd.rs/?path=/story/animation-useanimations--default)
