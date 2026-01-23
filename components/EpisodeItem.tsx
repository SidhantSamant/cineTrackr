import { Colors } from '@/constants/Colors';
import { EpisodeVM } from '@/models/SeasonVM';
import { getBlurHash, getTMDBImageSource } from '@/utils/imgHelper';
import { formatDateFast, getRatingColor } from '@/utils/uiHelper';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
    episode: EpisodeVM;
    isWatched: boolean;
    isNextUp: boolean;
    onToggle: (episode: EpisodeVM) => void;
}

const EpisodeItem = ({ episode, isWatched, isNextUp, onToggle }: Props) => {
    const runtime = episode.runtime ? `${episode.runtime}m` : '';
    const formattedDate = useMemo(() => formatDateFast(episode.air_date), [episode.air_date]);
    const ratingColor = getRatingColor(episode.vote_average);
    const isReleased = useMemo(() => {
        if (!episode.air_date) return false;
        return episode.air_date <= new Date().toISOString().split('T')[0];
    }, [episode.air_date]);

    const isEpisodeWatched = isReleased && isWatched;

    return (
        <View
            // className={`min-h-[112px] flex-row items-center border-b border-neutral-800 p-3 ${
            className={`h-[108px] flex-row items-center border-b border-neutral-800 p-3 ${
                isNextUp
                    ? 'border-l-4 border-l-primary bg-neutral-800/40'
                    : 'border-l-4 border-l-transparent bg-neutral-900/30'
            }`}>
            <View className="relative mr-3">
                <Image
                    source={getTMDBImageSource(episode.still_path, 'w342')}
                    // source={getTMDBImageSource(episode.still_path, 'w185')}
                    placeholder={getBlurHash(episode.still_path)}
                    transition={0}
                    contentFit="cover"
                    style={[styles.image, { opacity: isEpisodeWatched ? 0.6 : 1 }]}
                />

                {isEpisodeWatched && (
                    <View className="absolute inset-0 items-center justify-center rounded-lg bg-black/40">
                        <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                    </View>
                )}
            </View>

            <View className="flex-1 justify-center">
                <View className="flex-row">
                    <Text
                        className={`mr-2 flex-1 text-base font-semibold leading-tight ${
                            isEpisodeWatched
                                ? 'text-neutral-400'
                                : isNextUp
                                  ? 'text-primary'
                                  : 'text-neutral-200'
                        }`}
                        numberOfLines={1}>
                        {episode.episode_number}. {episode.name}
                    </Text>
                </View>

                <Text className="mt-0.5 text-sm italic text-neutral-400" numberOfLines={2}>
                    {episode.overview}
                </Text>

                {/* Metadata Footer */}
                <View className="flex-row flex-wrap items-center gap-y-1">
                    {formattedDate && (
                        <Text className="text-xs font-medium text-neutral-400">
                            {formattedDate}
                        </Text>
                    )}
                    {formattedDate && runtime && (
                        <Text className="mx-2 text-xs text-neutral-600">•</Text>
                    )}
                    {runtime && (
                        <Text className="mr-3 text-xs font-medium text-neutral-400">{runtime}</Text>
                    )}
                    {episode.vote_average > 0 && (
                        <View className="flex-row items-center rounded bg-neutral-800 px-1.5 py-0.5">
                            <Ionicons
                                name="star"
                                size={8}
                                color={ratingColor}
                                style={{ marginRight: 3 }}
                            />
                            <Text style={{ color: ratingColor, fontSize: 10, fontWeight: '700' }}>
                                {episode.vote_average.toFixed(1)}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <Pressable
                onPress={() => onToggle(episode)}
                hitSlop={10}
                disabled={!isReleased}
                className={`ml-1 rounded-full p-2 active:scale-90 active:opacity-70 ${
                    isEpisodeWatched
                        ? 'bg-green-500'
                        : isReleased
                          ? 'bg-neutral-300'
                          : 'bg-neutral-600'
                }`}>
                <Ionicons
                    name={'checkmark-sharp'}
                    size={16}
                    color={isEpisodeWatched ? 'white' : '#333333'}
                />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    image: {
        width: 112,
        height: 77,
        borderRadius: 8,
        // width: 96,
        // height: 72,
        backgroundColor: Colors.imgBackground,
    },
});

export default React.memo(EpisodeItem, (prev, next) => {
    return (
        prev.isWatched === next.isWatched &&
        prev.isNextUp === next.isNextUp &&
        prev.episode.id === next.episode.id
    );
});

// export default React.memo(EpisodeItem, (prev, next) => {
//     const isWatchedSame = prev.isWatched === next.isWatched;
//     const isNextUpSame = prev.isNextUp === next.isNextUp;
//     const isIdSame = prev.episode.id === next.episode.id;

//     if (!isWatchedSame || !isNextUpSame || !isIdSame) {
//         console.log(`[RE-RENDER REASON] Ep ${next.episode.episode_number}:`, {
//             watchedChanged: !isWatchedSame,
//             nextUpChanged: !isNextUpSame,
//             idChanged: !isIdSame,
//         });
//         return false; // Allow re-render
//     }
//     return true; // Prevent re-render
// });
