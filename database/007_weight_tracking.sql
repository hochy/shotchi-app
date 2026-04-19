-- Phase E: Weight Tracking
-- Create weight_entries table for flexible logging
CREATE TABLE IF NOT EXISTS public.weight_entries (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  weight decimal(5,2) NOT NULL,
  unit text DEFAULT 'lbs' CHECK (unit IN ('lbs', 'kg')),
  logged_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.weight_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own weight entries" ON public.weight_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weight entries" ON public.weight_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weight entries" ON public.weight_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weight entries" ON public.weight_entries
  FOR DELETE USING (auth.uid() = user_id);

-- Index for faster trend lookups
CREATE INDEX IF NOT EXISTS idx_weight_entries_logged_at ON public.weight_entries(logged_at DESC);
