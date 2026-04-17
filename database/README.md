# Shotchi Database Setup

## Overview
This schema provides the database foundation for Shotchi's injection tracking functionality.

## Setup Order
**Important:** Run SQL files in this order:
1. `001_schema.sql` - Base tables and core functions
2. `002_review_fixes.sql` - Review v1.1 fixes (timezone, waiting state, constraints)

## Tables

### `profiles`
User profile and settings
- `id` (uuid, PK) - Auth user ID
- `injection_day` (text) - Weekly injection day (monday-sunday)
- `reminder_time` (text) - Time for daily reminders (HH:MM format)
- `timezone` (text) - User's timezone (e.g., "America/Chicago")
- `last_injected_at` (timestamptz) - Denormalized for fast mood calculation
- `notifications_enabled` (boolean) - Push notification toggle
- `overdue_enabled` (boolean) - Overdue alert toggle
- `character_type` (text) - Character style (blob, cat, etc.)
- `character_color` (text) - Character color hex

### `injections`
Individual injection records
- `id` (uuid, PK) - Record ID
- `user_id` (uuid, FK) - User ID
- `logged_at` (timestamp) - When injection was logged
- `scheduled_for` (date) - Due date for injection
- `note` (text, nullable) - Optional notes
- **Unique constraint:** `(user_id, scheduled_for)` prevents double-logging

### `streaks`
Cached streak data for performance
- `id` (uuid, PK) - Streak record ID
- `user_id` (uuid, FK) - User ID
- `current_streak` (integer) - Current consecutive on-time
- `longest_streak` (integer) - Longest streak ever
- `updated_at` (timestamp) - Last update time

### `user_streaks`
View for easy streak access
- Combines streaks with profile data
- Includes injection_day and reminder_time

## Character States (Updated)
| State | Trigger | Shotchi |
|-------|---------|---------|
| **Happy** | Logged on scheduled day | Bouncing, smiling |
| **Neutral** | Due today, not yet logged | Idle, expectant |
| **Sad** | Past due, not logged | Drooping, teary |
| **Waiting** *(new)* | `last_injected_at IS NULL` | Curious, waving — *"Ready for your first shot?"* |

## Functions

### `get_character_state(user_id)`
Returns character mood based on injection status
- Returns: 'happy', 'neutral', 'sad', or 'waiting'

### `get_next_due_date(user_id)`
Calculates next injection date with timezone awareness
- Uses user's timezone for proper scheduling
- Returns timestamptz with reminder time

### `calculate_streak(user_id)`
Calculates current streak and next due date
- Returns: current_streak, longest_streak, next_scheduled_date

### `update_last_injected_at()`
Trigger that updates profile's last_injected_at
- Fires after every injection insert

## Setup Instructions

1. **Create Supabase project**
   ```bash
   # Go to supabase.com and create new project
   ```

2. **Run schema files in order**
   ```sql
   -- Run in Supabase SQL Editor
   -- File: 001_schema.sql
   -- File: 002_review_fixes.sql
   ```

3. **Verify RLS policies are active**
   - All tables have RLS enabled
   - Policies restrict access to user's own data only

4. **Update app config**
   ```js
   // src/lib/supabase.js
   const supabaseUrl = 'https://YOUR_PROJECT_REF.supabase.co'
   const supabaseAnonKey = 'YOUR_ANON_KEY'
   ```

5. **Test with sample data**
   ```sql
   -- Insert test user (must be authenticated)
   INSERT INTO profiles (id, injection_day, reminder_time, timezone)
   VALUES ('test-user-id', 'monday', '09:00', 'America/Chicago');

   -- Insert test injection
   INSERT INTO injections (user_id, scheduled_for, logged_at)
   VALUES ('test-user-id', '2026-04-13', '2026-04-13 09:00:00');
   ```

## Key Changes from Review v1.1

### Added Fields
- `timezone` - Critical for push notifications
- `last_injected_at` - Fast mood calculation

### Added Constraints
- `one_injection_per_week` - Prevents duplicate logging
- `reminder_time_format` - Enforces HH:MM format

### New Character State
- `waiting` - New user, never logged

### New Screen
- `OnboardingScreen` - Injection day + reminder setup (required)

## Security
- Row-level security (RLS) enabled on all tables
- Users can only access their own data
- Auth triggers handle profile creation
- No public access to sensitive data