export interface BaseMediaVM {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    original_language: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    vote_average: number;
    vote_count: number;
    videos: {
        results: VideoResultVM[];
    };
    credits: {
        cast: CastVM[];
    };
}

export interface VideoResultVM {
    id: string;
    iso_639_1: string;
    key: string;
    name: string;
    site: string; // "YouTube"
    type: string; // "Trailer", "Teaser", "Featurette"
    official: boolean;
}

export interface CastVM {
    adult: boolean;
    gender: number;
    id: number;
    known_for_department: string;
    name: string;
    original_name: string;
    popularity: number;
    profile_path: string | null;
    character: string;
    credit_id: string;
    order: number;
}

export type MediaType = 'movie' | 'tv';
