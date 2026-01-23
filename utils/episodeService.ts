import { supabase } from '@/lib/supabase';
import UserEpisodeVM from '@/models/UserEpisodeVM';
import UserLibraryVM from '@/models/UserLibraryVM';

interface SeasonData {
    season_number: number;
    episode_count: number;
}

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
        const {
            data: { user },
        } = await supabase.auth.getUser();
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

    // services/EpisodeService.ts

    public async toggleSeason(
        show: UserLibraryVM,
        seasonNumber: number,
        episodeCount: number,
        markAsWatched: boolean,
    ) {
        const {
            data: { user },
        } = await supabase.auth.getUser();
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
     * Marks an entire show as completed by bulk-inserting all episodes.
     * The DB Trigger will see the massive jump in count and set status='completed'.
     */
    public async markShowCompleted(show: UserLibraryVM, seasons: SeasonData[]) {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error('User not logged in');

        // 1. Ensure Library Item Exists first
        const { error: libError } = await supabase.from('user_library').upsert(
            {
                ...show,
                user_id: user.id,
                status: 'completed', // We can proactively set this here
            },
            { onConflict: 'user_id, tmdb_id, media_type' },
        );
        if (libError) throw libError;

        // 2. Generate ALL episode rows in memory
        const allEpisodes: any[] = [];

        seasons.forEach((season) => {
            // Skip Specials (Season 0) for completion logic usually
            if (season.season_number === 0) return;

            for (let ep = 1; ep <= season.episode_count; ep++) {
                allEpisodes.push({
                    user_id: user.id,
                    tmdb_id: show.tmdb_id,
                    season_number: season.season_number,
                    episode_number: ep,
                    is_watched: true,
                    // watched_at: new Date().toISOString(),
                });
            }
        });

        // 3. Bulk Upsert (The magic step)
        // Supabase handles large batches well, but if you have 1000+ eps (One Piece),
        // you might want to chunk this. For standard shows, one batch is fine.
        const { error } = await supabase.from('user_episodes').upsert(allEpisodes, {
            onConflict: 'user_id, tmdb_id, season_number, episode_number',
            ignoreDuplicates: true, // Crucial: Don't overwrite existing timestamps
        });

        if (error) throw error;
    }

    /**
     * Fetch all watched episodes for a specific season of a show.
     * Used to populate the checkboxes in the UI.
     */
    public async getWatchedEpisodes(
        tmdbId: number,
        seasonNumber: number,
    ): Promise<UserEpisodeVM[]> {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        // If no user, return empty (don't throw, just show nothing watched)
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
