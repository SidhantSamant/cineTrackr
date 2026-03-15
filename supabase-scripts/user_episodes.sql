CREATE TABLE user_episodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Link to TMDB
  tmdb_id INTEGER NOT NULL, 
  season_number INTEGER NOT NULL,
  episode_number INTEGER NOT NULL,
  
  watched_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicates
  UNIQUE(user_id, tmdb_id, season_number, episode_number)
);

-- Fast Indexing
CREATE INDEX idx_user_episodes_lookup ON user_episodes(user_id, tmdb_id);

-- Enable Security
ALTER TABLE user_episodes ENABLE ROW LEVEL SECURITY;

-- Add RLS Policies
CREATE POLICY "Users manage own episodes" 
ON user_episodes 
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);