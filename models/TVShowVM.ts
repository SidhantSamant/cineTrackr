import { BaseMediaVM } from './BaseMediaVM';
import { BaseResponseVM } from './BaseResponseVM';

export interface TVShowVM extends BaseMediaVM {
    name: string;
    original_name: string;
    first_air_date: string;
    origin_country: string[];
    media_type: 'tv';
    similar: BaseResponseVM<TVShowVM>;
}

export type TVSeriesResponse = BaseResponseVM<TVShowVM>;

export type MediaType = 'movie' | 'tv';
export type SearchType = 'multi' | 'movie' | 'tv';
