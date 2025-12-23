import HomeHorizontalList from '@/components/HomeHorizonalList';
import TrendingList from '@/components/TrendingList';
import { Colors } from '@/constants/Colors';
import { getCategorySlug, SectionHeadings } from '@/utils/dashBoardHelper';
import { fetchListData, fetchTrendingList } from '@/utils/tmdbService';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, ScrollView, View } from 'react-native';

export default function HomeScreen() {
    const { data: topRatedMovies, isLoading: isLoadingTopRatedMovies } = useQuery({
        queryKey: ['TopRatedTVMovies'],
        queryFn: () =>
            fetchListData({
                pageParam: 1,
                type: 'movie',
                slug: getCategorySlug(SectionHeadings.TopRatedMovies),
            }),
    });

    const { data: upcomingMovies, isLoading: isLoadingUpcomingMovies } = useQuery({
        queryKey: ['UpcomingMovies'],
        queryFn: () =>
            fetchListData({
                pageParam: 1,
                type: 'movie',
                slug: getCategorySlug(SectionHeadings.UpcomingMovies),
            }),
    });

    const { data: popularMovies, isLoading: isLoadingPopularMovies } = useQuery({
        queryKey: ['PopularMovies'],
        queryFn: () =>
            fetchListData({
                pageParam: 1,
                type: 'movie',
                slug: getCategorySlug(SectionHeadings.PopularMovies),
            }),
    });

    const { data: nowPlayingMovies, isLoading: isLoadingNowPlayingMovies } = useQuery({
        queryKey: ['NowPlayingMovies'],
        queryFn: () =>
            fetchListData({
                pageParam: 1,
                type: 'movie',
                slug: getCategorySlug(SectionHeadings.NowPlayingMovies),
            }),
    });

    const { data: topRatedTVSeries, isLoading: isLoadingTopRatedTVSeries } = useQuery({
        queryKey: ['TopRatedTVSeries'],
        queryFn: () =>
            fetchListData({
                pageParam: 1,
                type: 'tv',
                slug: getCategorySlug(SectionHeadings.TopRatedTV),
            }),
    });

    const { data: popularTVSeries, isLoading: isLoadingPopularTVSeries } = useQuery({
        queryKey: ['PopularTVSeries'],
        queryFn: () =>
            fetchListData({
                pageParam: 1,
                type: 'tv',
                slug: getCategorySlug(SectionHeadings.PopularTV),
            }),
    });
    const { data: onTheAirTVSeries, isLoading: isLoadingOnTheAirTVSeries } = useQuery({
        queryKey: ['OnTheAirTVSeries'],
        queryFn: () =>
            fetchListData({
                pageParam: 1,
                type: 'tv',
                slug: getCategorySlug(SectionHeadings.OnTheAirTV),
            }),
    });

    const { data: airingTodayTVSeries, isLoading: isLoadingAiringTodayTVSeries } = useQuery({
        queryKey: ['AiringTodayTVSeries'],
        queryFn: () =>
            fetchListData({
                pageParam: 1,
                type: 'tv',
                slug: getCategorySlug(SectionHeadings.AiringTodayTV),
            }),
    });

    const { data: trendingList, isLoading: isLoadingTrendingList } = useQuery({
        queryKey: ['TrendingList'],
        queryFn: fetchTrendingList,
    });

    const isLoading =
        isLoadingTopRatedMovies ||
        isLoadingUpcomingMovies ||
        isLoadingPopularMovies ||
        isLoadingNowPlayingMovies ||
        isLoadingTopRatedTVSeries ||
        isLoadingPopularTVSeries ||
        isLoadingOnTheAirTVSeries ||
        isLoadingTrendingList ||
        isLoadingAiringTodayTVSeries;

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    // if (error) {
    //     return <Text>{error.message}</Text>;
    // }
    return (
        <View className="flex-1" style={{ backgroundColor: Colors.background }}>
            <ScrollView showsVerticalScrollIndicator={false} className={'px-3'}>
                {/* Trending */}
                <TrendingList listData={trendingList} />

                {/* Movies */}
                <HomeHorizontalList
                    ListHeading={SectionHeadings.NowPlayingMovies}
                    listType="movie"
                    listData={nowPlayingMovies}
                />
                <HomeHorizontalList
                    ListHeading={SectionHeadings.PopularMovies}
                    listType="movie"
                    listData={popularMovies}
                />
                <HomeHorizontalList
                    ListHeading={SectionHeadings.TopRatedMovies}
                    listType="movie"
                    listData={topRatedMovies}
                />
                <HomeHorizontalList
                    ListHeading={SectionHeadings.UpcomingMovies}
                    listType="movie"
                    listData={upcomingMovies}
                />

                {/* TV Series */}
                <HomeHorizontalList
                    ListHeading={SectionHeadings.AiringTodayTV}
                    listType="tv"
                    listData={airingTodayTVSeries}
                />
                <HomeHorizontalList
                    ListHeading={SectionHeadings.PopularTV}
                    listType="tv"
                    listData={popularTVSeries}
                />
                <HomeHorizontalList
                    ListHeading={SectionHeadings.TopRatedTV}
                    listType="tv"
                    listData={topRatedTVSeries}
                />
                <HomeHorizontalList
                    ListHeading={SectionHeadings.OnTheAirTV}
                    listType="tv"
                    listData={onTheAirTVSeries}
                />
                <View className="h-4"></View>
            </ScrollView>
        </View>
    );
}
