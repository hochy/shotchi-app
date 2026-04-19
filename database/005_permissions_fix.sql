-- Phase D: Permissions Fix
-- Allow users to delete their own injections (required for the "Reset All Data" feature)
CREATE POLICY "Users can delete their own injections" ON public.injections
  FOR DELETE USING (auth.uid() = user_id);

-- Allow users to update their own streaks (required for resetting counters)
CREATE POLICY "Users can update their own streaks" ON public.streaks
  FOR UPDATE USING (auth.uid() = user_id);
