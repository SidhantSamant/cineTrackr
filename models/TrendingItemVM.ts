import { BaseResponseVM } from './BaseResponseVM';
import { MovieVM } from './MovieVM';
import { TVShowVM } from './TVShowVM';

export type TrendingItemVM =
    | (MovieVM & { media_type: 'movie' })
    | (TVShowVM & { media_type: 'tv' });

export type TrendingResponseVM = BaseResponseVM<TrendingItemVM>;
