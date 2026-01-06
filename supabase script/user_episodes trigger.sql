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
    status = CASE 
      -- A. Reset to Watchlist
      WHEN _new_count <= 0 THEN 'watchlist'::app_media_status

      -- B. Mark Complete
      WHEN COALESCE(total_episodes, 0) > 0 AND _new_count >= total_episodes THEN 'completed'::app_media_status
      
      -- C. Revert to Watching
      WHEN status = 'completed' AND _new_count < total_episodes THEN 'watching'::app_media_status
      
      -- D. Start Watching
      WHEN status = 'watchlist' AND _new_count > 0 THEN 'watching'::app_media_status
      
      -- E. Default
      ELSE status
    END
  WHERE user_id = _user_id AND tmdb_id = _tmdb_id AND media_type = 'tv';

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_episode_count
AFTER INSERT OR DELETE ON user_episodes
FOR EACH ROW
EXECUTE FUNCTION handle_episode_change();