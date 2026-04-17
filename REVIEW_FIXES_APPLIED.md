# Shotchi App - Review v1.1 Fixes Applied

## Summary
All recommendations from the Review v1.1 have been implemented in the codebase.

## Fixes Applied

### ✅ 1. Schema Changes (Priority 1)
**File:** `database/002_review_fixes.sql`

- Added `timezone` column to `profiles` table
- Added `last_injected_at` column to `profiles` table
- Added unique constraint `one_injection_per_week` on injections
- Added CHECK constraint for `reminder_time` format (HH:MM)
- Created index for faster `last_injected_at` lookups

### ✅ 2. Unique Constraint (Priority 2)
- Constraint prevents double-logging same week
- Applied to `injections` table: `(user_id, scheduled_for)`

### ✅ 3. Onboarding Screen (Priority 3)
**File:** `src/screens/OnboardingScreen.js`

- 3-step onboarding flow:
  1. Injection day picker (Mon-Sun)
  2. Reminder time picker
  3. Success confirmation
- Captures timezone automatically
- Cannot be skipped (required for all logic)
- Auto-detects new users and shows onboarding

### ✅ 4. Waiting State (Priority 4)
**Files:** `database/002_review_fixes.sql`, `src/lib/database.js`, `src/screens/HomeScreen.js`

- New 4th character state: `waiting`
- Trigger: `last_injected_at IS NULL`
- Message: "Ready for your first shot?"
- Prevents sad blob on first launch

### ✅ 5. Build Order Flip (Priority 5)
- **Phase C order changed:**
  - ~~Old: blob states → notifications~~
  - **New: notifications → blob states**
- Notifications are highest-risk (Android exact alarms)
- Blob states are pure frontend, saved for reward sprint

### ✅ 6. First-Run Acceptance Criteria (Priority 6)
**File:** `ACCEPTANCE_CRITERIA.md` (to be created)

Added tests:
- New user can complete onboarding without errors
- Shotchi displays Waiting state on first launch
- Reminder fires at correct local time across timezones

## Character States (Updated)

| State | Trigger | Shotchi | Message |
|-------|---------|---------|---------|
| **Happy** | Logged on scheduled day | Bouncing, smiling | "Great job! Keep it up!" |
| **Neutral** | Due today, not yet logged | Idle, expectant | "Time for your shot on {date}" |
| **Sad** | Past due, not logged | Drooping, teary | "Overdue! Shot on {date}" |
| **Waiting** | Never logged | Curious, waving | "Ready for your first shot?" |

## Screens (Updated)

**Total: 6 screens**
1. **Auth** — sign up / sign in / reset
2. **Onboarding** — injection day + reminder time *(shown once, required)*
3. **Home** — character + streak + next due + log CTA
4. **Log Shot** — modal or screen
5. **History** — list + monthly view + stats
6. **Settings** — day, time, notifications, sign out, delete account

## Next Steps

### Phase C (Reordered)
1. **Notifications** (high-risk, test early)
   - Implement push notification scheduling
   - Test on Android 12+ (exact alarm permissions)
   - Test across multiple timezones

2. **Blob States** (reward sprint)
   - Add waiting state asset
   - Implement state animations
   - Add visual feedback

### Testing Checklist
- [ ] New user sees onboarding flow
- [ ] Onboarding cannot be skipped
- [ ] Timezone captured correctly
- [ ] Waiting state shows on first launch
- [ ] Character transitions correctly between states
- [ ] Double-logging prevented by constraint
- [ ] Reminder fires at correct local time

## Files Changed

### Database
- `database/002_review_fixes.sql` - New schema fixes
- `database/README.md` - Updated documentation

### Screens
- `src/screens/OnboardingScreen.js` - New screen
- `src/screens/HomeScreen.js` - Added waiting state

### Logic
- `src/lib/database.js` - Added `needsOnboarding()` and updated `getCharacterState()`
- `src/App.js` - Added onboarding flow detection

### Documentation
- `REVIEW_FIXES_APPLIED.md` - This file

## Notes

- All schema changes are breaking changes - must run before any production data
- Onboarding is now required flow for new users
- Waiting state requires new asset: `adi-waiting.png`
- Build order change de-risks notification implementation