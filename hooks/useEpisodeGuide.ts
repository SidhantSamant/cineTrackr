import { useMutation, useQueryClient } from '@tanstack/react-query';
import UserEpisodeVM from '@/models/UserEpisodeVM';
import { episodeService } from '@/utils/episodeService';
import { QUERY_KEYS } from './useLibrary';

export const useEpisodeGuide = () => {
    const queryClient = useQueryClient();

    // 1. Toggle Single Episode
    const toggleEpisode = useMutation({
        mutationFn: async ({ show, season, episode, isWatched }: any) => {
            return episodeService.toggleEpisode(show, season, episode, isWatched);
        },
        onMutate: async ({ show, season, episode, isWatched }) => {
            const queryKey = QUERY_KEYS.episodes(show.tmdb_id, season);

            await queryClient.cancelQueries({ queryKey });

            const previousEpisodes = queryClient.getQueryData<UserEpisodeVM[]>(queryKey) || [];

            queryClient.setQueryData(queryKey, (old: UserEpisodeVM[] = []) => {
                if (isWatched) {
                    if (old.some((e) => e.episode_number === episode)) return old;

                    return [
                        ...old,
                        {
                            id: 'temp-id',
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
        onError: (err, vars, context) => {
            if (context?.previousEpisodes) {
                queryClient.setQueryData(
                    QUERY_KEYS.episodes(vars.show.tmdb_id, vars.season),
                    context.previousEpisodes,
                );
            }
        },
        onSettled: (data, error, vars) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.episodes(vars.show.tmdb_id, vars.season),
            });
            // queryClient.invalidateQueries({ queryKey: QUERY_KEYS.library });
        },
    });

    // 2. Toggle Entire Season
    const toggleSeason = useMutation({
        mutationFn: async ({ show, seasonNum, epCount, isWatched }: any) => {
            return episodeService.toggleSeason(show, seasonNum, epCount, isWatched);
        },
        onMutate: async ({ show, seasonNum, epCount, isWatched }) => {
            const queryKey = QUERY_KEYS.episodes(show.tmdb_id, seasonNum);
            await queryClient.cancelQueries({ queryKey });
            const previousEpisodes = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, () => {
                if (isWatched) {
                    return Array.from({ length: epCount }, (_, i) => ({
                        id: `temp-${i}`,
                        tmdb_id: show.tmdb_id,
                        season_number: seasonNum,
                        episode_number: i + 1,
                    }));
                } else {
                    return [];
                }
            });

            return { previousEpisodes };
        },
        onError: (err, vars, context) => {
            queryClient.setQueryData(
                QUERY_KEYS.episodes(vars.show.tmdb_id, vars.seasonNum),
                context?.previousEpisodes,
            );
        },
        onSettled: (data, error, vars) => {
            queryClient.invalidateQueries({
                queryKey: QUERY_KEYS.episodes(vars.show.tmdb_id, vars.seasonNum),
            });
            // queryClient.invalidateQueries({ queryKey: QUERY_KEYS.library });
        },
    });

    return { toggleEpisode, toggleSeason };
};
