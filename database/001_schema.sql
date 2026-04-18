-- Shotchi App Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  injection_day text NOT NULL DEFAULT 'monday' CHECK (injection_day IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  reminder_time text NOT NULL DEFAULT '09:00',
  notifications_enabled boolean NOT NULL DEFAULT true,
  overdue_enabled boolean NOT NULL DEFAULT true,
  character_type text NOT NULL DEFAULT 'blob',
  character_color text NOT NULL DEFAULT '#7BAF8E'
);

-- Create injections table
CREATE TABLE public.injections (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  logged_at timestamp with time zone DEFAULT now(),
  scheduled_for date NOT NULL,
  note text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create streaks table (for performance)
CREATE TABLE public.streaks (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone DEFAULT now()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_streaks_updated_at
  BEFORE UPDATE ON public.streaks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to calculate current streak
CREATE OR REPLACE FUNCTION public.calculate_streak(p_user_id uuid)
RETURNS TABLE(
  current_streak integer,
  longest_streak integer,
  next_scheduled_date date
) AS $$
DECLARE
  v_injection_day text;
  v_last_injection date;
  v_target_dow integer;
  v_current_dow integer;
  v_next_date date;
BEGIN
  -- Get injection day
  SELECT injection_day INTO v_injection_day FROM public.profiles WHERE id = p_user_id;
  
  -- Map day string to DOW (0=Sunday)
  v_target_dow := CASE v_injection_day
    WHEN 'sunday' THEN 0
    WHEN 'monday' THEN 1
    WHEN 'tuesday' THEN 2
    WHEN 'wednesday' THEN 3
    WHEN 'thursday' THEN 4
    WHEN 'friday' THEN 5
    WHEN 'saturday' THEN 6
  END;

  -- Get last injection date
  SELECT MAX(scheduled_for) INTO v_last_injection 
  FROM public.injections 
  WHERE user_id = p_user_id;
  
  -- Get calculated streaks from the table (simpler for now)
  SELECT s.current_streak, s.longest_streak INTO current_streak, longest_streak 
  FROM public.streaks s WHERE user_id = p_user_id;

  IF current_streak IS NULL THEN current_streak := 0; END IF;
  IF longest_streak IS NULL THEN longest_streak := 0; END IF;

  -- Calculate next scheduled date
  IF v_last_injection IS NULL THEN
    v_next_date := now()::date;
  ELSE
    v_next_date := v_last_injection + 7;
  END IF;

  -- Align to the correct day of week
  v_current_dow := EXTRACT(DOW FROM v_next_date);
  v_next_date := v_next_date + ((v_target_dow - v_current_dow + 7) % 7);
  
  -- If calculated date is still in the past, move forward
  WHILE v_next_date < now()::date LOOP
    v_next_date := v_next_date + 7;
  END LOOP;

  next_scheduled_date := v_next_date;
  
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql;

-- RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.injections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Injections policies
CREATE POLICY "Users can view their own injections" ON public.injections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own injections" ON public.injections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Streaks policies
CREATE POLICY "Users can view their own streaks" ON public.streaks
  FOR SELECT USING (auth.uid() = user_id);

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, injection_day, reminder_time)
  VALUES (new.id, 'monday', '09:00');
  
  INSERT INTO public.streaks (user_id, current_streak, longest_streak)
  VALUES (new.id, 0, 0);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to handle new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- View for streaks
CREATE OR REPLACE VIEW public.user_streaks AS
SELECT 
  s.user_id as id,
  s.current_streak,
  s.longest_streak,
  p.injection_day,
  p.reminder_time
FROM public.streaks s
JOIN public.profiles p ON s.user_id = p.id;
