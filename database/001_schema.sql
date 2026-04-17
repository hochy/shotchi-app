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
CREATE OR REPLACE FUNCTION public.calculate_streak(user_id uuid)
RETURNS TABLE(
  current_streak integer,
  longest_streak integer,
  next_scheduled_date date
) AS $$
DECLARE
  injection_day text;
  last_injection date;
  streak_count integer := 0;
  max_streak integer := 0;
  temp_date date;
  next_date date;
BEGIN
  -- Get injection day
  SELECT injection_day INTO injection_day FROM public.profiles WHERE id = user_id;
  
  -- Get last injection date
  SELECT MAX(scheduled_for) INTO last_injection 
  FROM public.injections 
  WHERE user_id = user_id
  ORDER BY scheduled_for DESC;
  
  IF last_injection IS NULL THEN
    -- No injections yet
    current_streak := 0;
    longest_streak := 0;
    next_scheduled_date := now() + 
      CASE injection_day
        WHEN 'monday' THEN INTERVAL '1 day'
        WHEN 'tuesday' THEN INTERVAL '6 days'
        WHEN 'wednesday' THEN INTERVAL '5 days'
        WHEN 'thursday' THEN INTERVAL '4 days'
        WHEN 'friday' THEN INTERVAL '3 days'
        WHEN 'saturday' THEN INTERVAL '2 days'
        WHEN 'sunday' THEN INTERVAL '1 day'
      END;
    RETURN NEXT;
    RETURN;
  END IF;
  
  -- Calculate current streak
  temp_date := last_injection;
  streak_count := 0;
  
  WHILE streak_count < 52 LOOP -- Check up to 52 weeks
    temp_date := temp_date - INTERVAL '7 days';
    
    SELECT COUNT(*) INTO max_streak 
    FROM public.injections 
    WHERE user_id = user_id 
    AND scheduled_for = temp_date;
    
    IF max_streak > 0 THEN
      streak_count := streak_count + 1;
      max_streak := GREATEST(max_streak, streak_count);
    ELSE
      EXIT;
    END IF;
  END LOOP;
  
  current_streak := streak_count;
  longest_streak := GREATEST(
    (SELECT MAX(streak_count) FROM (
      SELECT COUNT(*) as streak_count 
      FROM public.injections 
      WHERE user_id = user_id 
      GROUP BY scheduled_for 
      ORDER BY scheduled_for
    ) as subq),
    0
  );
  
  -- Calculate next scheduled date
  next_date := last_injection + INTERVAL '7 days';
  
  -- If next date is in the past, get the next future injection day
  WHILE next_date < now()::date LOOP
    next_date := next_date + INTERVAL '1 day';
    
    -- Adjust to next injection day
    CASE injection_day
      WHEN 'monday' THEN
        CASE WHEN EXTRACT(DOW FROM next_date) = 1 THEN
          next_date := next_date
        ELSE
          next_date := next_date + (1 - EXTRACT(DOW FROM next_date)) || ' days'
        END;
      WHEN 'tuesday' THEN
        CASE WHEN EXTRACT(DOW FROM next_date) = 2 THEN
          next_date := next_date
        ELSE
          next_date := next_date + (2 - EXTRACT(DOW FROM next_date)) || ' days'
        END;
      WHEN 'wednesday' THEN
        CASE WHEN EXTRACT(DOW FROM next_date) = 3 THEN
          next_date := next_date
        ELSE
          next_date := next_date + (3 - EXTRACT(DOW FROM next_date)) || ' days'
        END;
      WHEN 'thursday' THEN
        CASE WHEN EXTRACT(DOW FROM next_date) = 4 THEN
          next_date := next_date
        ELSE
          next_date := next_date + (4 - EXTRACT(DOW FROM next_date)) || ' days'
        END;
      WHEN 'friday' THEN
        CASE WHEN EXTRACT(DOW FROM next_date) = 5 THEN
          next_date := next_date
        ELSE
          next_date := next_date + (5 - EXTRACT(DOW FROM next_date)) || ' days'
        END;
      WHEN 'saturday' THEN
        CASE WHEN EXTRACT(DOW FROM next_date) = 6 THEN
          next_date := next_date
        ELSE
          next_date := next_date + (6 - EXTRACT(DOW FROM next_date)) || ' days'
        END;
      WHEN 'sunday' THEN
        CASE WHEN EXTRACT(DOW FROM next_date) = 0 THEN
          next_date := next_date
        ELSE
          next_date := next_date + (7 - EXTRACT(DOW FROM next_date)) || ' days'
        END;
    END CASE;
  END LOOP;
  
  next_scheduled_date := next_date;
  
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

CREATE POLICY "Users can update their own injections" ON public.injections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own injections" ON public.injections
  FOR DELETE USING (auth.uid() = user_id);

-- Streaks policies
CREATE POLICY "Users can view their own streaks" ON public.streaks
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own streaks" ON public.streaks
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own streaks" ON public.streaks
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, injection_day, reminder_time, notifications_enabled, overdue_enabled)
  VALUES (
    new.id,
    'monday',
    '09:00',
    true,
    true
  );
  
  INSERT INTO public.streaks (user_id, current_streak, longest_streak)
  VALUES (
    new.id,
    0,
    0
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to handle new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create view for easy streak access
CREATE OR REPLACE VIEW public.user_streaks AS
SELECT 
  u.id,
  u.current_streak,
  u.longest_streak,
  p.injection_day,
  p.reminder_time
FROM public.streaks u
JOIN public.profiles p ON u.user_id = p.id;