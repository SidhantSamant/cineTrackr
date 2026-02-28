import { supabase } from '@/lib/supabase';
import UserEpisodeVM from '@/models/UserEpisodeVM';
import UserLibraryVM from '@/models/UserLibraryVM';
import { useAuthStore } from '@/store/useAuthStore';

class EpisodeService {
    /**
     * Toggles a single episode's watched status.
     * If watching: Ensures the show exists in the library, then adds the episode.
     * If unwatching: Removes the episode.
     * The DB Trigger handles updating the 'episodes_watched' count.
     */
    public async toggleEpisode(
        show: UserLibraryVM,
        season: number,
        episode: number,
        markAsWatched: boolean,
    ) {
        const user = useAuthStore.getState().user;
        if (!user) throw new Error('User not logged in');

        if (markAsWatched) {
            const { error: libError } = await supabase.from('user_library').upsert(show, {
                onConflict: 'user_id, tmdb_id, media_type',
                ignoreDuplicates: true,
            });

            if (libError) throw libError;

            const { error } = await supabase.from('user_episodes').upsert({
                user_id: user.id,
                tmdb_id: show.tmdb_id,
                season_number: season,
                episode_number: episode,
                // watched_at: new Date().toISOString(),
            });
            if (error) throw error;
        } else {
            const { error } = await supabase.from('user_episodes').delete().match({
                user_id: user.id,
                tmdb_id: show.tmdb_id,
                season_number: season,
                episode_number: episode,
            });
            if (error) throw error;
        }
    }

    public async toggleSeason(
        show: UserLibraryVM,
        seasonNumber: number,
        episodeCount: number,
        markAsWatched: boolean,
    ) {
        const user = useAuthStore.getState().user;
        if (!user) throw new Error('User not logged in');

        if (markAsWatched) {
            const { error: libError } = await supabase.from('user_library').upsert(show, {
                onConflict: 'user_id, tmdb_id, media_type',
                ignoreDuplicates: true,
            });

            if (libError) throw libError;

            const episodes = Array.from({ length: episodeCount }, (_, i) => ({
                user_id: user.id,
                tmdb_id: show.tmdb_id,
                season_number: seasonNumber,
                episode_number: i + 1,
                // watched_at: new Date().toISOString(),
            }));

            const { error } = await supabase.from('user_episodes').upsert(episodes, {
                onConflict: 'user_id, tmdb_id, season_number, episode_number',
                ignoreDuplicates: true,
            });

            if (error) throw error;
        } else {
            const { error } = await supabase.from('user_episodes').delete().match({
                user_id: user.id,
                tmdb_id: show.tmdb_id,
                season_number: seasonNumber,
            });

            if (error) throw error;
        }
    }

    /**
     * Toggles an entire show's watched status.
     * If true: Marks as 'completed' and bulk-inserts all released episodes.
     * If false: Marks as 'watching' and clears all episode history for this show.
     */
    public async toggleShowWatched(tmdbData: any, isWatched: boolean) {
        const user = useAuthStore.getState().user;
        if (!user) throw new Error('User not logged in');

        if (isWatched) {
            const allEpisodes: any[] = [];
            const lastSeason = tmdbData?.last_episode_to_air?.season_number || 999;
            const lastEp = tmdbData?.last_episode_to_air?.episode_number || 9999;

            (tmdbData?.seasons || []).forEach((s: any) => {
                if (s.season_number === 0 || s.season_number > lastSeason) return;

                const limit =
                    s.season_number === lastSeason
                        ? Math.min(s.episode_count || 0, lastEp)
                        : s.episode_count || 0;

                for (let i = 1; i <= limit; i++) {
                    allEpisodes.push({
                        user_id: user.id,
                        tmdb_id: tmdbData.id,
                        season_number: s.season_number,
                        episode_number: i,
                    });
                }
            });

            if (allEpisodes.length > 0) {
                const { error } = await supabase.from('user_episodes').upsert(allEpisodes, {
                    onConflict: 'user_id, tmdb_id, season_number, episode_number',
                    ignoreDuplicates: true,
                });
                if (error) throw error;
            }
        } else {
            const { error } = await supabase
                .from('user_episodes')
                .delete()
                .match({ user_id: user.id, tmdb_id: tmdbData.id });
            if (error) throw error;
        }
    }

    /**
     * Fetch all watched episodes for a specific season of a show.
     * Used to populate the checkboxes in the UI.
     */
    public async getWatchedEpisodes(
        tmdbId: number,
        seasonNumber: number,
    ): Promise<UserEpisodeVM[]> {
        const user = useAuthStore.getState().user;

        if (!user) return [];

        const { data, error } = await supabase
            .from('user_episodes')
            .select('*')
            .eq('user_id', user.id)
            .eq('tmdb_id', tmdbId)
            .eq('season_number', seasonNumber);

        if (error) throw error;

        return data as UserEpisodeVM[];
    }
}

export const episodeService = new EpisodeService();
