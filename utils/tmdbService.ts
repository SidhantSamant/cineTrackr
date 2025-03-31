import { MovieResponse } from '@/models/Movie';
import { TVShowsResponse } from '@/models/Show';
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

export const getMovieDetails = async (id: number) => {
    try {
        return await tmdbClient.get<any>(`movie/${id}?language=en-US`);
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
