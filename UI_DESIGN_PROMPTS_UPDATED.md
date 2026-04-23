# Shotchi UI Design Prompts - UPDATED

Use these prompts with Google Stitch, Figma AI, Claude Artifacts, or any design tool to generate professional UI mockups for Shotchi.

---

## Brand Overview for Design Context

**App Name:** Shotchi
**Tagline:** "Your friendly GLP-1 journey companion"
**Core Differentiator:** Adi - a friendly character/mascot that reacts to user's injection schedule

**Target Audience:**
- Adults on GLP-1 medications (Ozempic, Wegovy, Mounjaro, Zepbound)
- Want tracking without feeling clinical/medical
- Need encouragement and celebration, not just data

**Design Tone:**
- Warm, approachable, friendly
- Modern but not sterile
- Celebratory (confetti for milestones)
- Character-forward (Adi is the face of the app)

**Color Palette:**
- Primary: #7BAF8E (sage green) - represents health, growth
- User-customizable accent colors:
  - #7B8EAF (blue)
  - #AF7B9C (pink)
  - #AF9C7B (amber)
  - #7BAFAF (teal)
- Background: #f5f5f5 (light gray) or white
- Text: #333 (dark gray), #666 (medium gray)
- Success: #7BAF8E, Warning: #F5A623, Error: #E74C3C

**Character - Adi:**
- Cute, rounded creature (not human, not animal - abstract friendly shape)
- 4 emotional states: Happy, Neutral, Sad, Waiting
- Changes expression based on injection status
- Can be "tinted" with user's chosen accent color

---

## Prompt 1: Home Screen Redesign

```
Design a mobile app home screen for "Shotchi" - a GLP-1 injection tracking app with a friendly mascot character.

Layout requirements:
- Large mascot character "Adi" at top center (takes 30% of screen height)
- Character has 4 states: happy (logged today), neutral (due today), sad (overdue), waiting (new user)
- Below character: greeting text "Good morning, [Name]!" with streak badge "🔥 4 weeks"
- Prominent CTA button: "Log Today's Shot" (rounded pill, primary green #7BAF8E)
- Quick stats row below button: "Next dose: Monday" | "Streak: 4 weeks" | "On-time: 92%"
- Bottom navigation: Home, History, Settings (minimal icons, pill-shaped active indicator)

Style:
- Light background (#f5f5f5) with subtle gradient
- Rounded corners on all cards (16-24px radius)
- Soft shadows (not harsh drop shadows)
- Playful but clean typography
- Character should feel hand-drawn, not corporate clip art
- Accent color should be customizable (user can change app theme)

The mascot "Adi" is:
- A rounded, blob-like creature (think: Totoro meets Kirby)
- Simple facial features: two dot eyes, small smile or frown
- No limbs, just a soft rounded body
- Glows subtly with the user's chosen accent color
- Expressive despite simplicity - joy looks genuinely happy, sad looks sympathetic

Output: High-fidelity mobile UI mockup (iPhone dimensions, 390x844px)
```

---

## Prompt 2: Log Shot Screen with Body Diagram

```
Design a mobile screen for logging a GLP-1 injection with visual body diagram.

Screen title: "Log Your Shot"

Layout:
- Date picker at top (shows current date, tap to change)
- Time picker below date (shows current time)
- Body diagram in center (takes 40% of screen):
  - Simplified human body outline (front view)
  - 6 touchable zones highlighted: Left/Right Thigh, Left/Right Stomach, Left/Right Arm
  - Selected zone highlights with accent color (#7BAF8E)
  - Recently used sites show small checkmarks (last 4 injections)
  - Sites needing rest are slightly faded/grayscale
- Below body diagram: selected site name "Left Thigh" with checkmark
- Drug selector row: chips/buttons for "Wegovy" "Ozempic" "Mounjaro" "Zepbound" "Saxenda"
- Optional note field at bottom (tap to add notes)
- Large "Confirm" button at bottom (primary color, full width)
- Cancel button as text link below confirm

Body diagram style:
- Clean, minimal illustration
- Not overly anatomical - think medical app meets friendly infographic
- Works in both light and dark mode
- Zones are clearly clickable (subtle highlight on hover/tap)
- Gender-neutral body shape

Output: High-fidelity mobile UI mockup showing state where user has selected "Left Thigh"
```

