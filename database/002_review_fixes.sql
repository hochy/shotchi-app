-- Shotchi Schema Fixes (Review v1.1)
-- Run after 001_schema.sql

-- Add timezone column (critical for push notifications)
ALTER TABLE public.profiles 
ADD COLUMN timezone text NOT NULL DEFAULT 'America/Chicago';

-- Add last_injected_at column (denormalized for fast mood calculation)
ALTER TABLE public.profiles 
ADD COLUMN last_injected_at timestamptz;

-- Add unique constraint on injections (prevent double-logging)
ALTER TABLE public.injections 
ADD CONSTRAINT one_injection_per_week 
UNIQUE (user_id, scheduled_for);

-- Add CHECK constraint for reminder_time format (HH:MM)
ALTER TABLE public.profiles 
ADD CONSTRAINT reminder_time_format 
CHECK (reminder_time ~ '^([01]\d|2[0-3]):[0-5]\d$');

-- Create index for faster last_injected_at lookups
CREATE INDEX idx_profiles_last_injected ON public.profiles(last_injected_at DESC);

-- Update handle_new_user to include timezone
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    injection_day, 
    reminder_time, 
    notifications_enabled, 
    overdue_enabled,
    timezone
  )
  VALUES (
    new.id,
    'monday',
    '09:00',
    true,
    true,
    'America/Chicago'
  );
  
  INSERT INTO public.streaks (user_id, current_streak, longest_streak)
  VALUES (new.id, 0, 0);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update last_injected_at when injection is logged
CREATE OR REPLACE FUNCTION public.update_last_injected_at()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET last_injected_at = NEW.logged_at
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_injection_logged
  AFTER INSERT ON public.injections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_last_injected_at();

-- Updated character state calculation (includes 'waiting' state)
CREATE OR REPLACE FUNCTION public.get_character_state(p_user_id uuid)
RETURNS text AS $$
DECLARE
  v_last_injected timestamptz;
  v_next_due date;
  v_today date := now()::date;
BEGIN
  -- Get last injection date
  SELECT last_injected_at INTO v_last_injected
  FROM public.profiles WHERE id = p_user_id;
  
  -- Never logged = waiting state
  IF v_last_injected IS NULL THEN
    RETURN 'waiting';
  END IF;
  
  -- Calculate next due date
  SELECT calculate_streak(p_user_id) INTO v_next_due;
  
  -- Check if overdue
  IF v_next_due < v_today THEN
    RETURN 'sad';
  -- Check if due today
  ELSIF v_next_due = v_today THEN
    RETURN 'neutral';
  -- Not due yet
  ELSE
    RETURN 'happy';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add timezone-aware next_due calculation
CREATE OR REPLACE FUNCTION public.get_next_due_date(p_user_id uuid)
RETURNS timestamptz AS $$
DECLARE
  v_injection_day text;
  v_timezone text;
  v_last_injected date;
  v_next_due date;
  v_target_dow int;
  v_current_dow int;
  v_days_until int;
BEGIN
  -- Get user settings
  SELECT injection_day, timezone INTO v_injection_day, v_timezone
  FROM public.profiles WHERE id = p_user_id;
  
  -- Get last injection
  SELECT MAX(scheduled_for) INTO v_last_injected
  FROM public.injections WHERE user_id = p_user_id;
  
  -- Map day name to dow number (0=sunday)
  v_target_dow := CASE v_injection_day
    WHEN 'sunday' THEN 0
    WHEN 'monday' THEN 1
    WHEN 'tuesday' THEN 2
    WHEN 'wednesday' THEN 3
    WHEN 'thursday' THEN 4
    WHEN 'friday' THEN 5
    WHEN 'saturday' THEN 6
  END;
  
  -- Calculate next due
  IF v_last_injected IS NULL THEN
    -- First injection: next occurrence of injection day
    v_current_dow := EXTRACT(DOW FROM now()::date);
    v_days_until := (v_target_dow - v_current_dow + 7) % 7;
    IF v_days_until = 0 THEN v_days_until := 7; END IF;
    v_next_due := now()::date + v_days_until;
  ELSE
    -- Next injection: 7 days after last
    v_next_due := v_last_injected + 7;
    
    -- Adjust to correct day of week if needed
    v_current_dow := EXTRACT(DOW FROM v_next_due);
    IF v_current_dow != v_target_dow THEN
      v_days_until := (v_target_dow - v_current_dow + 7) % 7;
      v_next_due := v_next_due + v_days_until;
    END IF;
  END IF;
  
  -- Return with timezone
  RETURN (v_next_due || ' 09:00:00')::timestamptz AT TIME ZONE v_timezone;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;