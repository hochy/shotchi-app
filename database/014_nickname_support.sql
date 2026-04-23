-- Phase L: Nickname Support
-- Add nickname column to profiles for better personalization
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nickname text;
