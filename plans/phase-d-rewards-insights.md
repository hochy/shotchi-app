# Phase D: Rewards & Insights Plan

## Objective
Enhance the user experience with meaningful feedback, visual insights, and customization. This phase focuses on celebrating user consistency, providing medical utility (site rotation), and polishing the app's professional feel.

## Key Features

### 1. Enhanced Logging: Injection Site Tracking
- **Schema Update:** Add `injection_site` column to the `injections` table.
- **UI Update:** Add a visual selector (or simple list) in `LogShotScreen` to pick the site (e.g., Left Thigh, Right Thigh, Left Stomach, Right Stomach).
- **Utility:** Helps users follow medical advice to rotate sites to prevent tissue hardening.

### 2. Celebrations & Milestones
- **New Component:** `CelebrationModal` featuring confetti and a message from Adi.
- **Logic:** Trigger when a user reaches a streak milestone (4, 12, 26, 52 weeks).
- **Persistence:** Track "last milestone celebrated" in the profile to avoid repeat popups.

### 3. Advanced History & Stats (Visual Dashboard)
- **Dependency:** `react-native-chart-kit` & `react-native-svg`.
- **UI Revamp:** Transform the History screen into a dashboard.
- **Charts:** Monthly adherence rate (Line Chart) and site rotation distribution (Pie Chart).

### 4. Character Customization
- **Feature:** Allow users to change Adi's color (already in schema: `character_color`).
- **UI:** A color picker or preset swatches in `SettingsScreen`.
- **Dynamic Styling:** Update Adi's tint or background glow based on the selected color.

### 5. Professional Polish: Empty States & Skeletons
- **Empty States:** Add "Adi is waiting for your first shot" graphics when history is empty.
- **Skeletons:** Add shimmering placeholder loaders while fetching data from Supabase.

## Implementation Steps

1.  **Dependencies:** Install `react-native-svg`, `react-native-chart-kit`, and `react-native-confetti-cannon`.
2.  **Schema:** Create `database/004_phase_d_features.sql` for injection sites and milestone tracking.
3.  **Data Layer:** Update `database.js` and `AppStateContext.js`.
4.  **Screens:** 
    - Update `LogShotScreen` (Site selector).
    - Update `SettingsScreen` (Character color).
    - Revamp `HistoryScreen` (Dashboard + Charts).
    - Add `CelebrationModal` to `HomeScreen`.

## Verification & Testing
- Logging a shot with a site correctly saves and displays in history.
- Reaching a milestone triggers the confetti celebration exactly once.
- Charts correctly reflect the user's real injection data.
- Character color changes persist after app restart.
