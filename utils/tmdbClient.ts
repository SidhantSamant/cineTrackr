import ApiClient from './ApiClient';

class TmdbClient extends ApiClient {
    constructor(baseURL: string = 'https://api.themoviedb.org/3/') {
        const headers = {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_KEY}`,
        };
        super(baseURL, headers);
    }
}

export default new TmdbClient();
