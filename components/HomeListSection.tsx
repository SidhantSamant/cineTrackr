import { getCategorySlug, SectionHeadings } from '@/utils/homeScreenHelper';
import { tmdbService } from '@/utils/tmdbService';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import SectionHeader, { ListMediaType } from './SectionHeader';
import { MediaListSkeleton } from './UI/Skeletons';
import AnimatedHorizontalList from './UI/AnimatedHorizontalList';

type HomeListSectionProps = {
    listType: 'top_rated' | 'trending' | 'hidden_gems';
};

const HEADING_MAP = {
    trending: {
        shows: SectionHeadings.PopularTV,
        anime: SectionHeadings.TrendingAnime,
        movies: SectionHeadings.PopularMovies,
    },
    top_rated: {
        shows: SectionHeadings.TopRatedTV,
        anime: SectionHeadings.TopRatedAnime,
        movies: SectionHeadings.TopRatedMovies,
    },
    hidden_gems: {
        shows: SectionHeadings.HiddenGemsTV,
        anime: SectionHeadings.HiddenGemsAnime,
        movies: SectionHeadings.HiddenGemsMovies,
    },
} as const;

const SECTION_TITLES = {
    trending: 'Trending',
    top_rated: 'Top Rated',
    hidden_gems: 'Hidden Gems',
};

export default function HomeListSection({ listType }: HomeListSectionProps) {
    const [activeTab, setActiveTab] = useState<ListMediaType>('shows');
    const TABS: ListMediaType[] = ['shows', 'anime', 'movies'];
    const mediaType = activeTab === 'movies' ? 'movie' : 'tv';
    const listHeading = HEADING_MAP[listType][activeTab as keyof (typeof HEADING_MAP)['trending']];

    const { data, isLoading, isPlaceholderData } = useQuery({
        queryKey: ['media-list', listType, activeTab],
        queryFn: () =>
            tmdbService.getListData({
                pageParam: 1,
                type: mediaType,
                slug: getCategorySlug(listHeading),
            }),
        placeholderData: keepPreviousData,
    });

    const handleTabChange = useCallback((tab: ListMediaType) => {
        setActiveTab((prev) => {
            if (prev === tab) return prev;
            return tab;
        });
    }, []);

    const handleSeeAll = useCallback(() => {
        router.push({
            pathname: '/home/type-list',
            params: {
                type: mediaType,
                slug: getCategorySlug(listHeading),
                title: listHeading,
            },
        });
    }, [mediaType, listHeading]);

    if (isLoading) {
        return <MediaListSkeleton hasTitle={true} />;
    }

    return (
        <View>
            <SectionHeader
                title={SECTION_TITLES[listType]}
                activeTab={activeTab}
                tabs={TABS}
                onTabChange={handleTabChange}
                onSeeAll={handleSeeAll}
            />

            <AnimatedHorizontalList data={data} isPlaceholderData={isPlaceholderData} />
        </View>
    );
}
