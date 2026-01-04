-- 1. Create Enums for strict type safety
CREATE TYPE app_media_type AS ENUM ('movie', 'tv');
CREATE TYPE app_media_status AS ENUM ('watchlist', 'watching', 'completed', 'dropped', 'paused');

-- 2. Create the Main Library Table
CREATE TABLE user_library (
  -- Identity
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tmdb_id INTEGER NOT NULL,
  
  -- Filters & Classification
  media_type app_media_type NOT NULL,
  is_anime BOOLEAN DEFAULT FALSE, 
  -- State & Status
  status app_media_status,
  is_favorite BOOLEAN DEFAULT FALSE,
  
  -- User Content
  episodes_watched INTEGER DEFAULT 0, 
  total_episodes INTEGER DEFAULT 0, 
  current_season INTEGER DEFAULT 1,
  
  -- Media Metadata
  title TEXT NOT NULL,
  poster_path TEXT,
  backdrop_path TEXT,
  release_date DATE,
  last_air_date DATE,
  series_status VARCHAR(50),
  score DECIMAL(3, 1) CHECK (score >= 0 AND score <= 10),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Constraints (Prevents duplicate entries)
  UNIQUE(user_id, tmdb_id, media_type)
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE user_library ENABLE ROW LEVEL SECURITY;

-- 4. Create Security Policies (Strict Ownership)

-- VIEW: Users see ONLY their own data
CREATE POLICY "Users view own items" 
ON user_library FOR SELECT 
USING (auth.uid() = user_id);

-- INSERT: Users insert as themselves
CREATE POLICY "Users insert own items" 
ON user_library FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users update their own rows (and cannot transfer ownership)
CREATE POLICY "Users update own items" 
ON user_library FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- DELETE: Users delete their own rows
CREATE POLICY "Users delete own items" 
ON user_library FOR DELETE 
USING (auth.uid() = user_id);

-- 5. Create Performance Indexes
CREATE INDEX idx_library_user_status ON user_library(user_id, status);
CREATE INDEX idx_library_is_anime ON user_library(user_id, is_anime) WHERE is_anime = TRUE;
CREATE INDEX idx_library_tmdb_lookup ON user_library(tmdb_id);

-- 6. Smart Trigger for Timestamps (Automatically updates 'updated_at' and sets/unsets 'completed_at')
CREATE OR REPLACE FUNCTION handle_library_updates()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   
   IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
       NEW.completed_at = NOW();
   END IF;

   IF OLD.status = 'completed' AND NEW.status != 'completed' THEN
       NEW.completed_at = NULL;
   END IF;

   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_library_updates
    BEFORE UPDATE ON user_library
    FOR EACH ROW
    EXECUTE PROCEDURE handle_library_updates();