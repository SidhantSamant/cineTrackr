import { CastVM } from './BaseMediaVM';

export interface SeasonVM {
    _id: string;
    id: number;
    name: string;
    overview: string;
    air_date: string;
    poster_path: string | null;
    season_number: number;
    vote_average: number;
    episodes: EpisodeVM[];
    networks: NetworkVM[];
}

export interface EpisodeVM {
    id: number;
    name: string;
    overview: string;
    air_date: string;
    episode_number: number;
    season_number: number;
    episode_type: string;
    runtime: number | null;
    show_id: number;
    still_path: string | null;
    vote_average: number;
    vote_count: number;
    crew: CastVM[];
}

export interface NetworkVM {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
}
