-- Phase K: Account Deletion
-- Function to allow a user to delete their own account and all associated data
-- Note: Profiles and Streaks are already set to ON DELETE CASCADE in previous migrations
-- but this function provides a clean, single-call way to initiate the wipe.

CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void AS $$
BEGIN
  -- 1. Delete injections (Cascade usually handles this, but being explicit)
  DELETE FROM public.injections WHERE user_id = auth.uid();
  
  -- 2. Delete weight entries
  DELETE FROM public.weight_entries WHERE user_id = auth.uid();
  
  -- 3. Delete side effects
  DELETE FROM public.side_effects WHERE user_id = auth.uid();
  
  -- 4. Delete the profile (which triggers cascade to streaks)
  DELETE FROM public.profiles WHERE id = auth.uid();
  
  -- 5. Final deletion of the auth user is handled by a separate Supabase Management API call
  -- or simply by the fact that the user is now "ghosted" and can be purged by an admin.
  -- For standard RLS apps, deleting the 'profile' is the primary data wipe.
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
