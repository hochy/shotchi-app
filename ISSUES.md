# Shotchi Known Issues

This document tracks known bugs, UI issues, and other problems that need to be addressed.

## UI/UX Issues

### 1. Onboarding: Day Selection Layout
**Location:** "When is your injection day?" screen during onboarding.
**Description:** The weekday selection pills (Mon, Tue, Wed, etc.) are horizontally compressed/squished. The text overlaps with the pill borders, particularly for days like "Wed", "Sat", and "Sun", making them appear as narrow vertical ovals rather than properly sized buttons.
**Platform:** Web (Expo Web)

### 2. Log Your Shot: Body Diagram Overflow
**Location:** "Log Your Shot" screen (modal/drawer).
**Description:** The interactive body diagram for selecting the injection site (L ARM, R ARM, L STOM, etc.) does not properly fit within its container. The diagram is excessively large and overflows its bounds, leading to an unpolished and misaligned layout.
**Platform:** Web (Expo Web)

### 3. Settings: Toggle Switches Appearance
**Location:** Settings screen.
**Description:** The toggle switches for "Health App Sync" and "Dark Mode" appear as empty grey circles (similar to unselected radio buttons) rather than standard toggle switches. They do not clearly indicate on/off state.
**Platform:** Web (Expo Web)

### 4. Weight Log: Input Field Styling
**Location:** "Log Weight" modal.
**Description:** The text input field for entering weight has a default browser focus ring (a blue outline) that clashes with the app's custom aesthetic. Additionally, the text inside the input field appears slightly misaligned vertically.
**Platform:** Web (Expo Web)

### 5. Awards: Missing Streak Number
**Location:** Achievements / Awards screen.
**Description:** The main streak card at the top displays the text "-Week Streak!" instead of including the actual number of weeks (e.g., "0-Week Streak!"). It appears the variable is missing or resolving to an empty string.
**Platform:** Web (Expo Web)
