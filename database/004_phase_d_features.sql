-- Phase D: Advanced Features
-- 1. Add injection site tracking
ALTER TABLE public.injections ADD COLUMN IF NOT EXISTS injection_site text;

-- 2. Add milestone tracking to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_milestone_celebrated integer DEFAULT 0;

-- 3. Update character color default if needed (optional, keeping current)
-- ALTER TABLE public.profiles ALTER COLUMN character_color SET DEFAULT '#7BAF8E';
