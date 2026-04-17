# Shotchi App - Phase A Complete ✅

## Project Structure
```
shotchi-app/
├── src/
│   ├── assets/              # Character states & icons
│   │   ├── character/       # adi-happy.png, adi-neutral.png, adi-sad.png
│   │   ├── icons/          # app-icon.png
│   │   └── README.md       # Asset replacement guide
│   ├── lib/
│   │   └── supabase.js     # Supabase client config
│   └── screens/
│       ├── App.js          # Navigation & auth logic
│       ├── AuthScreen.js   # Login/Signup + skip option
│       ├── HomeScreen.js   # Main app with character display
│       ├── LogShotScreen.js # Injection logging UI
│       ├── HistoryScreen.js # Injection history & stats
│       └── SettingsScreen.js # Schedule & notification settings
├── package.json            # Dependencies
└── SETUP.md               # This file
```

## Quick Start
```bash
cd shotchi-app
npm install
npm start
```

## Phase A: Complete ✅
- [x] Expo project scaffold
- [x] Supabase wiring (auth + database)
- [x] Basic navigation
- [x] 5 core screens with MVP UI
- [x] Asset loading system (easy to replace)

## Phase B: Next Steps
1. **Supabase Schema Setup**
   - Create `profiles` and `injections` tables
   - Configure RLS policies
   - Set up auth triggers

2. **Core Loop Implementation**
   - Connect screens to Supabase data
   - Implement injection logging flow
   - Add streak calculation logic

3. **Reminder Scheduling**
   - Implement push notification scheduling
   - Test notification delivery

4. **Character State Logic**
   - Map injection status to character states
   - Add simple animations/visual feedback

## Asset Replacement Guide
All assets are imported directly in screens:
- Character states: `import asset from '../assets/character/...png'`
- Icons: `import icon from '../assets/icons/...png'`

To replace:
1. Swap PNG files in `src/assets/`
2. Keep same filenames
3. No code changes needed

## Supabase Setup Required
Before running the app, update `src/lib/supabase.js`:
```js
const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'
```

## Notes
- Assets are MVP-quality (AI-generated)
- Character states can be replaced later for final polish
- All screens use React Paper for consistent styling
- Auth is optional (skip available for local storage)
