import { MovieResponse, MovieVM, TmdbCollectionDetailVM } from '@/models/MovieVM';
import { MediaType, TVSeriesResponse, TVShowVM } from '@/models/TVShowVM';
import tmdbClient from './tmdbClient';
import { TrendingResponseVM } from '@/models/TrendingItemVM';
import { SeasonVM } from '@/models/SeasonVM';

export const getDetails = async (type: MediaType, id: number) => {
    try {
        return await tmdbClient.get<any>(
            // `${type}/${id}?append_to_response=videos,similar,credits&language=en-US`,
            `${type}/${id}?append_to_response=videos,recommendations,credits,watch/providers&language=en-US`,
        );
    } catch (error) {
        console.log(error);
    }
};
export const fetchListData = async ({
    pageParam,
    type,
    slug,
}: {
    pageParam: number;
    type: MediaType;
    slug: string;
}) => {
    try {
        let endpoint = `${type}/${slug}`;
        let params = `language=en-US&page=${pageParam}`;

        if (slug === 'trending_anime') {
            endpoint = `discover/tv`;
            params += `&with_genres=16&with_original_language=ja&sort_by=popularity.desc&include_adult=false`;
        } else if (slug === 'top_rated_anime') {
            endpoint = `discover/tv`;
            params += `&with_genres=16&with_original_language=ja&sort_by=vote_average.desc&vote_count.gte=250&include_adult=false`;
        }

        const data = await tmdbClient.get<MovieResponse | TVSeriesResponse>(
            `${endpoint}?${params}`,
        );
        return data?.results;
    } catch (error) {
        console.log(error);
    }
};

export const getMovieCollection = async (collectionId: number) => {
    try {
        const data = await tmdbClient.get<TmdbCollectionDetailVM>(
            `collection/${collectionId}?language=en-US`,
        );
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const fetchSeasonDetails = async (seriesId: number, seasonNumber: number) => {
    try {
        const data = await tmdbClient.get<SeasonVM>(
            `tv/${seriesId}/season/${seasonNumber}?language=en-US`,
        );
        return data;
    } catch (error) {
        console.log(error);
    }
};

export const fetchTrendingList = async () => {
    try {
        const data = await tmdbClient.get<TrendingResponseVM>(`trending/all/day?language=en-US`);
        return data?.results;
    } catch (error) {
        console.log(error);
    }
};

export const getCast = async (type: MediaType, movieId: number) => {
    try {
        const data = await tmdbClient.get<any>(`${type}/${movieId}/credits`);
        return data?.cast;
    } catch (error) {
        console.log(error);
    }
};

export const getAllEpisodes = async (tvId: number, seasonNumber: number) => {
    try {
        const data = await tmdbClient.get<any>(`tv/${tvId}/season/${seasonNumber}/episodes`);
        return data?.cast;
    } catch (error) {
        console.log(error);
    }
};

export const searchMedia = async (searchQuery: string, searchType: 'multi' | 'movie' | 'tv') => {
    try {
        const data = await tmdbClient.get<MovieResponse | TVSeriesResponse>(
            `search/${searchType}?query=${searchQuery}&include_adult=false&language=en-US&page=1`,
        );

        const results = data?.results || [];

        if (searchType === 'movie') {
            return results.map((item) => ({ ...item, media_type: 'movie' }));
        }

        if (searchType === 'tv') {
            return results.map((item) => ({ ...item, media_type: 'tv' }));
        }

        return results.filter((x) => x.media_type === 'movie' || x.media_type === 'tv');
    } catch (error) {
        console.log(error);
    }
};