---

## Prompt 3: History Dashboard with Charts

```
Design a mobile history/dashboard screen for a GLP-1 tracking app.

Screen title: "Your Journey" at top

Layout (scrollable):
- Summary stats card at top:
  - Total injections: 24
  - On-time rate: 92%
  - Current streak: 4 weeks 🔥
  - Total weight lost: 18 lbs
- Two chart cards below (equal height, stacked):
  
  Chart 1 - Weight Trend:
  - Line chart showing weight over last 6 months
  - X-axis: months (Apr, May, Jun, Jul, Aug, Sep)
  - Y-axis: weight (180lbs → 162lbs)
  - Line color: #7BAF8E (primary green)
  - Dots on line for each injection date
  - Subtle fill below line
  - Clean gridlines, no axis labels clutter
  
  Chart 2 - Site Rotation:
  - Pie/donut chart showing injection site distribution
  - 6 segments: Left Thigh, Right Thigh, Left Stomach, Right Stomach, Left Arm, Right Arm
  - Legend below chart
  - Ideally balanced (shows good rotation)
  
- Injection history list below charts:
  - Cards with: Date, Drug, Site, Weight (if logged)
  - Most recent at top
  - Tap to expand for notes
  - "Load More" at bottom

Style:
- Cards with rounded corners, soft shadows
- Charts use app's customizable accent color
- Clean data visualization - no chart junk
- Stats are prominent but not overwhelming
- Empty state for new users: "No injections yet. Log your first shot!"

Output: High-fidelity mobile UI mockup showing dashboard with sample data
```

---

## Prompt 4: Side Effect Logging Screen

```
Design a mobile screen for logging side effects from GLP-1 medication.

Screen title: "How are you feeling?"

Layout:
- Question prompt: "Any side effects today?"
- Grid of quick-tap symptom buttons (2 columns, 5 rows):
  - 😣 Nausea
  - 😫 Fatigue
  - 😣 Constipation
  - 😫 Diarrhea
  - 🤕 Headache
  - 😵 Dizziness
  - 🤢 Stomach Pain
  - 🔥 Acid Reflux
  - 🎈 Bloating
  - 🍽️ Loss of Appetite
- Selected symptoms show checkmark and highlight color
- Severity slider below (appears after symptom selected):
  - Labels: "Mild" ———— "Moderate" ———— "Severe"
  - Slider thumb in accent color
- Optional notes field: "Add notes (optional)"
- Timestamp shows: "Today at 9:30 AM"
- "Save" button at bottom (primary color)
- "Skip" button as text link

Style:
- Symptoms are tappable cards, not just text
- Icons make it quick to scan and select
- Severity slider feels smooth, not clunky
- Friendly tone despite medical content
- "None today!" option if no symptoms

Output: High-fidelity mobile UI mockup showing 2 symptoms selected with severity slider
```

---

## Prompt 5: Medication Level Visualization

```
Design a mobile screen showing estimated medication levels in the body over time.

Screen title: "Medication Timeline"

Context: This shows how much GLP-1 medication is estimated to be in the user's system throughout the week. Helps them understand why side effects peak at certain times.

Layout:
- Large line chart taking 60% of screen height:
  - X-axis: Days (Day 1 through Day 7, weekly cycle)
  - Y-axis: Estimated medication level (0% to 100%)
  - Line shows: Peak after injection (day 1-2), gradual decline, trough before next dose
  - Shaded area under curve
  - Vertical line marker showing "today" in the cycle
  - Peak and trough points labeled
- Info card below chart:
  - "You're at 78% medication level"
  - "Side effects may peak in 1-2 days after injection"
  - "Your next dose is in 3 days"
- Legend: "Based on Semaglutide (Wegovy) - 7 day half-life"
- Toggle to switch between medications: Wegovy, Mounjaro, Ozempic, Zepbound

Style:
- Chart feels medical but approachable
- Color gradient on line: green (peak) to yellow (trough)
- "Today" marker is prominent
- Data is actionable, not just informational
- Works with app's customizable accent color

Output: High-fidelity mobile UI mockup showing medication level chart with "today" marker
```

