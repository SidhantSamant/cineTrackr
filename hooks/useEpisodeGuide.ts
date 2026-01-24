import { useMutation, useQueryClient } from '@tanstack/react-query';
import UserEpisodeVM from '@/models/UserEpisodeVM';
import { episodeService } from '@/utils/episodeService';
import { QUERY_KEYS } from './useLibrary';
import UserLibraryVM from '@/models/UserLibraryVM';

type ToggleEpisodeProps = {
    show: UserLibraryVM;
    season: number;
    episode: number;
    markAsWatched: boolean;
};

type ToggleSeasonProps = {
    show: UserLibraryVM;
    seasonNum: number;
    epCount: number;
    isWatched: boolean;
};

export const useEpisodeGuide = () => {
    const queryClient = useQueryClient();

    // 1. Toggle Single Episode
    const toggleEpisode = useMutation({
        mutationFn: async ({ show, season, episode, markAsWatched }: ToggleEpisodeProps) => {
            return episodeService.toggleEpisode(show, season, episode, markAsWatched);
        },
        onMutate: async ({ show, season, episode, markAsWatched }) => {
            const queryKey = QUERY_KEYS.episodes(show.tmdb_id, season);

            await queryClient.cancelQueries({ queryKey });

            const previousEpisodes = queryClient.getQueryData<UserEpisodeVM[]>(queryKey) || [];

            queryClient.setQueryData(queryKey, (old: UserEpisodeVM[] = []) => {
                if (markAsWatched) {
                    if (old.some((e) => e.episode_number === episode)) return old;

                    return [
                        ...old,
                        {
                            id: `temp-${season}-${episode}`,
                            tmdb_id: show.tmdb_id,
                            season_number: season,
                            episode_number: episode,
                            user_id: 'temp-user',
                        } as UserEpisodeVM,
                    ];
                } else {
                    return old.filter((e) => e.episode_number !== episode);
                }
            });

            return { previousEpisodes };
        },
        onError: (_err, vars, context) => {
            if (context?.previousEpisodes) {
                queryClient.setQueryData(
                    QUERY_KEYS.episodes(vars.show.tmdb_id, vars.season),
                    context.previousEpisodes,
                );
            }
        },
        onSettled: (_data, _error, vars) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.episodes(vars.show.tmdb_id, vars.season),
            });
        },
    });

    // 2. Toggle Entire Season
    const toggleSeason = useMutation({
        mutationFn: async ({ show, seasonNum, epCount, isWatched }: ToggleSeasonProps) => {
            return episodeService.toggleSeason(show, seasonNum, epCount, isWatched);
        },
        onMutate: async ({ show, seasonNum, epCount, isWatched }) => {
            const queryKey = QUERY_KEYS.episodes(show.tmdb_id, seasonNum);

            await queryClient.cancelQueries({ queryKey });

            const previousEpisodes = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, () => {
                if (!isWatched) return [];

                return Array.from(
                    { length: epCount },
                    (_, i) =>
                        ({
                            id: `temp-${seasonNum}-${i + 1}`,
                            tmdb_id: show.tmdb_id,
                            season_number: seasonNum,
                            episode_number: i + 1,
                            user_id: 'temp-user',
                        }) as UserEpisodeVM,
                );
            });

            return { previousEpisodes };
        },
        onError: (_err, vars, context) => {
            if (context?.previousEpisodes) {
                queryClient.setQueryData(
                    QUERY_KEYS.episodes(vars.show.tmdb_id, vars.seasonNum),
                    context.previousEpisodes,
                );
            }
        },
        onSettled: (_data, _error, vars) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.episodes(vars.show.tmdb_id, vars.seasonNum),
            });
        },
    });

    return { toggleEpisode, toggleSeason };
};
