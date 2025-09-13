import tmdbClient from './tmdbClient';
import traktClient from './traktClient';

async function getAllShowData(tmdbId: number) {
    try {
        // Step 1: Get Trakt ID
        const traktShowId = await getTraktShowIdFromTmdbId(tmdbId);

        // Step 2: Get TMDB show details (for images, etc.)
        const tmdbShowResponse = await tmdbClient.get<any>(`/tv/${tmdbId}`);
        const tmdbShow = tmdbShowResponse.data;

        // Step 3: Get all seasons and their episodes from Trakt
        const seasonsResponse = await traktClient.get<any>(
            `/shows/${traktShowId}/seasons?extended=full`,
        );
        const seasons = seasonsResponse.data;

        // Step 4: Get detailed episode info for each season
        const seasonsWithEpisodes = await Promise.all(
            seasons.map(async (season: { number: number }) => {
                // Skip season 0 (specials) if desired
                if (season.number === 0) return season;

                const episodesResponse = await traktClient.get<any>(
                    `/shows/${traktShowId}/seasons/${season.number}/episodes?extended=full`,
                );

                // Add TMDB episode images where available
                const episodesWithImages = await Promise.all(
                    episodesResponse.data.map(async (episode: { number: any }) => {
                        try {
                            // Get TMDB episode data for images
                            const tmdbEpisodeResponse = await tmdbClient.get<any>(
                                `/tv/${tmdbId}/season/${season.number}/episode/${episode.number}`,
                            );

                            return {
                                ...episode,
                                tmdb_id: tmdbEpisodeResponse.data.id,
                                still_path: tmdbEpisodeResponse.data.still_path,
                                still_url: tmdbEpisodeResponse.data.still_path
                                    ? `https://image.tmdb.org/t/p/w300${tmdbEpisodeResponse.data.still_path}`
                                    : null,
                            };
                        } catch (error) {
                            // Return episode without image if TMDB request fails
                            return episode;
                        }
                    }),
                );

                return {
                    ...season,
                    episodes: episodesWithImages,
                };
            }),
        );

        // Step 5: Combine everything into one object
        return {
            id: tmdbId,
            trakt_id: traktShowId,
            name: tmdbShow.name,
            overview: tmdbShow.overview,
            poster_path: tmdbShow.poster_path,
            poster_url: tmdbShow.poster_path
                ? `https://image.tmdb.org/t/p/w500${tmdbShow.poster_path}`
                : null,
            backdrop_url: tmdbShow.backdrop_path
                ? `https://image.tmdb.org/t/p/original${tmdbShow.backdrop_path}`
                : null,
            seasons: seasonsWithEpisodes,
        };
    } catch (error) {
        console.error('Error getting show data:', error);
        throw error;
    }
}

function getTraktShowIdFromTmdbId(tmdbId: number) {
    return traktClient.get<any>(`/search/tv?query=${tmdbId}`);
}
