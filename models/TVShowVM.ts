// export interface TVShow {
//     adult: boolean;
//     backdrop_path: string | null;
//     genre_ids: number[];
//     id: number;
//     origin_country: string[];
//     original_language: string;
//     original_name: string;
//     overview: string;
//     popularity: number;
//     poster_path: string | null;
//     first_air_date: string;
//     name: string;
//     vote_average: number;
//     vote_count: number;
//     videos: {
//         results: VideoResult[];
//     };
//     credits: {
//         cast: CastMember[];
//     };
//     similar: TVSeriesResponse;
// }

import { BaseMediaVM } from './BaseMediaVM';
import { BaseResponseVM } from './BaseResponseVM';

// export interface TVSeriesResponse {
//     page: number;
//     results: TVShow[];
//     total_pages: number;
//     total_results: number;
// }

// export interface VideoResult {
//     id: string;
//     iso_639_1: string;
//     key: string;
//     name: string;
//     site: string; // "YouTube"
//     type: string; // "Trailer", "Teaser", "Featurette"
//     official: boolean;
// }

// export interface CastMember {
//     adult: boolean;
//     gender: number;
//     id: number;
//     known_for_department: string;
//     name: string;
//     original_name: string;
//     popularity: number;
//     profile_path: string | null;
//     character: string;
//     credit_id: string;
//     order: number;
// }

export interface TVShowVM extends BaseMediaVM {
    name: string;
    original_name: string;
    first_air_date: string;
    origin_country: string[];
    similar: BaseResponseVM<TVShowVM>;
}

export type TVSeriesResponse = BaseResponseVM<TVShowVM>;

export type MediaType = 'movie' | 'tv';
