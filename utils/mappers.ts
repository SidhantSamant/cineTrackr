import UserLibraryVM, { MediaType } from '@/models/UserLibraryVM';

type TmdbData = any;

export const mapTmdbToLibraryItem = (user_id: string, data: TmdbData, type: MediaType) => {
    const isAnime = data.original_language === 'ja' && data.genres?.some((g: any) => g.id === 16);

    const releaseDate = type === 'movie' ? data.release_date : data.first_air_date;

    const title = type === 'movie' ? data.title : data.name;

    const totalEpisodes = type === 'movie' ? 1 : data.number_of_episodes || 0;

    return {
        user_id,
        tmdb_id: data.id,
        media_type: type,
        is_anime: !!isAnime,

        // Metadata
        title: title,
        poster_path: data.poster_path,
        backdrop_path: data.backdrop_path,
        series_status: data.status, // "Ended", "Returning Series"
        release_date: releaseDate,
        last_air_date: data.last_air_date,

        // Ratings & Progress
        score: data.vote_average,
        total_episodes: totalEpisodes,
        episodes_watched: 0,
        current_season: 1,
    };
};
