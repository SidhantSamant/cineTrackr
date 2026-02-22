import CastItem from '@/components/CastItem';
import HomeHorizontalList from '@/components/HorizontalMediaList';
import ActionButton from '@/components/UI/ActionButton';
import { DetailScreenSkeleton, HorizontalListSkeleton } from '@/components/UI/Skeletons';
import WatchProviders from '@/components/WatchProviders';
import { Colors } from '@/constants/Colors';
import { useGlobalError } from '@/context/GlobalErrorContext';
import { useItemStatus } from '@/hooks/useLibrary';
import { useMediaActions } from '@/hooks/useMediaActions';
import { useParallaxScroll } from '@/hooks/useParallaxScroll';
import { CastVM } from '@/models/BaseMediaVM';
import { MediaType } from '@/models/TVShowVM';
import { BLURHASH_TRANSITION, getBlurHash, getTMDBImageSource } from '@/utils/imgHelper';
import { tmdbService } from '@/utils/tmdbService';
import {
    formatMovieRuntime,
    formatTVSeasonsMeta,
    formatTVYear,
    getMovieYear,
    getRatingColor,
} from '@/utils/uiHelper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const IMG_HEIGHT = 200;
const HEADER_HEIGHT = 100;

const MediaDetailScreen = () => {
    const { id, type } = useLocalSearchParams<{ id: string; type: MediaType }>();
    const { showError } = useGlobalError();
    const insets = useSafeAreaInsets();

    const { data, isLoading, error, refetch } = useQuery({
        queryKey: [type, id],
        queryFn: () => tmdbService.getDetails(type, +id),
    });

    const {
        data: libraryItem,
        isLoading: isLibraryItemLoading,
        error: libraryItemError,
    } = useItemStatus(+id, type);

    const {
        data: movieCollections,
        isLoading: isLoadingCollections,
        error: errorCollections,
        refetch: refetchCollections,
    } = useQuery({
        queryKey: [type, 'collections', id],
        queryFn: () => tmdbService.getMovieCollection(data?.belongs_to_collection?.id),
        enabled: !!data?.belongs_to_collection?.id,
    });

    const movieCollectionSorted = useMemo(() => {
        if (!movieCollections?.parts) return undefined;
        return [...movieCollections.parts].sort((a, b) => {
            const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
            const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
            return dateA - dateB;
        });
    }, [movieCollections]);

    const isReleased = useMemo(() => {
        if (!data) return false;
        const releaseDate = type === 'movie' ? data.release_date : data.first_air_date;
        return releaseDate ? new Date(releaseDate) <= new Date() : false;
    }, [data, type]);

    useEffect(() => {
        if (error || libraryItemError || errorCollections || (!data && !isLoading)) {
            showError({
                leftButtonText: !errorCollections ? 'Go Back' : undefined,
                onLeftButtonPress: !errorCollections ? router.back : undefined,
                rightButtonText: 'Retry',
                onRightButtonPress: !errorCollections ? refetch : refetchCollections,
            });
        }
    }, [error, libraryItemError, errorCollections, data, isLoading]);

    const { onScroll, imageAnimatedStyle, headerAnimatedStyle } = useParallaxScroll({
        imgHeight: IMG_HEIGHT,
        headerHeight: HEADER_HEIGHT,
    });

    const { handleWatchTrailer, handleStatusPress, handleFavoritePress } = useMediaActions({
        libraryItem,
        data,
        type,
    });

    const mediaTitle = data ? (type === 'movie' ? data.title : data.name) : '';
    const meta = type === 'movie' ? '•   ' + formatMovieRuntime(data) : formatTVSeasonsMeta(data);
    const formattedDate = type === 'movie' ? getMovieYear(data) : formatTVYear(data);
    const providers = data?.['watch/providers']?.results;
    const ratingColor = data ? getRatingColor(data.vote_average) : '#fff';

    return (
        <View className="flex-1 bg-[#121212]">
            <StatusBar style="light" />

            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: () => (
                        <Animated.Text
                            numberOfLines={1}
                            style={[styles.headerTitle, headerAnimatedStyle]}>
                            {mediaTitle}
                        </Animated.Text>
                    ),
                    headerTitleAlign: 'center',
                    headerTransparent: true,
                    headerLeft: () => (
                        <Pressable
                            className="rounded-full bg-black/40 p-2 active:bg-black/60"
                            onPress={router.back}
                            hitSlop={20}>
                            <Ionicons name="chevron-back" size={24} color="white" />
                        </Pressable>
                    ),
                    headerBackground: () => (
                        <Animated.View style={[styles.header, headerAnimatedStyle]} />
                    ),
                }}
            />

            {isLoading || isLibraryItemLoading ? (
                <DetailScreenSkeleton />
            ) : error || (!data && !isLoading) ? (
                <View className="flex-1" />
            ) : (
                <Animated.ScrollView
                    className="flex-1 bg-[#121212]"
                    onScroll={onScroll}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                    overScrollMode="never">
                    <View style={{ backgroundColor: Colors.background }}>
                        {/* Parallax Backdrop */}
                        <View style={{ height: IMG_HEIGHT, width: '100%', overflow: 'hidden' }}>
                            <Animated.View style={[StyleSheet.absoluteFill, imageAnimatedStyle]}>
                                <Image
                                    source={getTMDBImageSource(data.backdrop_path, 'w780')}
                                    style={styles.backdropImage}
                                    contentFit="cover"
                                    transition={BLURHASH_TRANSITION}
                                    placeholder={getBlurHash(data.backdrop_path)}
                                    priority="high"
                                />
                                <LinearGradient
                                    style={StyleSheet.absoluteFill}
                                    colors={[
                                        'transparent',
                                        'rgba(18,18,18,0.0)',
                                        'rgba(18,18,18,0.4)',
                                        Colors.background,
                                    ]}
                                    locations={[0, 0.4, 0.7, 1]}
                                />
                            </Animated.View>
                        </View>

                        <View style={{ marginTop: -64, paddingHorizontal: 16 }}>
                            <View className="flex-row">
                                <Image
                                    source={getTMDBImageSource(data.poster_path)}
                                    style={styles.posterImage}
                                    contentFit="cover"
                                    placeholder={getBlurHash(data.poster_path)}
                                    transition={BLURHASH_TRANSITION}
                                    cachePolicy="memory-disk"
                                />

                                {/* Title & Metadata */}
                                <View className="flex-1 justify-end pb-1 pl-4 pt-[64px]">
                                    <Text className="text-2xl font-bold leading-tight text-white">
                                        {mediaTitle}
                                    </Text>

                                    <View className="mt-2 flex-row flex-wrap items-center gap-x-3">
                                        <View
                                            className="flex-row items-center rounded px-1.5 py-0.5"
                                            style={{ backgroundColor: `${ratingColor}33` }}>
                                            <Ionicons name="star" size={12} color={ratingColor} />
                                            <Text
                                                className="ml-1 text-base font-bold"
                                                style={{ color: ratingColor }}>
                                                {data.vote_average.toFixed(1)}
                                            </Text>
                                        </View>

                                        <Text className="text-base font-medium text-neutral-300">
                                            {formattedDate}
                                        </Text>
                                        {meta && (
                                            <Text className="mt-1 text-base font-medium text-neutral-300">
                                                {meta}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View className="mt-6 flex-row items-center justify-around rounded-xl border border-neutral-800 bg-neutral-900/80 py-3">
                                <ActionButton
                                    icon="play"
                                    label="Trailer"
                                    onPress={handleWatchTrailer}
                                />
                                <ActionButton
                                    icon={libraryItem?.is_favorite ? 'heart' : 'heart-outline'}
                                    label="Favorite"
                                    onPress={handleFavoritePress}
                                />
                                <ActionButton
                                    icon={
                                        libraryItem?.status === 'watchlist'
                                            ? 'bookmark'
                                            : 'bookmark-outline'
                                    }
                                    label="Watchlist"
                                    onPress={() => handleStatusPress('watchlist')}
                                />
                                {isReleased && (
                                    <ActionButton
                                        icon={
                                            libraryItem?.status === 'completed'
                                                ? 'checkmark-circle'
                                                : 'checkmark-circle-outline'
                                        }
                                        label="Watched"
                                        onPress={() => handleStatusPress('completed')}
                                    />
                                )}
                            </View>
                        </View>
                    </View>

                    <View className="bg-[#121212] px-3 pb-8 pt-4">
                        {/* Episode Guide */}
                        {type === 'tv' && (
                            <Pressable
                                className="mb-6 flex-row items-center justify-between border-b border-neutral-800 pb-4 active:opacity-60"
                                onPress={() =>
                                    router.navigate({
                                        pathname: `/[type]/[id]/episode-guide`,
                                        params: { type, id, title: data.name },
                                    })
                                }>
                                <Text className="text-lg font-semibold text-white">
                                    Episode Guide
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color="gray" />
                            </Pressable>
                        )}

                        {/* Overview */}
                        <View className="mb-6">
                            <Text className="mb-2 text-lg font-semibold text-white">Overview</Text>
                            <Text className="mt-2 text-base leading-6 text-neutral-300">
                                {data.overview || 'No overview available.'}
                            </Text>
                        </View>

                        {/* Genres */}
                        <ScrollView
                            className="mb-6 flex-row flex-wrap"
                            horizontal
                            showsHorizontalScrollIndicator={false}>
                            {data.genres.map((genre: { id: number; name: string }) => (
                                <View
                                    key={genre.id}
                                    className="mr-2 rounded-full border border-neutral-700 bg-neutral-800 px-4 py-2">
                                    <Text className="text-sm text-white">{genre.name}</Text>
                                </View>
                            ))}
                        </ScrollView>

                        {/* Production Info */}
                        {data.production_companies?.length > 0 && (
                            <View className="mb-6">
                                <Text className="mb-3 text-lg font-semibold text-white">
                                    Production
                                </Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    {data.production_companies.map(
                                        (company: {
                                            id: number;
                                            logo_path: string | null;
                                            name: string;
                                        }) => (
                                            <View
                                                key={company.id}
                                                className="mr-6 flex-row items-center opacity-80">
                                                {company.logo_path ? (
                                                    <Image
                                                        source={getTMDBImageSource(
                                                            company.logo_path,
                                                        )}
                                                        style={{ width: 24, height: 24 }}
                                                        contentFit="contain"
                                                        tintColor="white"
                                                    />
                                                ) : null}
                                                <Text className="ml-2 text-xs font-medium text-neutral-400">
                                                    {company.name}
                                                </Text>
                                            </View>
                                        ),
                                    )}
                                </ScrollView>
                            </View>
                        )}

                        {/* Top Cast */}
                        {data.credits?.cast?.length > 0 && (
                            <View>
                                <Text className="mb-3 text-lg font-semibold text-white">
                                    Top Cast
                                </Text>
                                <FlatList<CastVM>
                                    data={data.credits.cast?.slice(0, 10)}
                                    renderItem={({ item }) => <CastItem item={item} />}
                                    keyExtractor={(item) => item.id.toString()}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                />
                            </View>
                        )}

                        {providers && <WatchProviders providers={providers} countryCode="IN" />}

                        {/* Collections / Recommendations */}
                        <View className="gap-2" style={{ marginBottom: insets.bottom }}>
                            {isLoadingCollections ? (
                                <HorizontalListSkeleton />
                            ) : (
                                movieCollectionSorted &&
                                movieCollectionSorted.length > 0 && (
                                    <HomeHorizontalList
                                        ListHeading={`From ${movieCollections?.name}`}
                                        listType={type}
                                        listData={movieCollectionSorted}
                                        showMore={false}
                                    />
                                )
                            )}

                            {data.recommendations?.results?.length > 0 && (
                                <HomeHorizontalList
                                    ListHeading="Recommendations"
                                    listType={type}
                                    listData={data.recommendations.results}
                                    showMore={false}
                                />
                            )}
                        </View>
                    </View>
                </Animated.ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: Colors.background,
        height: HEADER_HEIGHT,
    },
    headerTitle: {
        color: 'white',
        fontWeight: '600',
        fontSize: 18,
        marginHorizontal: 16,
    },
    backdropImage: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.imgBackground,
    },
    posterImage: {
        width: 100,
        height: 152,
        borderRadius: 10,
        backgroundColor: Colors.imgBackground,
    },
});

export default MediaDetailScreen;
