import HomeHorizontalList from '@/components/HomeHorizonalList';
import TrendingList from '@/components/TrendingList';
import { TrendingSkeleton, HorizontalListSkeleton } from '@/components/UI/Skeletons';
import { Colors } from '@/constants/Colors';
import { getCategorySlug, SectionHeadings } from '@/utils/dashBoardHelper';
import { fetchListData, fetchTrendingList } from '@/utils/tmdbService';
import { useQueries, useQuery } from '@tanstack/react-query';
import { ScrollView, View } from 'react-native';

const SECTIONS = [
    { heading: SectionHeadings.NowPlayingMovies, type: 'movie' as const },
    { heading: SectionHeadings.PopularMovies, type: 'movie' as const },
    { heading: SectionHeadings.TopRatedMovies, type: 'movie' as const },
    { heading: SectionHeadings.UpcomingMovies, type: 'movie' as const },
    { heading: SectionHeadings.AiringTodayTV, type: 'tv' as const },
    { heading: SectionHeadings.PopularTV, type: 'tv' as const },
    { heading: SectionHeadings.TopRatedTV, type: 'tv' as const },
    { heading: SectionHeadings.OnTheAirTV, type: 'tv' as const },
];

export default function HomeScreen() {
    const { data: trendingList, isLoading: isTrendingLoading } = useQuery({
        queryKey: ['TrendingList'],
        queryFn: fetchTrendingList,
    });

    const sectionQueries = useQueries({
        queries: SECTIONS.map((section) => ({
            queryKey: ['ListData', section.type, section.heading],
            queryFn: () =>
                fetchListData({
                    pageParam: 1,
                    type: section.type,
                    slug: getCategorySlug(section.heading),
                }),
        })),
    });

    return (
        <View className="flex-1" style={{ backgroundColor: Colors.background }}>
            <ScrollView showsVerticalScrollIndicator={false} className="px-3 pt-2">
                {isTrendingLoading ? (
                    <TrendingSkeleton />
                ) : (
                    <TrendingList listData={trendingList} />
                )}

                {sectionQueries.map((query, index) => {
                    const section = SECTIONS[index];

                    if (query.isLoading) {
                        return <HorizontalListSkeleton key={index} />;
                    }

                    return (
                        <HomeHorizontalList
                            key={`${section.type}-${section.heading}`}
                            ListHeading={section.heading}
                            listType={section.type}
                            listData={query.data}
                        />
                    );
                })}

                <View className="h-4" />
            </ScrollView>
        </View>
    );
}
