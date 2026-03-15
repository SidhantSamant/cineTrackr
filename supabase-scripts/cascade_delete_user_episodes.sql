-- Remove the old constraint
ALTER TABLE public.user_episodes 
DROP CONSTRAINT IF EXISTS user_episodes_user_id_fkey;

-- Add the new constraint with CASCADE
ALTER TABLE public.user_episodes 
ADD CONSTRAINT user_episodes_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;