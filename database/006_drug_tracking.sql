-- Phase D+: Drug Tracking
-- 1. Add drug name to injections
ALTER TABLE public.injections ADD COLUMN IF NOT EXISTS drug_name text;

-- 2. Add preferred drug to profiles for smart defaults
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_drug text;
