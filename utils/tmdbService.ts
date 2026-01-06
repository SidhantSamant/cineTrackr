import { MovieResponse, TmdbCollectionDetailVM } from '@/models/MovieVM';
import { SeasonVM } from '@/models/SeasonVM';
import { TrendingResponseVM } from '@/models/TrendingItemVM';
import { MediaType, TVSeriesResponse } from '@/models/TVShowVM';
import tmdbClient from './tmdbClient';

interface FetchListParams {
    pageParam: number;
    type: MediaType;
    slug: string;
}

class TmdbService {
    public async getDetails(type: MediaType, id: number) {
        const params = new URLSearchParams({
            append_to_response: 'videos,recommendations,credits,watch/providers',
            language: 'en-US',
        });
        return tmdbClient.get<any>(`${type}/${id}`, params);
    }

    public async getListData({ pageParam, type, slug }: FetchListParams) {
        let endpoint = `${type}/${slug}`;
        const params = new URLSearchParams({
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
                params.append('with_genres', '16');
                params.append('with_original_language', 'ja');
            }

            if (isHiddenGem) {
                params.append('vote_count.gte', '150');
                const dateLimit = new Date();
                dateLimit.setMonth(dateLimit.getMonth() - 6);
                params.append(
                    type === 'movie' ? 'release_date.lte' : 'first_air_date.lte',
                    dateLimit.toISOString().split('T')[0],
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

        const data = await tmdbClient.get<MovieResponse | TVSeriesResponse>(endpoint, params);
        return data?.results || [];
    }

    public async getMovieCollection(collectionId: number) {
        return tmdbClient.get<TmdbCollectionDetailVM>(
            `collection/${collectionId}`,
            new URLSearchParams({ language: 'en-US' }),
        );
    }

    public async getSeasonDetails(seriesId: number, seasonNumber: number) {
        return tmdbClient.get<SeasonVM>(
            `tv/${seriesId}/season/${seasonNumber}`,
            new URLSearchParams({ language: 'en-US' }),
        );
    }

    public async getTrendingList() {
        const data = await tmdbClient.get<TrendingResponseVM>(
            'trending/all/day',
            new URLSearchParams({ language: 'en-US' }),
        );
        return data?.results || [];
    }

    public async getCast(type: MediaType, mediaId: number) {
        const data = await tmdbClient.get<any>(`${type}/${mediaId}/credits`);
        return data?.cast || [];
    }

    public async getAllEpisodes(tvId: number, seasonNumber: number) {
        const data = await tmdbClient.get<any>(`tv/${tvId}/season/${seasonNumber}/episodes`);
        return data?.cast || [];
    }

    public async getEpisodeDetail(tvId: number, seasonNum: number, episodeNum: number) {
        const params = new URLSearchParams({
            append_to_response: 'credits,images',
            language: 'en-US',
        });
        return tmdbClient.get<any>(`tv/${tvId}/season/${seasonNum}/episode/${episodeNum}`, params);
    }

    public async searchMedia(query: string, searchType: 'multi' | 'movie' | 'tv') {
        const params = new URLSearchParams({
            query,
            include_adult: 'false',
            language: 'en-US',
            page: '1',
        });

        const data = await tmdbClient.get<MovieResponse | TVSeriesResponse>(
            `search/${searchType}`,
            params,
        );
        const results = data?.results || [];

        if (searchType === 'movie')
            return results.map((item) => ({ ...item, media_type: 'movie' }));
        if (searchType === 'tv') return results.map((item) => ({ ...item, media_type: 'tv' }));

        return results.filter((x: any) => x.media_type === 'movie' || x.media_type === 'tv');
    }
}

export const tmdbService = new TmdbService();
