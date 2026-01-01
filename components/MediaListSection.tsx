import React, { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { MovieVM } from '@/models/MovieVM';
import { TVShowVM } from '@/models/TVShowVM';
import { getCategorySlug, SectionHeadings } from '@/utils/homeScreenHelper';
import { fetchListData } from '@/utils/tmdbService';
import MediaListItem from './MediaListItem';
import { HorizontalListSkeleton } from './UI/Skeletons';
import { Colors } from '@/constants/Colors';

type MediaListSectionProps = {
    listType: 'top_rated' | 'trending';
};
type ListMediaType = 'movies' | 'tv series' | 'anime';

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
} as const;

export default function MediaListSection({ listType }: MediaListSectionProps) {
    const [activeTab, setActiveTab] = useState<ListMediaType>('movies');

    const mediaType = activeTab === 'movies' ? 'movie' : 'tv';
    const ListHeading = HEADING_MAP[listType][activeTab];

    const { data, isLoading, isError } = useQuery({
        queryKey: ['media-list', listType, activeTab],
        queryFn: () =>
            fetchListData({
                pageParam: 1,
                type: mediaType,
                slug: getCategorySlug(ListHeading),
            }),
        placeholderData: (previousData) => previousData,
    });

    const showSkeleton = isLoading && !isError;

    return (
        <View>
            <View className="flex-row items-center justify-between pb-3 pt-6">
                <Pressable
                    className="flex-row items-center active:opacity-70"
                    onPress={() =>
                        router.push({
                            pathname: '/home/type-list',
                            params: {
                                type: mediaType,
                                slug: getCategorySlug(ListHeading),
                                title: ListHeading,
                            },
                        })
                    }>
                    <Text className="text-lg font-bold uppercase tracking-tight text-white">
                        {listType === 'trending' ? 'Trending' : 'Top Rated'}
                    </Text>
                    <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
                </Pressable>

                <View className="flex-row items-center gap-x-1.5">
                    {['movies', 'tv series', 'anime'].map((tab) => (
                        <Pressable
                            key={tab}
                            onPress={() => setActiveTab(tab as ListMediaType)}
                            className={`rounded-full border px-3 py-1 ${
                                activeTab === tab
                                    ? 'border-primary bg-primary/10'
                                    : 'border-neutral-800'
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

            {showSkeleton ? (
                <HorizontalListSkeleton hasTitle={false} />
            ) : (
                <FlatList<MovieVM | TVShowVM>
                    data={data as any[]}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ gap: 8 }}
                    renderItem={({ item }) => (
                        <MediaListItem data={item} type={mediaType} isGridView={false} />
                    )}
                />
            )}
        </View>
    );
}
