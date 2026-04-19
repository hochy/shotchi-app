# Shotchi Feature Roadmap

This document outlines high-priority features to implement for competitive parity with apps like Shotsy, Medisafe, and MyTherapy.

---

## 1. Medication Level Estimation (HIGH PRIORITY)

**Why:** This is Shotsy's killer feature. Users want to understand why side effects peak at certain times.

**Requirements:**
- Calculate estimated drug concentration in the body over time based on medication half-lives:
  - **Semaglutide (Ozempic/Wegovy):** ~7 days half-life, steady state ~4-5 weeks
  - **Tirzepatide (Mounjaro/Zepbound):** ~5 days half-life, steady state ~4 weeks
  - **Liraglutide (Saxenda):** ~13 hours half-life, daily dosing
- Display as a line chart showing:
  - X-axis: days since last injection
  - Y-axis: estimated medication level (0-100%)
  - Peak levels (day 1-2), trough (day before next dose)
  - Visual indicator of where user is currently
- Store the user's selected drug and dosage in their profile
- Show which drug they're on and current estimated level on Home screen
- Add a "Medication Timeline" screen showing the full week's estimated levels

**Technical:**
- Use `react-native-chart-kit` for the visualization
- Create `src/lib/medicationLevels.js` with calculation logic
- Integrate with existing `AppStateContext` for drug/dosage selection
- Add to Settings: Drug Type dropdown + Dosage selector

---

## 2. Weight Tracking (HIGH PRIORITY)

**Why:** Table stakes for GLP-1 tracking. Users expect to track weight alongside injections.

**Requirements:**
- Add weight input field to LogShotScreen (optional, after injection logged)
- Store weight entries in database with timestamp
- Display weight trend on HistoryScreen dashboard:
  - Line chart showing weight over time
  - Overlay with injection dates (dots on the line)
  - Color-code by dosage level if medication level feature exists
- Add weight-only logging option (for days between injections)
- Show weight change since starting, last 4 weeks, etc.
- Sync with Apple HealthKit / Google Fit if possible

**Database schema:**
```sql
-- Option A: Add to injections table
ALTER TABLE injections ADD COLUMN weight DECIMAL(5,2);

-- Option B: Separate weight_entries table
CREATE TABLE weight_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  weight DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**UI:**
- Weight input on HomeScreen quick-add
- Weight chart on dashboard (separate tab or toggle)
- Weight stats: Starting weight, current, total lost, avg weekly loss

---

## 3. Side Effect Logging (HIGH PRIORITY)

**Why:** Users need to correlate symptoms with medication levels, timing, and injection sites.

**Requirements:**
- Add "Log Side Effects" button to HomeScreen and LogShotScreen
- Side effect entry screen with:
  - Common side effects as quick-tap buttons:
    - Nausea, Fatigue, Constipation, Diarrhea, Headache, Dizziness
    - Stomach pain, Acid reflux, Bloating, Loss of appetite
  - Severity slider (1-5 or Mild/Moderate/Severe)
  - Notes field
  - Timestamp
- Correlation analysis:
  - Show side effect patterns by:
    - Day of week (relative to injection day)
    - Estimated medication level (if that feature exists)
    - Injection site
  - Display as charts on HistoryScreen
- Side effect history list with filters
- Export side effects in PDF report

**Database:**
```sql
CREATE TABLE side_effects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  injection_id UUID REFERENCES injections(id),
  symptom TEXT NOT NULL,
  severity INT CHECK (severity >= 1 AND severity <= 5),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. Body Diagram for Injection Site Selection (HIGH PRIORITY)

**Why:** Visual selection is more intuitive than text buttons. Shows which sites need rest.

**Requirements:**
- Create an SVG or image-based body diagram showing:
  - Left/Right Thigh
  - Left/Right Stomach (abdomen)
  - Left/Right Arm (upper arm)
- User taps the body part to select it
- Highlight selected area with the app's accent color
- Show which sites were used recently (last 4 injections) with small indicators
- Grayscale/fade areas that need rest (used in last 2 weeks)
- After selection, show confirmation with site name
- Track rotation patterns and suggest next site

**Technical:**
- Create `src/components/BodyDiagram.js`
- Use `react-native-svg` for the interactive diagram
- Alternative: Use a PNG overlay with tap regions

**Design:**
- Clean, medical illustration style
- Not too anatomical - friendly, approachable
- Works with app's character/color customization

---

## 5. PDF Export for Doctor Visits (HIGH PRIORITY)

**Why:** Users want to share their data with healthcare providers.

