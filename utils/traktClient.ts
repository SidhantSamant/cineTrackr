import ApiClient from './ApiClient';

class TraktClient extends ApiClient {
    constructor(baseURL: string = 'https://api.trakt.tv/') {
        const headers = {
            accept: 'application/json',
            'trakt-api-version': '2',
            'trakt-api-key': process.env.EXPO_PUBLIC_TRAKT_KEY ?? '',
        };
        super(baseURL, headers);
    }
}

export default new TraktClient();
