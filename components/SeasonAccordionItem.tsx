import { SeasonVM } from '@/models/SeasonVM';
import { getBlurHash, getTMDBImageSource } from '@/utils/imgHelper';
import { tmdbService } from '@/utils/tmdbService';
import { getRatingColor } from '@/utils/uiHelper';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import EpisodeItem from './EpisodeItem';
import { EpisodeListSkeleton } from './UI/Skeletons';
import { useGlobalError } from '@/context/GlobalErrorContext';
import { Colors } from '@/constants/Colors';

interface Props {
    tvShowId: number;
    seasonSummary: SeasonVM;
}

const SeasonAccordionItem = ({ tvShowId, seasonSummary }: Props) => {
    const { showError } = useGlobalError();
    const [isExpanded, setIsExpanded] = useState(false);
    const [watchedEpisodeIds, setWatchedEpisodeIds] = useState<Set<number>>(new Set());
    const [forceSeasonWatched, setForceSeasonWatched] = useState(false);

    const animationController = useSharedValue(0);
    const contentHeight = useSharedValue(0);

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

    useEffect(() => {
        queryClient.prefetchQuery({
            queryKey: ['season', tvShowId, 1],
            queryFn: () => tmdbService.getSeasonDetails(tvShowId, 1),
        });
    }, [tvShowId]);

    const episodes = season?.episodes;

    useEffect(() => {
        if (forceSeasonWatched && episodes && episodes.length > 0) {
            const allIds = episodes.map((e) => e.id);
            setWatchedEpisodeIds((prev) => {
                if (prev.size === allIds.length) return prev;
                return new Set(allIds);
            });
        }
    }, [episodes, forceSeasonWatched]);

    useEffect(() => {
        if (error) {
            showError({
                rightButtonText: 'Retry',
                onRightButtonPress: refetch,
            });
        }
    }, [error]);

    // Derived State
    const totalEpisodes = seasonSummary.episode_count;
    const watchedCount = watchedEpisodeIds.size;
    const progressPercent = totalEpisodes > 0 ? (watchedCount / totalEpisodes) * 100 : 0;
    const isSeasonFullyWatched =
        forceSeasonWatched || (totalEpisodes > 0 && watchedCount === totalEpisodes);

    // Animations
    useEffect(() => {
        animationController.value = withTiming(isExpanded ? 1 : 0, { duration: 300 });
    }, [isExpanded]);

    const chevronStyle = useAnimatedStyle(() => {
        const rotate = interpolate(animationController.value, [0, 1], [0, 180]);
        return { transform: [{ rotate: `${rotate}deg` }] };
    });

    const containerStyle = useAnimatedStyle(() => {
        const height = interpolate(
            animationController.value,
            [0, 1],
            [0, contentHeight.value],
            Extrapolation.CLAMP,
        );
        return { height, opacity: animationController.value };
    });

    const onLayout = (event: LayoutChangeEvent) => {
        const layoutHeight = event.nativeEvent.layout.height;
        requestAnimationFrame(() => {
            if (Math.round(contentHeight.value) !== Math.round(layoutHeight)) {
                contentHeight.value = layoutHeight;
            }
        });
    };

    const toggleEpisodeWatched = (episodeId: number) => {
        setForceSeasonWatched(false);

        setWatchedEpisodeIds((prev) => {
            const next = new Set(prev);
            if (next.has(episodeId)) {
                next.delete(episodeId);
            } else {
                next.add(episodeId);
            }
            return next;
        });
    };

    const toggleSeasonWatched = () => {
        if (episodes && episodes.length > 0) {
            if (isSeasonFullyWatched) {
                setWatchedEpisodeIds(new Set());
                setForceSeasonWatched(false);
            } else {
                const allIds = episodes.map((e) => e.id);
                setWatchedEpisodeIds(new Set(allIds));
                setForceSeasonWatched(true);
            }
        } else {
            setForceSeasonWatched((prev) => !prev);
        }
    };

    const handleToggle = () => setIsExpanded((prev) => !prev);
    if (error) return null;

    const score = seasonSummary.vote_average > 0 ? seasonSummary.vote_average.toFixed(1) : null;
    const ratingColor = getRatingColor(seasonSummary.vote_average);

    return (
        <View className="mb-4 overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/50">
            <Pressable
                onPress={handleToggle}
                className={`flex-row items-center justify-between p-2.5 ${isExpanded ? 'bg-neutral-800/80' : 'bg-transparent'} active:bg-neutral-800`}>
                <View className="flex-1 flex-row items-center gap-4">
                    <View className="shadow-sm shadow-black">
                        <Image
                            source={getTMDBImageSource(seasonSummary.poster_path, 'w185')}
                            placeholder={getBlurHash(seasonSummary.poster_path)}
                            transition={300}
                            contentFit="cover"
                            style={{
                                width: 64,
                                aspectRatio: 3 / 4,
                                borderRadius: 6,
                                backgroundColor: Colors.imgBackground,
                                opacity: isSeasonFullyWatched ? 0.5 : 1,
                            }}
                        />
                        {isSeasonFullyWatched && (
                            <View className="absolute inset-0 items-center justify-center rounded-md bg-black/40">
                                <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                            </View>
                        )}
                    </View>

                    <View className="flex-1 justify-center">
                        <Text className="text-lg font-bold tracking-tight text-white">
                            {seasonSummary.name}
                        </Text>

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

                {/* Action Buttons */}
                <View className="flex-row items-center gap-3">
                    <Pressable
                        onPress={toggleSeasonWatched}
                        hitSlop={10}
                        className={`mr-2 rounded-full p-1.5 active:scale-90 active:opacity-70 ${isSeasonFullyWatched ? 'bg-green-500' : 'bg-neutral-300'}`}>
                        <Ionicons
                            name={'checkmark-sharp'}
                            size={18}
                            color={isSeasonFullyWatched ? 'white' : '#333333'}
                        />
                    </Pressable>

                    <Animated.View style={chevronStyle}>
                        <Ionicons name="chevron-down" size={20} color="#d4d4d4" />
                    </Animated.View>
                </View>
            </Pressable>

            {/* Progress Bar */}
            <View className="h-1 w-full bg-neutral-800">
                <View
                    className={`h-full ${isSeasonFullyWatched ? 'bg-green-500' : 'bg-yellow-500'}`}
                    style={{ width: `${progressPercent}%` }}
                />
            </View>

            {/* Episodes List */}
            <Animated.View style={[{ overflow: 'hidden' }, containerStyle]}>
                <View onLayout={onLayout} className="absolute left-0 top-0 w-full bg-black/20">
                    {isLoading ? (
                        <EpisodeListSkeleton />
                    ) : episodes && episodes.length > 0 ? (
                        <>
                            {episodes.map((episode) => (
                                <EpisodeItem
                                    key={episode.id}
                                    episode={episode}
                                    isWatched={
                                        isSeasonFullyWatched || watchedEpisodeIds.has(episode.id)
                                    }
                                    onToggle={() => toggleEpisodeWatched(episode.id)}
                                />
                            ))}
                        </>
                    ) : (
                        <View className="items-center py-6">
                            <Text className="text-sm italic text-neutral-500">
                                No episodes available
                            </Text>
                        </View>
                    )}
                </View>
            </Animated.View>
        </View>
    );
};

export default SeasonAccordionItem;
