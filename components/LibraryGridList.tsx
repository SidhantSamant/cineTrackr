import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useMemo } from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import MediaListItem from './MediaListItem';
import { BouncyPressable } from './SectionHeader';
import { GridListSkeleton } from './UI/Skeletons';

const COLUMNS = 4;
const GAP = 8;
const EDGE_PADDING = 24;
const MAX_VISIBLE_ITEMS = 8;

interface LibraryGridListProps {
    data: any[] | undefined;
    isLoading: boolean;
    onSeeAll: () => void;
    activeTab: string;
    emptyMessage?: string;
}

export default function LibraryGridList({
    data,
    isLoading,
    onSeeAll,
    activeTab,
    emptyMessage,
}: LibraryGridListProps) {
    const { width } = useWindowDimensions();

    // Container Dimensions
    const { itemWidth, itemHeight, containerHeight } = useMemo(() => {
        const totalGap = GAP * (COLUMNS - 1);
        const availableWidth = width - EDGE_PADDING - totalGap;
        const calculatedWidth = availableWidth / COLUMNS;
        const calculatedHeight = calculatedWidth * (5 / 3);
        const fixedHeight = calculatedHeight * 2 + GAP;

        return {
            itemWidth: calculatedWidth,
            itemHeight: calculatedHeight,
            containerHeight: fixedHeight,
        };
    }, [width]);

    // Display Items
    const { displayItems, remainingCount, lastItemImage } = useMemo(() => {
        if (!data || data.length === 0) {
            return { displayItems: [], remainingCount: 0, lastItemImage: null };
        }

        if (data.length <= MAX_VISIBLE_ITEMS) {
            return { displayItems: data, remainingCount: 0, lastItemImage: null };
        }

        const visible = data.slice(0, MAX_VISIBLE_ITEMS - 1);
        const nextItem = data[MAX_VISIBLE_ITEMS - 1];

        return {
            displayItems: visible,
            remainingCount: data.length - visible.length,
            lastItemImage: nextItem?.poster_path || null,
        };
    }, [data]);

    return (
        <View className="w-full" style={{ height: containerHeight }}>
            {isLoading ? (
                <GridListSkeleton />
            ) : !data || data.length === 0 ? (
                // Empty State
                <View className="h-full w-full items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/20">
                    <View className="mb-2 rounded-full bg-neutral-800 p-3">
                        <Ionicons name={'film'} size={24} color="#525252" />
                    </View>
                    <Text className="text-sm font-medium text-neutral-500">
                        {emptyMessage || `No ${activeTab} found`}
                    </Text>
                </View>
            ) : (
                // Content Grid
                <View className="flex-row flex-wrap" style={{ gap: GAP }}>
                    {displayItems.map((item, index) => (
                        <Animated.View
                            key={item.id}
                            entering={FadeIn.delay(index * 30)}
                            style={{ width: itemWidth }}>
                            <MediaListItem
                                data={item}
                                type={'title' in item ? 'movie' : 'tv'}
                                isGridView={true}
                                isLibrary={true}
                            />
                        </Animated.View>
                    ))}

                    {/* More Card */}
                    {remainingCount > 0 && (
                        <View style={{ width: itemWidth }}>
                            <BouncyPressable
                                onPress={onSeeAll}
                                className="relative h-full w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-800"
                                style={{ height: itemHeight }}>
                                {lastItemImage && (
                                    <Image
                                        source={{
                                            uri: `https://image.tmdb.org/t/p/w200${lastItemImage}`,
                                        }}
                                        style={styles.posterImage}
                                        contentFit="cover"
                                        blurRadius={10}
                                    />
                                )}
                                <View className="flex-1 items-center justify-center bg-black/20">
                                    <Text className="text-xl font-bold text-white shadow-sm">
                                        +{remainingCount}
                                    </Text>
                                    <Text className="text-xs font-bold uppercase text-neutral-300 shadow-sm">
                                        More
                                    </Text>
                                </View>
                            </BouncyPressable>
                        </View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    posterImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        opacity: 0.3,
    },
});
