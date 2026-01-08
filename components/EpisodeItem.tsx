import { Colors } from '@/constants/Colors';
import { useGlobalError } from '@/context/GlobalErrorContext';
import { useEpisodeGuide } from '@/hooks/useEpisodeGuide'; // or '@/hooks/useEpisodeMutations'
import { EpisodeVM } from '@/models/SeasonVM';
import UserLibraryVM from '@/models/UserLibraryVM';
import { useAuthStore } from '@/store/useAuthStore';
import { BLURHASH_TRANSITION, getBlurHash, getTMDBImageSource } from '@/utils/imgHelper';
import { getRatingColor } from '@/utils/uiHelper';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

interface Props {
    seasonNumber: number;
    episode: EpisodeVM;
    isWatched: boolean;
    showMetadata?: UserLibraryVM;
}

const EpisodeItem = ({ seasonNumber, episode, isWatched, showMetadata }: Props) => {
    const { toggleEpisode } = useEpisodeGuide();
    const { showWarning } = useGlobalError();
    const user = useAuthStore((state) => state.user);

    const isReleased = useMemo(() => {
        return episode.air_date ? new Date(episode.air_date) <= new Date() : false;
    }, [episode.air_date]);

    const handleToggle = () => {
        if (!isReleased) return;

        if (!user) {
            showWarning({
                message: `Sign in to mark this episode as watched`,
                rightButtonText: 'Sign In',
                onRightButtonPress: () => router.navigate('/(auth)/login'),
            });
            return;
        }

        toggleEpisode.mutate({
            show: showMetadata,
            season: seasonNumber,
            episode: episode.episode_number,
            isWatched: !isWatched,
        });
    };

    const runtime = episode.runtime ? `${episode.runtime}m` : '';
    const formattedDate = episode.air_date
        ? new Date(episode.air_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : '';
    const ratingColor = getRatingColor(episode.vote_average);

    return (
        <View className="flex-row items-center border-b border-neutral-800/50 bg-transparent p-4">
            <View className="relative mr-4">
                <Image
                    source={getTMDBImageSource(episode.still_path, 'w342')}
                    placeholder={getBlurHash(episode.still_path)}
                    transition={BLURHASH_TRANSITION}
                    contentFit="cover"
                    style={{
                        width: 102,
                        height: 77,
                        borderRadius: 8,
                        backgroundColor: Colors.imgBackground,
                        opacity: isWatched ? 0.6 : 1,
                    }}
                />
                {isWatched && (
                    <View className="absolute inset-0 items-center justify-center rounded-lg bg-black/40">
                        <Ionicons name="checkmark-circle" size={24} color="#22c55e" />
                    </View>
                )}
            </View>

            <View className="flex-1 justify-center">
                <View className="flex-row items-center justify-between">
                    <View className="mr-2 flex-1">
                        <Text className="mb-0.5 text-xs font-bold text-neutral-500">
                            EPISODE {episode.episode_number}
                        </Text>
                        <Text
                            className={`mb-2 text-base font-semibold leading-tight ${isWatched ? 'text-neutral-400' : 'text-white'}`}
                            numberOfLines={2}>
                            {episode.name}
                        </Text>
                    </View>

                    <Pressable
                        onPress={handleToggle}
                        disabled={toggleEpisode.isPending}
                        hitSlop={10}
                        className={`rounded-full p-1.5 active:scale-90 active:opacity-70 ${isWatched ? 'bg-green-500' : 'bg-neutral-300'}`}>
                        <Ionicons
                            name={'checkmark-sharp'}
                            size={18}
                            color={isWatched ? 'white' : '#333333'}
                        />
                    </Pressable>
                </View>

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
        </View>
    );
};

export default React.memo(EpisodeItem, (prev, next) => {
    return (
        prev.isWatched === next.isWatched &&
        prev.episode.id === next.episode.id &&
        prev.showMetadata === next.showMetadata
    );
});
