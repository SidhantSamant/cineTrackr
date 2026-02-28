import HomeListSection from '@/components/HomeListSection';
import LibraryListSection from '@/components/LibraryListSection';
import TrendingList from '@/components/TrendingList';
import { TrendingSkeleton } from '@/components/UI/Skeletons';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/store/useAuthStore';
import { tmdbService } from '@/utils/tmdbService';
import { useQuery } from '@tanstack/react-query';
import { ScrollView, View } from 'react-native';

export default function HomeScreen() {
    const user = useAuthStore((state) => state.user);

    const { data: trendingList, isLoading: isTrendingLoading } = useQuery({
        queryKey: ['TrendingList'],
        queryFn: tmdbService.getTrendingList,
    });

    // const sectionQueries = useQueries({
    //     queries: HomeListSections.map((section) => ({
    //         queryKey: ['ListData', section.type, section.heading],
    //         queryFn: () =>
    //             fetchListData({
    //                 pageParam: 1,
    //                 type: section.type,
    //                 slug: getCategorySlug(section.heading),
    //             }),
    //     })),
    // });

    return (
        <View className="flex-1" style={{ backgroundColor: Colors.background }}>
            <ScrollView showsVerticalScrollIndicator={false} className="px-3 pt-2">
                {isTrendingLoading ? (
                    <TrendingSkeleton />
                ) : (
                    <TrendingList listData={trendingList} />
                )}

                {user && (
                    <>
                        <LibraryListSection
                            title="Continue Watching"
                            status="watching"
                            emptyMessage="Start watching something!"
                            isGridView={false}
                            showMovieTab={false}
                        />

                        <LibraryListSection
                            title="Your Watchlist"
                            status="watchlist"
                            emptyMessage="No items in your watchlist"
                            isGridView={false}
                        />

                        <LibraryListSection
                            title="Your Favorites"
                            isFavorite={true}
                            emptyMessage="No favorites yet"
                            isGridView={false}
                        />
                    </>
                )}

                <HomeListSection listType="trending" />
                <HomeListSection listType="hidden_gems" />
                <HomeListSection listType="top_rated" />

                <View className="h-8" />
            </ScrollView>
        </View>
    );
}
