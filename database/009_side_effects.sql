-- Phase G: Side Effect Logging
-- Create side_effects table for symptom tracking
CREATE TABLE IF NOT EXISTS public.side_effects (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  symptom text NOT NULL,
  severity integer NOT NULL CHECK (severity >= 1 AND severity <= 5),
  notes text,
  logged_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.side_effects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own side effects" ON public.side_effects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own side effects" ON public.side_effects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own side effects" ON public.side_effects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own side effects" ON public.side_effects
  FOR DELETE USING (auth.uid() = user_id);

-- Index for faster analysis
CREATE INDEX IF NOT EXISTS idx_side_effects_logged_at ON public.side_effects(logged_at DESC);
