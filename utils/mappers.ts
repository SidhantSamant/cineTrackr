import { MovieVM } from '@/models/MovieVM';
import { TVShowVM } from '@/models/TVShowVM';
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
    } as UserLibraryVM;
};

export const mapLibraryToTmdb = (item: UserLibraryVM): TVShowVM | MovieVM => {
    const common = {
        id: item.tmdb_id,
        media_type: item.media_type,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        vote_average: item.score ?? 0,
    };

    if (item.media_type === 'tv') {
        return {
            ...common,
            name: item.title,
            original_name: item.title,
            first_air_date: item.release_date,
        } as TVShowVM;
    }

    return {
        ...common,
        title: item.title,
        original_title: item.title,
        release_date: item.release_date,
    } as MovieVM;
};
