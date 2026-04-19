-- Phase H: Refill Reminders
-- 1. Add inventory tracking to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS doses_on_hand integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS refill_threshold integer DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_refill_date timestamp with time zone;
