import { MovieResponse, TmdbCollectionDetailVM } from '@/models/MovieVM';
import { SeasonVM } from '@/models/SeasonVM';
import { TrendingResponseVM } from '@/models/TrendingItemVM';
import { MediaType, TVSeriesResponse } from '@/models/TVShowVM';
import tmdbClient from './tmdbClient';

export const getDetails = async (type: MediaType, id: number) => {
    try {
        return await tmdbClient.get<any>(
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
        let params = new URLSearchParams({
            language: 'en-US',
            page: pageParam.toString(),
            include_adult: 'false',
        });

        const isAnime = slug.includes('anime');
        const isHiddenGem = slug.includes('hidden_gems');

        if (isAnime || isHiddenGem) {
            endpoint = `discover/${type}`;
            params.append('sort_by', 'popularity.desc');

            if (isAnime) {
                params.append('with_genres', '16'); // Animation genre
                params.append('with_original_language', 'ja'); // Japanese
            }

            if (isHiddenGem) {
                params.append('vote_count.gte', '150');

                const dateLimit = new Date();
                dateLimit.setMonth(dateLimit.getMonth() - 6);
                const formattedDate = dateLimit.toISOString().split('T')[0];
                params.append(
                    type === 'movie' ? 'release_date.lte' : 'first_air_date.lte',
                    formattedDate,
                );

                if (isAnime) {
                    params.append('vote_average.gte', '8.2');
                    params.append('vote_count.lte', '800');
                    params.append('popularity.lte', '35');
                } else {
                    params.append('vote_average.gte', '8.0');
                    params.append('vote_count.lte', type === 'movie' ? '2000' : '1000');
                    params.append('popularity.lte', type === 'movie' ? '70' : '40');
                }

                params.append('without_genres', '99,10763');
                params.set('sort_by', 'vote_average.desc');
            }

            if (slug === 'top_rated_anime') {
                params.set('sort_by', 'vote_average.desc');
                params.set('vote_count.gte', '250');
            }
        }

        const data = await tmdbClient.get<MovieResponse | TVSeriesResponse>(
            `${endpoint}?${params}`,
        );
        return data?.results || [];
    } catch (error) {
        console.log(error);
        return [];
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
