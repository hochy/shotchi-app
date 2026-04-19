-- Phase I: Health Integration
-- 1. Add health sync settings to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS health_sync_enabled boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_health_sync timestamp with time zone;
