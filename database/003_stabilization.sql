-- Phase B.2 Stabilization Fixes
-- 1. Add onboarding completion flag
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_completed_onboarding BOOLEAN DEFAULT false;

-- 2. Ensure all existing users with injections are marked as onboarded
UPDATE public.profiles 
SET has_completed_onboarding = true 
WHERE id IN (SELECT user_id FROM public.injections);

-- 3. Simplified RPC for character state (no args needed)
CREATE OR REPLACE FUNCTION public.get_character_state()
RETURNS text AS $$
BEGIN
  RETURN public.get_character_state(auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Simplified RPC for streaks (no args needed)
CREATE OR REPLACE FUNCTION public.calculate_streak()
RETURNS TABLE(
  current_streak integer,
  longest_streak integer,
  next_scheduled_date date
) AS $$
BEGIN
  RETURN QUERY SELECT * FROM public.calculate_streak(auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Fix potential bug in get_character_state where it calls calculate_streak incorrectly
CREATE OR REPLACE FUNCTION public.get_character_state(p_user_id uuid)
RETURNS text AS $$
DECLARE
  v_last_injected timestamptz;
  v_next_due date;
  v_today date := now()::date;
  v_streak_record record;
BEGIN
  -- Get last injection date
  SELECT last_injected_at INTO v_last_injected
  FROM public.profiles WHERE id = p_user_id;
  
  -- Never logged = waiting state
  IF v_last_injected IS NULL THEN
    RETURN 'waiting';
  END IF;
  
  -- Calculate next due date
  SELECT * INTO v_streak_record FROM public.calculate_streak(p_user_id);
  v_next_due := v_streak_record.next_scheduled_date;
  
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