**Requirements:**
- Add "Export for Doctor" button in Settings or History screen
- Generate PDF report containing:
  - Header: User name, medication, date range
  - Injection history table: Date, Site, Drug, Dosage, Notes
  - Adherence stats: % on-time, total injections, streak
  - Weight trend chart (if weight tracking enabled)
  - Side effect summary (if logged)
  - Medication level chart (if implemented)
- PDF should be:
  - Clean, professional, clinical-looking
  - 1-2 pages max
  - Branded with Shotchi logo
  - Include date generated
- Share via:
  - Native share sheet (email, messages, AirDrop, etc.)
  - Save to Files app

**Technical:**
- Use `react-native-pdf` or `expo-sharing`
- Create `src/lib/pdfGenerator.js`
- Test on both iOS and Android

---

## 6. Apple Health / Google Fit Integration (MEDIUM PRIORITY)

**Why:** Reduces friction. Users can log weight elsewhere and have it sync.

**Requirements:**
- Request permissions on first launch (optional opt-in)
- Write to HealthKit:
  - Weight entries
  - Medication doses (if HealthKit supports)
- Read from HealthKit:
  - Weight (sync if user logs elsewhere)
  - Steps/activity (for correlation with side effects)
- Show HealthKit sync status in Settings
- Handle permission denied gracefully
- Sync indicator on relevant screens

**Technical:**
- Use `expo-health` or `react-native-health`
- Platform-specific implementation (iOS vs Android)
- Background sync if possible

**UI:**
- Toggle in Settings: "Sync with Apple Health / Google Fit"
- Show last sync timestamp
- Manual sync button

---

## 7. Refill Reminders (MEDIUM PRIORITY)

**Why:** Helps users avoid running out of medication.

**Requirements:**
- In Settings, user can set:
  - Pen/vial quantity (e.g., "I have 4 doses")
  - Refill threshold (e.g., "Remind me when I have 2 doses left")
- Track doses used from inventory
- Send push notification when approaching threshold
- Deep link to pharmacy or user's preferred refill method
- Visual indicator on HomeScreen:
  - Doses remaining badge
  - Color changes as supply decreases (green → yellow → red)
- "Log Refill" action to reset counter
- Integration with medication level (show supply status)

**Database:**
```sql
-- Add to profiles table
ALTER TABLE profiles ADD COLUMN doses_on_hand INT DEFAULT 0;
ALTER TABLE profiles ADD COLUMN refill_threshold INT DEFAULT 2;
ALTER TABLE profiles ADD COLUMN last_refill_date TIMESTAMPTZ;

-- Or create inventory table for multi-pen tracking
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  pen_name TEXT,
  doses_remaining INT,
  expiration_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 8. Photo Capture for Each Injection (LOW PRIORITY)

**Why:** Documentation for site rotation verification and dosage tracking.

**Requirements:**
- After logging injection, prompt: "Add a photo?" (optional)
- Open camera to capture:
  - Injection site photo (for tracking site rotation visually)
  - Pen/vial photo (for dosage verification)
- Store photos locally or in Supabase storage
- Display thumbnail in injection history
- Tap to view full size
- Include in PDF export if available

**Technical:**
- Use `expo-image-picker` for camera access
- Store in device gallery option
- Handle permissions gracefully

**Privacy:**
- Photos stored locally by default
- Opt-in for cloud sync
- Clear data deletion option

---

## Implementation Priority

### Phase 1: Competitive Parity (Weeks 1-2)
1. Medication Level Estimation
2. Weight Tracking
3. Body Diagram for Site Selection

### Phase 2: Complete Tracking Suite (Weeks 3-4)
4. Side Effect Logging
5. PDF Export

### Phase 3: Polish & Integrations (Weeks 5-6)
6. Apple Health / Google Fit Integration
7. Refill Reminders

### Phase 4: Nice-to-Have (Week 7+)
8. Photo Capture

---

## Design Direction

**Differentiator:** Adi Character
- NO other app has a mascot
- Lean into it more - more character expressions
- Character could "talk" (tips, encouragement)
- Different Adi outfits/accessories as rewards

**Positioning:** "The friendly GLP-1 journey companion"
- vs Shotsy's "The comprehensive tracker"
- Target: Users who feel overwhelmed by clinical apps, want encouragement
- Tone: Warm, supportive, celebratory vs cold, data-driven

---

## Technical Notes

- All features should work in "local mode" (no Supabase login required)
- Use existing `src/lib/localStorage.js` for AsyncStorage fallback
- Maintain compatibility with existing `AppStateContext`
- All new screens should use `useSafeAreaInsets` for OS UI overlap
- Test on both iOS and Android before deployment
