-- Phase F: Medication Level Estimation
-- 1. Add dosage to profiles (preferred/current dose)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_dosage decimal(5,2) DEFAULT 0.25;

-- 2. Add dosage to injections (actual dose taken)
ALTER TABLE public.injections ADD COLUMN IF NOT EXISTS dosage decimal(5,2);

-- Update existing injections to a reasonable default if null
UPDATE public.injections SET dosage = 0.25 WHERE dosage IS NULL;