---

## Prompt 6: Settings Screen

```
Design a mobile settings screen for a GLP-1 tracking app.

Screen title: "Settings"

Layout (grouped sections):
- Profile section:
  - User avatar (placeholder circle with initials)
  - Name: "Sarah"
  - Email: "sarah@email.com"
  - Chevron to edit
  
- Medication section:
  - "My Medication" row: "Wegovy 2.4mg" with dropdown
  - "Dose Day" row: "Monday" with dropdown
  - "Reminder Time" row: "9:00 AM" with time picker
  
- Preferences section:
  - "Adi's Color" row: Color swatches (green, blue, pink, amber, teal)
  - "Notifications" toggle: ON
  - "Apple Health Sync" toggle: OFF
  - "Dark Mode" toggle: OFF
  
- Data section:
  - "Export for Doctor" button
  - "Reset All Data" (red/destructive text)
  
- Account section:
  - "Sign Out" button

Style:
- iOS-style grouped settings (sections with headers)
- Clean rows with icons on left, values on right, chevrons for navigation
- Toggles are smooth, accent colored
- Destructive actions are clearly marked
- Color picker is visual swatches, not dropdown

Output: High-fidelity mobile UI mockup showing settings screen
```

---

## Prompt 7: Auth / Login Screen

```
Design a mobile authentication screen for a GLP-1 tracking app.

Screen title: "Shotchi"

Layout:
- Logo and mascot "Adi" at top (Adi is happy, welcoming)
- Subtitle: "Your GLP-1 Journey Companion"
- Two mode tabs at top: "Sign In" | "Sign Up" (sliding indicator)
- Form fields:
  - Email input (rounded, with icon)
  - Password input (rounded, show/hide toggle)
  - Confirm Password (only for Sign Up mode)
- Primary button: "Sign In" or "Create Account" (rounded pill, primary green)
- Divider: "or continue with"
- Social login buttons:
  - "Continue with Google" (white button, Google icon)
  - "Continue with Apple" (white button, Apple icon) 
- Link at bottom: "Forgot Password?" (tappable, accent color)
- Skip option: "Skip for now (use local data)" (text link)

Error states:
- Inline validation errors (red text below fields)
- Loading state: Spinner on button, "Signing in..."

Style:
- Clean, welcoming, not intimidating
- Large touch targets
- Soft shadows on inputs
- Works with app's character customization

Output: High-fidelity mobile UI mockup showing login mode
```

---

## Prompt 8: Profile Screen

```
Design a mobile profile/account screen for a GLP-1 tracking app.

Screen title: "My Profile"

Layout:
- Back button (top left): "← Settings"
- Profile card at top:
  - Avatar circle with user initial (accent color background)
  - User email below avatar
  - "Member since [Month Year]" subtitle
- Security section:
  - "Reset Password" row with "Send Email" link (accent color)
  - "Create an Account" row for guest users (links to auth)
- Data & Privacy section:
  - "Sync Status" row: badge showing "Cloud Active" or "Local Only"
  - Hint text for local-only users: "Log in to backup your data"
- Danger Zone (red/pink background):
  - Title: "Danger Zone" (red, uppercase)
  - "Delete Account & Data" button (red text, white background, red border)
- Sign Out button at bottom (red text, center aligned)

Style:
- Grouped sections (iOS settings style)
- Danger zone is clearly visually separated (light red background)
- Profile card has soft shadow, rounded corners
- Avatar uses customizable accent color

Output: High-fidelity mobile UI mockup showing profile screen
```

---

## Prompt 9: Celebration Modal

```
Design a celebration modal that appears when user reaches a milestone streak.

Modal context: User just logged their 4th consecutive week injection.

Layout:
- Centered modal card (80% of screen width)
- Large emoji at top: ✨🥳✨
- Title: "Milestone Reached!"
- Message: "1 Month Streak! You're glowing!"
- Confetti animation background (falling from top)
- Character "Adi" at bottom of modal, happy expression, bouncing gently
- Button: "Adi Rocks!" to dismiss

Animation notes:
- Modal scales up on appear (spring animation)
- Confetti falls continuously
- Adi has subtle bounce/pulse
- Button has satisfying tap feedback

Style:
- Celebratory but not childish
- Works for adults on serious medication journey
- Feels rewarding, encouraging
- Confetti is tasteful, not overwhelming

Output: High-fidelity mobile UI mockup showing celebration modal
```

