import { Colors } from '@/constants/Colors';
import { useGlobalError } from '@/context/GlobalErrorContext';
import { useEpisodeGuide } from '@/hooks/useEpisodeGuide';
import { QUERY_KEYS } from '@/hooks/useLibrary';
import { EpisodeVM, SeasonVM } from '@/models/SeasonVM';
import UserLibraryVM from '@/models/UserLibraryVM';
import { useAuthStore } from '@/store/useAuthStore';
import { episodeService } from '@/utils/episodeService';
import { getBlurHash, getTMDBImageSource } from '@/utils/imgHelper';
import { tmdbService } from '@/utils/tmdbService';
import { getRatingColor } from '@/utils/uiHelper';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    LayoutAnimation,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import EpisodeItem from './EpisodeItem';
import { EpisodeListSkeleton } from './UI/Skeletons';

interface Props {
    tvShowId: number;
    seasonSummary: SeasonVM;
    showMetadata?: UserLibraryVM;
    isExpanded: boolean;
    onToggle: () => void;
}

const SeasonAccordionItem = ({
    tvShowId,
    seasonSummary,
    showMetadata,
    isExpanded,
    onToggle,
}: Props) => {
    const { showError, showWarning } = useGlobalError();
    const { toggleSeason, toggleEpisode } = useEpisodeGuide();
    const user = useAuthStore((state) => state.user);
    const [renderLimit, setRenderLimit] = useState(10);
    const chevronRotation = useSharedValue(0);

    useEffect(() => {
        chevronRotation.value = withTiming(isExpanded ? 180 : 0, { duration: 300 });
    }, [isExpanded]);

    const chevronStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${chevronRotation.value}deg` }],
    }));

    const {
        data: season,
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['season', tvShowId, seasonSummary.season_number],
        queryFn: () => tmdbService.getSeasonDetails(tvShowId, seasonSummary.season_number),
        enabled: isExpanded,
    });

    const {
        data: watchedEpisodes = [],
        error: watchedEpisodesError,
        refetch: refetchWatchedEpisodes,
    } = useQuery({
        queryKey: QUERY_KEYS.episodes(tvShowId, seasonSummary.season_number),
        queryFn: () => episodeService.getWatchedEpisodes(tvShowId, seasonSummary.season_number),
    });

    useEffect(() => {
        if (error || watchedEpisodesError) {
            showError({
                rightButtonText: 'Retry',
                onRightButtonPress: error ? refetch : refetchWatchedEpisodes,
            });
        }
    }, [error, watchedEpisodesError]);

    // BATCHING LOGIC
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;
        if (isExpanded) {
            timeoutId = setTimeout(() => {
                if (!season?.episodes) return;
                const total = season.episodes.length;
                const loadNextBatch = () => {
                    setRenderLimit((prev) => {
                        const next = prev + 15;
                        if (next < total) {
                            timeoutId = setTimeout(loadNextBatch, 150);
                            return next;
                        }
                        return total;
                    });
                };
                loadNextBatch();
            }, 350);
        } else {
            setRenderLimit(10);
        }
        return () => clearTimeout(timeoutId);
    }, [isExpanded, season?.episodes]);

    const handleEpisodeToggle = useCallback(
        (episode: EpisodeVM) => {
            const isReleased = episode.air_date
                ? episode.air_date <= new Date().toISOString().split('T')[0]
                : false;
            if (!isReleased) return;
            if (!user) {
                showWarning({
                    message: `Sign in required`,
                    rightButtonText: 'Sign In',
                    onRightButtonPress: () => router.navigate('/(auth)/login'),
                });
                return;
            }
            toggleEpisode.mutate({
                show: showMetadata,
                season: seasonSummary.season_number,
                episode: episode.episode_number,
            });
        },
        [user, showMetadata, seasonSummary.season_number, showWarning, toggleEpisode],
    );

    const handleExpandToggle = useCallback(() => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        onToggle();
    }, [onToggle]);

    // Derived States
    const episodes = season?.episodes || [];
    const totalEpisodes = seasonSummary.episode_count;
    const watchedCount = watchedEpisodes.length;

    const releasedEpisodeCount = useMemo(() => {
        if (episodes.length > 0) {
            const now = new Date().toISOString().split('T')[0];
            return episodes.filter((e) => e.air_date && e.air_date <= now).length;
        }
        return totalEpisodes;
    }, [episodes, totalEpisodes]);

    const isSeasonFullyWatched = useMemo(
        () => releasedEpisodeCount > 0 && watchedCount >= releasedEpisodeCount,
        [releasedEpisodeCount, watchedCount],
    );

    const handleToggleSeasonWatched = useCallback(() => {
        if (!user)
            return showWarning({
                message: 'Sign in',
                rightButtonText: 'Sign In',
                onRightButtonPress: () => router.navigate('/(auth)/login'),
            });
        if (isLoading) return;
        toggleSeason.mutate({
            show: showMetadata,
            seasonNum: seasonSummary.season_number,
            epCount: releasedEpisodeCount,
            isWatched: !isSeasonFullyWatched,
        });
    }, [
        user,
        isLoading,
        showMetadata,
        seasonSummary.season_number,
        releasedEpisodeCount,
        isSeasonFullyWatched,
        toggleSeason,
        showWarning,
    ]);

    const watchedEpisodeNumbers = useMemo(
        () => new Set(watchedEpisodes.map((e) => e.episode_number)),
        [watchedEpisodes],
    );
    const progressPercent = totalEpisodes > 0 ? (watchedCount / totalEpisodes) * 100 : 0;
    const score = seasonSummary.vote_average > 0 ? seasonSummary.vote_average.toFixed(1) : null;
    const ratingColor = getRatingColor(seasonSummary.vote_average);

    if (error) return null;

    return (
        <View className="mb-4 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50">
            <Pressable
                onPress={handleExpandToggle}
                className={`flex-row items-center justify-between p-2.5 ${isExpanded ? 'bg-neutral-800/80' : 'bg-transparent'} active:bg-neutral-800`}>
                <View className="flex-1 flex-row items-center gap-4">
                    <View className="shadow-sm shadow-black">
                        <Image
                            source={getTMDBImageSource(seasonSummary.poster_path, 'w185')}
                            placeholder={getBlurHash(seasonSummary.poster_path)}
                            transition={0}
                            contentFit="cover"
                            style={[styles.image, { opacity: isSeasonFullyWatched ? 0.5 : 1 }]}
                        />
                        {isSeasonFullyWatched && (
                            <View className="absolute inset-0 items-center justify-center rounded-md bg-black/40">
                                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                            </View>
                        )}
                    </View>
                    <View className="flex-1 justify-center">
                        <Text
                            className="text-lg font-semibold tracking-tight text-white"
                            numberOfLines={1}>
                            {seasonSummary.name}
                        </Text>
                        {seasonSummary?.overview && (
                            <Text
                                className="text-sm italic leading-5 text-neutral-400"
                                numberOfLines={2}>
                                "{seasonSummary.overview}"
                            </Text>
                        )}
                        <View className="mt-1 flex-row flex-wrap items-center gap-2">
                            {score && (
                                <View
                                    className="flex-row items-center rounded px-1.5 py-0.5"
                                    style={{ backgroundColor: `${ratingColor}33` }}>
                                    <Ionicons name="star" size={10} color={ratingColor} />
                                    <Text
                                        className="ml-1 text-xs font-bold"
                                        style={{ color: ratingColor }}>
                                        {score}
                                    </Text>
                                </View>
                            )}

                            {watchedCount > 0 ? (
                                <Text className="text-xs font-bold text-green-500">
                                    {watchedCount}/{totalEpisodes} Watched
                                </Text>
                            ) : (
                                <Text className="text-xs font-medium text-neutral-400">
                                    {seasonSummary.episode_count} Eps
                                </Text>
                            )}

                            {seasonSummary.air_date && (
                                <>
                                    <View className="h-1 w-1 rounded-full bg-neutral-600" />
                                    <Text className="text-xs font-medium text-neutral-400">
                                        {seasonSummary.air_date.substring(0, 4)}
                                    </Text>
                                </>
                            )}
                        </View>
                    </View>
                </View>

                <View className="flex-row items-center gap-3">
                    <Pressable
                        onPress={handleToggleSeasonWatched}
                        hitSlop={10}
                        disabled={toggleSeason.isPending || isLoading || releasedEpisodeCount === 0}
                        className={`mx-1.5 rounded-full p-2 active:scale-90 active:opacity-70 ${isSeasonFullyWatched ? 'bg-green-500' : 'bg-neutral-300'}`}>
                        <Ionicons
                            name={'checkmark-sharp'}
                            size={18}
                            color={isSeasonFullyWatched ? 'white' : '#333333'}
                        />
                    </Pressable>

                    <Animated.View style={chevronStyle} collapsable={false}>
                        <Ionicons name="chevron-down" size={20} color="#d4d4d4" />
                    </Animated.View>
                    {/* <Ionicons name="chevron-down" size={20} color="#d4d4d4" /> */}
                </View>
            </Pressable>

            <View className="h-1 w-full bg-neutral-800">
                <View
                    className={`h-full ${isSeasonFullyWatched ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${progressPercent}%` }}
                />
            </View>

            {isExpanded && (
                <View className="w-full bg-black/20">
                    {isLoading ? (
                        <EpisodeListSkeleton />
                    ) : episodes && episodes.length > 0 ? (
                        <>
                            {episodes.slice(0, renderLimit).map((episode) => (
                                <EpisodeItem
                                    key={episode.id}
                                    episode={episode}
                                    isWatched={
                                        isSeasonFullyWatched ||
                                        watchedEpisodeNumbers.has(episode.episode_number)
                                    }
                                    onToggle={handleEpisodeToggle}
                                />
                            ))}
                            {episodes.length > renderLimit && (
                                <View className="items-center py-4">
                                    <ActivityIndicator size="small" color={Colors.primary} />
                                </View>
                            )}
                        </>
                    ) : (
                        <View className="items-center py-6">
                            <Text className="text-sm italic text-neutral-500">
                                No episodes available
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: 64,
        aspectRatio: 3 / 4,
        borderRadius: 6,
        backgroundColor: Colors.imgBackground,
    },
});

export default memo(SeasonAccordionItem, (prev, next) => {
    return (
        prev.isExpanded === next.isExpanded &&
        prev.tvShowId === next.tvShowId &&
        prev.seasonSummary.id === next.seasonSummary.id &&
        prev.seasonSummary.episode_count === next.seasonSummary.episode_count &&
        prev.showMetadata === next.showMetadata
    );
});
