import HomeHorizontalList from '@/components/HorizontalMediaList';
import HomeHorizontalListSection from '@/components/MediaListSection';
import TrendingList from '@/components/TrendingList';
import { HorizontalListSkeleton, TrendingSkeleton } from '@/components/UI/Skeletons';
import { Colors } from '@/constants/Colors';
import { getCategorySlug, HomeListSections } from '@/utils/homeScreenHelper';
import { fetchListData, fetchTrendingList } from '@/utils/tmdbService';
import { useQueries, useQuery } from '@tanstack/react-query';
import { ScrollView, View } from 'react-native';

export default function HomeScreen() {
    const { data: trendingList, isLoading: isTrendingLoading } = useQuery({
        queryKey: ['TrendingList'],
        queryFn: fetchTrendingList,
    });

    const sectionQueries = useQueries({
        queries: HomeListSections.map((section) => ({
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

                <HomeHorizontalListSection listType="trending" />

                {sectionQueries.map((query, index) => {
                    const section = HomeListSections[index];

                    if (query.isLoading || query.isError) {
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

                <HomeHorizontalListSection listType="top_rated" />

                <View className="h-8" />
            </ScrollView>
        </View>
    );
}
