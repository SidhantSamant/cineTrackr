-- Remove the old constraint
ALTER TABLE public.user_library 
DROP CONSTRAINT IF EXISTS user_library_user_id_fkey;

-- Add the new constraint with CASCADE
ALTER TABLE public.user_library 
ADD CONSTRAINT user_library_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;