CREATE OR REPLACE FUNCTION handle_episode_change()
RETURNS TRIGGER AS $$
DECLARE
  _tmdb_id INT := COALESCE(NEW.tmdb_id, OLD.tmdb_id);
  _user_id UUID := COALESCE(NEW.user_id, OLD.user_id);
  _new_count INT;
BEGIN
  -- Count actual rows
  SELECT count(*) INTO _new_count 
  FROM user_episodes 
  WHERE user_id = _user_id AND tmdb_id = _tmdb_id;

  -- Update Library Status
  UPDATE user_library
  SET 
    episodes_watched = _new_count,
    updated_at = NOW(),
    status = CASE 
      -- A. Zero episodes watched? It belongs in the watchlist.
      WHEN _new_count <= 0 THEN 'watchlist'::app_media_status

      -- B. Reached the end? Mark as completed. 
      WHEN COALESCE(total_episodes, 0) > 0 AND _new_count >= total_episodes THEN 'completed'::app_media_status

      -- C. Has at least 1 episode, but isn't done? It is ALWAYS 'watching'.
      WHEN _new_count > 0 THEN 'watching'::app_media_status

      ELSE status
    END

  WHERE user_id = _user_id AND tmdb_id = _tmdb_id AND media_type = 'tv';

  RETURN NULL;
END;
$$ LANGUAGE plpgsql; 

DROP TRIGGER IF EXISTS trigger_sync_episode_count ON user_episodes;

CREATE TRIGGER trigger_sync_episode_count
AFTER INSERT OR DELETE ON user_episodes
FOR EACH ROW
EXECUTE FUNCTION handle_episode_change();