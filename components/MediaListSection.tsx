import { Colors } from '@/constants/Colors';
import { MovieVM } from '@/models/MovieVM';
import { TVShowVM } from '@/models/TVShowVM';
import { getCategorySlug, SectionHeadings } from '@/utils/homeScreenHelper';
import { fetchListData } from '@/utils/tmdbService';
import { Ionicons } from '@expo/vector-icons';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import MediaListItem from './MediaListItem';
import { MediaListSkeleton } from './UI/Skeletons';

type MediaListSectionProps = {
    listType: 'top_rated' | 'trending' | 'hidden_gems';
};

type ListMediaType = 'movies' | 'tv series' | 'anime';

const TABS: ListMediaType[] = ['movies', 'tv series', 'anime'];

const HEADING_MAP = {
    trending: {
        movies: SectionHeadings.PopularMovies,
        anime: SectionHeadings.TrendingAnime,
        'tv series': SectionHeadings.PopularTV,
    },
    top_rated: {
        movies: SectionHeadings.TopRatedMovies,
        anime: SectionHeadings.TopRatedAnime,
        'tv series': SectionHeadings.TopRatedTV,
    },
    hidden_gems: {
        movies: SectionHeadings.HiddenGemsMovies,
        anime: SectionHeadings.HiddenGemsAnime,
        'tv series': SectionHeadings.HiddenGemsTV,
    },
} as const;

const SECTION_TITLES = {
    trending: 'Trending',
    top_rated: 'Top Rated',
    hidden_gems: 'Hidden Gems',
};

export default function MediaListSection({ listType }: MediaListSectionProps) {
    const [activeTab, setActiveTab] = useState<ListMediaType>('movies');
    const mediaType = activeTab === 'movies' ? 'movie' : 'tv';
    const listHeading = HEADING_MAP[listType][activeTab];

    const { data, isLoading, isPlaceholderData } = useQuery({
        queryKey: ['media-list', listType, activeTab],
        queryFn: () =>
            fetchListData({
                pageParam: 1,
                type: mediaType,
                slug: getCategorySlug(listHeading),
            }),
        placeholderData: keepPreviousData,
    });

    const handleTabChange = (tab: ListMediaType) => {
        if (tab === activeTab) return;
        setActiveTab(tab);
    };

    const renderItem = useCallback(
        ({ item }: { item: MovieVM | TVShowVM }) => (
            <MediaListItem data={item} type={mediaType} isGridView={false} />
        ),
        [mediaType],
    );

    const handleSeeAll = () => {
        router.push({
            pathname: '/home/type-list',
            params: {
                type: mediaType,
                slug: getCategorySlug(listHeading),
                title: listHeading,
            },
        });
    };

    const animatedOpacityStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(isPlaceholderData ? 0.4 : 1, {
                duration: 500,
                easing: Easing.out(Easing.cubic),
            }),
        };
    }, [isPlaceholderData]);

    if (isLoading) {
        return <MediaListSkeleton hasTitle={true} />;
    }

    return (
        <View>
            <MediaListHeader
                title={SECTION_TITLES[listType]}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onSeeAll={handleSeeAll}
            />

            <Animated.FlatList<MovieVM | TVShowVM>
                style={animatedOpacityStyle}
                data={data}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ gap: 8 }}
                renderItem={renderItem}
                initialNumToRender={6}
                maxToRenderPerBatch={4}
                windowSize={3}
            />
        </View>
    );
}

type MediaListHeaderProps = {
    title: string;
    activeTab: ListMediaType;
    onTabChange: (t: ListMediaType) => void;
    onSeeAll: () => void;
};

const MediaListHeader = ({ title, activeTab, onTabChange, onSeeAll }: MediaListHeaderProps) => (
    <View className="flex-row items-center justify-between pb-3 pt-6">
        <Pressable className="flex-row items-center active:opacity-70" onPress={onSeeAll}>
            <Text className="text-lg font-bold uppercase tracking-tight text-white">{title}</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
        </Pressable>

        <View className="flex-row items-center gap-x-1.5">
            {TABS.map((tab) => (
                <Pressable
                    key={tab}
                    onPress={() => onTabChange(tab)}
                    className={`rounded-full border px-3 py-1 ${
                        activeTab === tab ? 'border-primary bg-primary/10' : 'border-neutral-800'
                    }`}>
                    <Text
                        className={`text-xs font-bold uppercase ${
                            activeTab === tab ? 'text-primary' : 'text-neutral-500'
                        }`}>
                        {tab}
                    </Text>
                </Pressable>
            ))}
        </View>
    </View>
);

// const MediaListHeader = ({ title, activeTab, onTabChange, onSeeAll }: MediaListHeaderProps) => (
//     <View className="flex-row items-center justify-between pb-3 pt-6">
//         <Pressable
//             hitSlop={10}
//             className="flex-row items-center active:opacity-60"
//             onPress={onSeeAll}>
//             <Text className="text-xl font-black uppercase tracking-tighter text-white">
//                 {title}
//             </Text>
//             <Ionicons
//                 name="chevron-forward"
//                 size={18}
//                 color={Colors.primary}
//                 style={{ marginLeft: 2 }}
//             />
//         </Pressable>

//         <View className="flex-row overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/80">
//             {TABS.map((tab, index) => {
//                 const isActive = activeTab === tab;
//                 return (
//                     <Pressable
//                         key={tab}
//                         onPress={() => onTabChange(tab)}
//                         className={`px-3 py-1.5 ${isActive ? 'bg-primary' : ''} ${
//                             index !== 0 ? 'border-l border-neutral-800' : ''
//                         }`}>
//                         <Text
//                             className={`text-xs font-bold uppercase tracking-tight ${
//                                 isActive ? 'text-black' : 'text-neutral-500'
//                             }`}>
//                             {tab}
//                         </Text>
//                     </Pressable>
//                 );
//             })}
//         </View>
//     </View>
// );
