# Adi Animation Guide - FREE Path

Complete guide to animating Adi using only free tools and assets.

---

## Strategy: Free + DIY

We're going with a **hybrid approach**:
1. **Free Lottie assets** from LottieFiles as starting points
2. **Rive editor** (free) for custom creation and editing
3. **AI image generation** for new Adi frames
4. **Moti** (already installed) for programmatic animations
5. **Lottie React Native** for vector animation playback

---

## Step 1: Install Lottie React Native

```bash
cd ~/shotchi-app
npx expo install lottie-react-native
```

Then update `metro.config.js` to support `.lottie` files:

```javascript
const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, "lottie", "json"],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
```

---

## Step 2: Find Free Lottie Animations

Go to **<https://lottiefiles.com>** and search for these (all free tier):

### For Adi's Moods

| Search Terms | What to Look For | Use As |
|---|---|---|
| "happy blob" | Bouncing, smiling blob | adi-idle-happy |
| "sad blob" or "crying emoji" | Droopy, frowning shape | adi-idle-sad |
| "neutral face" or "idle character" | Calm, breathing animation | adi-idle-neutral |
| "waiting" or "loading blob" | Subtle pulse/loading | adi-idle-waiting |
| "celebration" or "confetti" | Burst animation | adi-celebrate |
| "sleeping" or "zzz" | Drowsy character | adi-sleepy |

### For UI Effects

| Search Terms | Use As |
|---|---|
| "confetti" | CelebrationModal background |
| "success check" | Log confirmation |
| "heart pulse" | Health/streak indicator |
| "notification bell" | Reminder indicator |

### Recommended Free LottieFiles Animations

Search these exact URLs (browse on your phone or computer):

- **<https://lottiefiles.com/free-animations/emotion>** - Emotion category
- **<https://lottiefiles.com/free-animations/character>** - Character category
- **<https://lottiefiles.com/free-animations/emoji>** - Emoji category
- **<https://lottiefiles.com/free-animations/loading>** - Loading/idle category

