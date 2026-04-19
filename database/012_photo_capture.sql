-- Phase J: Photo Capture
-- 1. Add photo URL to injections
ALTER TABLE public.injections ADD COLUMN IF NOT EXISTS photo_url text;