---

## Prompt 10: Onboarding Flow

```
Design a 4-screen onboarding flow for a GLP-1 tracking app.

Screen 1 - Welcome:
- Large mascot "Adi" at top, happy expression
- Title: "Welcome to Shotchi"
- Subtitle: "Your friendly GLP-1 journey companion"
- 3 benefit bullets with icons:
  - 📅 Track your weekly injections
  - 🎉 Celebrate your milestones
  - 📊 Understand your progress
- "Get Started" button at bottom

Screen 2 - Select Medication:
- Title: "What medication are you taking?"
- Subtitle: "This helps us personalize your experience"
- Large cards for each medication:
  - Wegovy (semaglutide)
  - Ozempic (semaglutide)
  - Mounjaro (tirzepatide)
  - Zepbound (tirzepatide)
  - Saxenda (liraglutide)
- Each card shows: name, generic name, weekly/monthly badge
- Selected card has checkmark and accent border

Screen 3 - Choose Injection Day:
- Title: "When is your injection day?"
- Subtitle: "We'll remind you so you never miss a dose"
- Week day picker: Mon, Tue, Wed, Thu, Fri, Sat, Sun (pill buttons)
- Time picker below: "What time? [9:00 AM]"
- Calendar preview showing selected day highlighted

Screen 4 - All Set:
- Adi character bouncing, excited
- Title: "You're all set!"
- Message: "We'll remind you every [Monday] at [9:00 AM]"
- "Start Tracking" button

Style:
- Friendly, encouraging tone throughout
- Progress indicator at top (dots showing 1/4, 2/4, etc.)
- Large touch targets
- Minimal text, visual-first
- Works for first-time app users

Output: 4 high-fidelity mobile UI mockups showing complete onboarding flow
```

---

## Using These Prompts

### Google Stitch
1. Open Google Stitch
2. Paste the prompt directly
3. Optionally: upload existing app screenshots for reference
4. Iterate: "Make the mascot larger" "Use more rounded corners" "Try darker colors"

### Figma AI / Figma
1. Use Figma's AI features or create wireframes manually
2. Paste prompt as design reference
3. Use "Make Design" features to generate variations
4. Export as PNG/SVG for implementation

### Claude Artifacts / Design Tools
1. Paste prompt into Claude
2. Request "Create a React Native component" or "Generate design tokens"
3. Iterate with follow-up prompts
4. Use generated code as starting point

### Framer / Other No-Code Tools
1. Paste prompt as design brief
2. Use AI generate features
3. Customize colors/spacing to match Shotchi brand
4. Export design specs for dev handoff

---

## Design System Tokens

If tools need specific values, use these:

```css
/* Colors */
--primary: #7BAF8E;
--primary-dark: #5A8F6E;
--secondary: #7B8EAF;
--background: #f5f5f5;
--surface: #FFFFFF;
--text-primary: #333333;
--text-secondary: #666666;
--success: #7BAF8E;
--warning: #F5A623;
--error: #E74C3C;

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;
--spacing-2xl: 32px;
--spacing-3xl: 48px;

/* Typography */
--font-family: System UI (SF Pro on iOS, Roboto on Android)
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-md: 16px;
--font-size-lg: 18px;
--font-size-xl: 24px;
--font-size-2xl: 32px;

/* Border Radius */
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-xl: 24px;
--radius-full: 9999px;

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
```

---

## Notes for Designer

1. **Character is key** - Adi should feel hand-crafted, not AI-generated clip art
2. **Works in both themes** - Designs should support light mode (priority) and dark mode (future)
3. **Accessibility** - Touch targets minimum 44px, sufficient color contrast
4. **Animation-friendly** - Designs should consider motion (entrances, transitions, micro-interactions)
5. **Internationalization** - Leave room for longer text in other languages
6. **Tablets** - Designs should scale to iPad (consider split view layouts)
```
</tool_call>