import { MovieResponse } from '@/models/Movie';
import { MediaType, TVShowsResponse } from '@/models/Show';
import tmdbClient from './tmdbClient';
import { TrendingResponse } from '@/models/TrendingItem';

export const getDetails = async (type: MediaType, id: number) => {
    try {
        return await tmdbClient.get<any>(`${type}/${id}?language=en-US`);
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
        const data = await tmdbClient.get<MovieResponse | TVShowsResponse>(
            `${type}/${slug}?language=en-US&page=${pageParam}`,
        );
        return data?.results;
    } catch (error) {
        console.log(error);
    }
};

export const fetchTrendingList = async () => {
    try {
        const data = await tmdbClient.get<TrendingResponse>(`trending/all/day?language=en-US`);
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
