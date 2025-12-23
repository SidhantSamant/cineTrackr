import { MovieResponse, MovieVM, TmdbCollectionDetailVM } from '@/models/MovieVM';
import { MediaType, TVSeriesResponse, TVShowVM } from '@/models/TVShowVM';
import tmdbClient from './tmdbClient';
import { TrendingResponseVM } from '@/models/TrendingItemVM';
import { SeasonVM } from '@/models/SeasonVM';

export const getDetails = async (type: MediaType, id: number) => {
    try {
        return await tmdbClient.get<any>(
            `${type}/${id}?append_to_response=videos,similar,credits&language=en-US`,
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
        const data = await tmdbClient.get<MovieResponse | TVSeriesResponse>(
            `${type}/${slug}?language=en-US&page=${pageParam}`,
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
