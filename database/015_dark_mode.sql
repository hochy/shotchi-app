-- Phase M: Dark Mode Support
-- Add dark_mode column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dark_mode boolean DEFAULT false;