**Tips for picking:**
- Choose **simple** designs (fewer layers = smaller files = faster loading)
- Prefer **single-color body** animations (easier to runtime-tint with user's accent color)
- Pick **looping** ones for idle states, **one-shot** for celebrations
- Download the **Lottie JSON** format (not GIF/MP4)
- Free tier allows 5 downloads/month on free account, unlimited with free account + attribution

---

## Step 3: Create Custom Adi Animations (FREE)

### Option A: Rive Editor (Best Free Option)

**Rive** is FREE and gives you the most control:

1. Go to **<https://rive.app>** → Sign up free
2. Create new file → 400x400 canvas
3. Draw Adi using Rive's vector tools:
   - Ellipse tool → draw body (rounded blob)
   - Circle tool → two dot eyes
   - Path tool → curved smile/frown
4. Add animations:
   - **Idle Happy**: Body scale pulse (breathing), eyes blink every 3s, gentle bounce
   - **Idle Sad**: Body droops slightly, eyes half-closed, slow sway
   - **Celebrate**: Squash-stretch bounce, eyes widen, body jiggles
5. Add **state machine**:
   - States: happy, neutral, sad, waiting
   - Transitions: blend between states (0.3s crossfade)
   - Input: "mood" number (0-3) that code can set
6. Export as `.riv` file

**Rive advantage:** One file with ALL moods inside, smooth transitions between them, runtime color changes, and smaller file size than separate Lottie files.

**Install Rive for React Native:**
```bash
npx expo install rive-react-native
```

### Option B: Generate Frames with AI + Convert

1. Use **Google Stitch** or **Gemini** to generate Adi frames:
   ```
   "Generate a cute blob character mascot for a health app.
   Simple rounded body, two dot eyes, small smile.
    8 frames of a breathing idle animation.
   Style: flat vector, minimal, single green color (#7BAF8E).
   Format: individual PNG frames 400x400px"
   ```

2. Convert frames to Lottie JSON using free tools:
   - **<https://psd-to-lottie.netlify.app>** - Free PSD/PNG to Lottie converter
   - Or use **<https://lottiefiles.com/svg-to-lottie>** - Free SVG to Lottie
   - Best: Draw in **Figma** (free) → export SVG → convert to Lottie

### Option C: Figma → Lottie (FREE, Reliable)

1. **Figma** (free) - Draw Adi as vector:
   - Create 400x400 frame
   - Draw blob body with ellipse tool
   - Add eyes, mouth as separate layers
   - **Name your layers clearly** (body, leftEye, rightEye, mouth) — this matters for runtime color changes
   
2. **Figma to Lottie plugin** (free):
   - In Figma, go to Plugins → search "LottieFiles"
   - Install "LottieFiles: Create Lottie animations"
   - Use it to animate your layers
   - Export as JSON
   
3. Or use **Figma + Motion** (Figma's built-in animation):
   - Create smart animate prototype
   - Export frames

---

## Step 4: Enhanced Moti Approach (No Lottie Needed)

If you want to skip Lottie entirely and just upgrade the current PNG system with better Moti animations, here's how:

### Create a richer animation system with existing moti + reanimated:

```javascript
// src/components/AnimatedAdi.js
import React, { useEffect, useRef } from 'react'
import { Image, Pressable } from 'react-native'
import { MotiView, AnimatePresence } from 'moti'
import { Easing } from 'react-native-reanimated'

const characterImages = {
  happy: require('../assets/character/adi-happy.png'),
  neutral: require('../assets/character/adi-neutral.png'),
  sad: require('../assets/character/adi-sad.png'),
  waiting: require('../assets/character/adi-waiting.png'),
}

export default function AnimatedAdi({ mood = 'happy', accentColor = '#7BAF8E', size = 180, onPress }) {
  // Breathing animation (continuous subtle pulse)
  // Bounce on mood change
  // Wiggle on tap
  // Squash-stretch on celebration
  
  return (
    <Pressable onPress={onPress}>
      <MotiView
        from={{ scale: 0.95, translateY: 5 }}
        animate={{ 
          scale: 1, 
          translateY: 0,
        }}
        transition={{
          type: 'spring',
          damping: 15,
          mass: 1,
        }}
        style={{ width: size, height: size }}
      >
        {/* Glow ring behind character */}
        <MotiView
          from={{ scale: 0.9, opacity: 0.3 }}
          animate={{ scale: 1.1, opacity: 0.15 }}
          transition={{
            loop: true,
            type: 'timing',
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
          }}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: accentColor,
          }}
        />
        
        {/* Breathing animation */}
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: 1.03 }}
          transition={{
            loop: true,
            type: 'timing',
            duration: 2500,
            easing: Easing.inOut(Easing.sin),
          }}
        >
          <AnimatePresence exitBeforeEnter>
            <MotiView
              key={mood}
              from={{ scale: 0.8, opacity: 0, rotate: '-5deg' }}
              animate={{ scale: 1, opacity: 1, rotate: '0deg' }}
              exit={{ scale: 0.8, opacity: 0, rotate: '5deg' }}
              transition={{ type: 'spring', damping: 12 }}
            >
              <Image
                source={characterImages[mood]}
                style={{ 
                  width: size, 
                  height: size,
                  tintColor: accentColor,
                  resizeMode: 'contain',
                }}
              />
            </MotiView>
          </AnimatePresence>
        </MotiView>
      </MotiView>
    </Pressable>
  )
}
```

### Add these animation behaviors to the component:

| Behavior | Trigger | Animation |
|---|---|---|
| Breathing | Always (idle) | Scale 1.0 → 1.03, 2.5s sine loop |
| Glow pulse | Always (idle) | Scale 0.9 → 1.1, opacity 0.3 → 0.15, 2s loop |
| Mood transition | Mood changes | Spring scale from 0.8 + fade + slight rotation |
| Tap wiggle | User taps Adi | Quick rotation -5° → 5° → 0° spring |
| Celebration | After logging shot | Scale 1.0 → 1.2 → 1.0 bounce (damping: 8) |
| Nudge | Reminder notification | TranslateY -10 → 0 spring + scale pop |

---

## Step 5: Lottie Integration (When You Have JSON Files)

Once you have Lottie JSON files, put them in:
```
src/assets/character/lottie/
├── adi-idle-happy.json
├── adi-idle-neutral.json
├── adi-idle-sad.json
├── adi-idle-waiting.json
├── adi-celebrate.json
├── adi-wave.json
└── adi-nudge.json
```

### Replace PNG swap with Lottie:

```javascript
// src/components/LottieAdi.js
import React, { useRef } from 'react'
import LottieView from 'lottie-react-native'
import { Pressable } from 'react-native'

const animations = {
  happy: require('../assets/character/lottie/adi-idle-happy.json'),
  neutral: require('../assets/character/lottie/adi-idle-neutral.json'),
  sad: require('../assets/character/lottie/adi-idle-sad.json'),
  waiting: require('../assets/character/lottie/adi-idle-waiting.json'),
}

export default function LottieAdi({ mood = 'happy', accentColor = '#7BAF8E', size = 180, onPress }) {
  const animationRef = useRef(null)

  const playCelebration = () => {
    // Switch to celebrate animation, then back to happy
    animationRef.current?.play()
  }

  return (
    <Pressable onPress={onPress}>
      <LottieView
        ref={animationRef}
        source={animations[mood]}
        autoPlay
        loop
        style={{ width: size, height: size }}
        colorFilters={[
          { keypath: 'body', color: accentColor },
        ]}
      />
    </Pressable>
  )
}
```

---

## Step 6: Rive Integration (Best Long-Term, Free)

```bash
npx expo install rive-react-native
```

Put the `.riv` file in:
```
src/assets/character/adi.riv
```

```javascript
// src/components/RiveAdi.js
import React from 'react'
import { Rive, StateMachineInput, useRive } from 'rive-react-native'
import { Pressable } from 'react-native'

export default function RiveAdi({ mood = 'happy', accentColor = '#7BAF8E', size = 180, onPress }) {
  const { riveRef, setInputState } = useRive({
    src: require('../assets/character/adi.riv'),
    stateMachineName: 'State Machine', // Match your Rive file
    autoplay: true,
  })

  // Update mood
  React.useEffect(() => {
    const moodMap = { happy: 0, neutral: 1, sad: 2, waiting: 3 }
    setInputState?.('mood', moodMap[mood])
  }, [mood])

  // Update color at runtime!
  React.useEffect(() => {
    setInputState?.('color', accentColor)
  }, [accentColor])

  return (
    <Pressable onPress={onPress}>
      <Rive
        ref={riveRef}
        style={{ width: size, height: size }}
      />
    </Pressable>
  )
}
```

---

## Priority Recommendation

### Do This NOW (0 cost, 2-3 hours dev):
1. ✅ Create `AnimatedAdi.js` component with enhanced Moti animations (breathing, glow, spring transitions)
2. ✅ Replace static `<Image>` in HomeScreen with `<AnimatedAdi>`
3. ✅ Add tap interaction (Adi wiggles when tapped)
4. ✅ Add celebration bounce after logging injection

### Do This NEXT (0 cost, 1-2 hours):
1. Browse LottieFiles free animations for matching characters
2. Download 4-5 free Lottie JSONs
3. Install `lottie-react-native`
4. Drop in Lottie files, runtime-tint with accent color

### Do This LATER (0 cost, 4-8 hours):
1. Learn Rive editor (free)
2. Build custom Adi with state machine
3. One `.riv` file with all moods + transitions
4. Runtime color changes + tap interactions

---

## Free Resources Summary

| Resource | URL | What It Gives You |
|---|---|---|
| LottieFiles Free | <https://lottiefiles.com/free-animations> | Free Lottie JSON animations |
| Rive Editor | <https://rive.app> | Free vector animation editor |
| Figma | <https://figma.com> | Free vector design tool |
| SVG to Lottie | <https://lottiefiles.com/svg-to-lottie> | Free SVG → Lottie converter |
| Figma Lottie Plugin | Figma → Plugins → LottieFiles | Animate in Figma, export Lottie |
| lottie-react-native | `npx expo install lottie-react-native` | Free Lottie player for RN |
| rive-react-native | `npx expo install rive-react-native` | Free Rive player for RN |
| Moti (already installed) | Already in project | Free RN animation library |
