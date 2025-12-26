// import { CastMember, VideoResult } from './Show';

import { BaseMediaVM } from './BaseMediaVM';
import { BaseResponseVM } from './BaseResponseVM';

export interface MovieVM extends BaseMediaVM {
    title: string;
    original_title: string;
    release_date: string;
    belongs_to_collection: TmdbMovieCollectionVM | null;
    media_type: 'movie';
    similar: BaseResponseVM<MovieVM>;
}

export interface TmdbMovieCollectionVM {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
}

export interface TmdbCollectionDetailVM {
    id: number;
    name: string;
    original_language: string;
    original_name: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    parts: MovieVM[];
}

export type MovieResponse = BaseResponseVM<MovieVM>;
