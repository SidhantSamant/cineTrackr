export type MediaStatus = 'watchlist' | 'watching' | 'completed' | 'dropped' | 'paused' | null;
export type MediaType = 'movie' | 'tv';

export default interface UserLibraryVM {
    id: string;
    user_id: string;
    tmdb_id: number;

    // Types
    media_type: MediaType;
    is_anime: boolean;

    // State
    status: MediaStatus;
    is_favorite: boolean;

    // Progress
    episodes_watched: number;
    total_episodes: number;
    current_season: number;

    // Metadata
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    series_status: string | null;
    release_date: string | null;
    last_air_date: string | null;
    score: number | null;

    // Timestamps
    created_at: string;
    updated_at: string;
    completed_at: string | null;
}
