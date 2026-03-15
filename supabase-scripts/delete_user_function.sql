-- Create a secure function for the app to call
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete the user from the master auth table
  DELETE FROM auth.users WHERE id = auth.uid();
  
  -- Cascades it to wipe their rows in user_library and user_episodes!
END;
$$;