import { Movie } from './Movie';
import { TVShow } from './Show';

export type TrendingItem = (Movie & { media_type: 'movie' }) | (TVShow & { media_type: 'tv' });

export interface TrendingResponse {
    page: number;
    results: TrendingItem[];
    total_pages: number;
    total_results: number;
}
