import { MovieResponse } from '@/models/Movie';
import { MediaType, TVShowsResponse } from '@/models/Show';
import tmdbClient from './tmdbClient';

export const fetchTopRatedMovies = async ({ pageParam }: { pageParam: number }) => {
    try {
        const data = await tmdbClient.get<MovieResponse>(
            `movie/top_rated?language=en-US&page=${pageParam}`,
        );
        return data?.results;
    } catch (error) {
        console.log(error);
    }
};

export const getMovieDetails = async (type: MediaType, id: number) => {
    try {
        return await tmdbClient.get<any>(`${type}/${id}?language=en-US`);
    } catch (error) {
        console.log(error);
    }
};

export const fetchTopRatedTVShows = async ({ pageParam }: { pageParam: number }) => {
    try {
        const data = await tmdbClient.get<TVShowsResponse>(
            `tv/top_rated?language=en-US&page=${pageParam}`,
        );
        return data?.results;
    } catch (error) {
        console.log(error);
    }
};

export const getMovieCast = async (type: MediaType, movieId: number) => {
    try {
        const data = await tmdbClient.get<any>(`${type}/${movieId}/credits`);
        return data?.cast;
    } catch (error) {
        console.log(error);
    }
};
