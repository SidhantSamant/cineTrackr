import { useMutation, useQueryClient } from '@tanstack/react-query';
import UserEpisodeVM from '@/models/UserEpisodeVM';
import { episodeService } from '@/utils/episodeService';
import { QUERY_KEYS } from './useLibrary';
import UserLibraryVM from '@/models/UserLibraryVM';
import { useAuthStore } from '@/store/useAuthStore';

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
    const userId = useAuthStore((state) => state.user?.id) || 'temp-user';

    // 1. Toggle Single Episode
    const toggleEpisode = useMutation({
        mutationFn: async ({ show, season, episode, markAsWatched }: ToggleEpisodeProps) => {
            return episodeService.toggleEpisode(userId, show, season, episode, markAsWatched);
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
                            user_id: userId,
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
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.library] });
        },
    });

    // 2. Toggle Entire Season
    const toggleSeason = useMutation({
        mutationFn: async ({ show, seasonNum, epCount, isWatched }: ToggleSeasonProps) => {
            return episodeService.toggleSeason(userId, show, seasonNum, epCount, isWatched);
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
                            user_id: userId,
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
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.library] });
        },
    });

    // 3. Toggle Entire Show as Watched
    const toggleShowWatched = useMutation({
        mutationFn: async ({ tmdbData, isWatched }: { tmdbData: any; isWatched: boolean }) => {
            return episodeService.toggleShowWatched(userId, tmdbData, isWatched);
        },
        onMutate: async ({ tmdbData, isWatched }) => {
            await queryClient.cancelQueries({
                queryKey: [QUERY_KEYS.userEpisodes, tmdbData.id],
            });

            const previousSeasonsData: Record<number, any> = {};
            const lastSeason = tmdbData?.last_episode_to_air?.season_number || 999;
            const lastEp = tmdbData?.last_episode_to_air?.episode_number || 9999;

            (tmdbData?.seasons || []).forEach((s: any) => {
                if (s.season_number === 0) return;

                const seasonKey = QUERY_KEYS.episodes(tmdbData.id, s.season_number);

                previousSeasonsData[s.season_number] = queryClient.getQueryData(seasonKey);

                if (!isWatched) {
                    queryClient.setQueryData(seasonKey, []);
                } else if (s.season_number <= lastSeason) {
                    const limit =
                        s.season_number === lastSeason
                            ? Math.min(s.episode_count || 0, lastEp)
                            : s.episode_count || 0;

                    queryClient.setQueryData(
                        seasonKey,
                        Array.from({ length: limit }, (_, i) => ({
                            id: `temp-${s.season_number}-${i + 1}`,
                            tmdb_id: tmdbData.id,
                            season_number: s.season_number,
                            episode_number: i + 1,
                            user_id: userId,
                        })),
                    );
                }
            });

            return { previousSeasonsData };
        },
        onError: (_err, vars, context) => {
            if (context?.previousSeasonsData) {
                Object.entries(context.previousSeasonsData).forEach(([seasonNum, oldData]) => {
                    queryClient.setQueryData(
                        QUERY_KEYS.episodes(vars.tmdbData.id, Number(seasonNum)),
                        oldData,
                    );
                });
            }
        },
        onSettled: (_data, _error, vars) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.library] });

            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.userEpisodes, vars.tmdbData.id],
            });
        },
    });

    return { toggleEpisode, toggleSeason, toggleShowWatched };
};
