import MovieListItem from '@/components/MovieListItem';
import { Colors } from '@/constants/Colors';
import { fetchListData } from '@/utils/tmdbService';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default function TVSeriesScreen() {
    const queryClient = useQueryClient();

    const { data, isLoading, isFetchingNextPage, error, fetchNextPage, refetch } = useInfiniteQuery(
        {
            queryKey: ['series'],
            initialPageParam: 1,
            queryFn: () => fetchListData({ pageParam: 1, type: 'tv', slug: 'top_rated' }),
            getNextPageParam: (lastPage, pages) => pages.length + 1,
            gcTime: 0,
        },
    );
    const tvSeries = data?.pages.flat();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-[#121212]">
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (error) {
        return <Text>{error.message}</Text>;
    }
    return (
        <View className="flex-1 pr-2" style={{ backgroundColor: Colors.background }}>
            <FlatList
                data={tvSeries}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ gap: 8, padding: 8 }}
                columnWrapperStyle={{ gap: 8 }}
                renderItem={({ item }) => <MovieListItem data={item} type="tv" isGridView={true} />}
                onEndReached={() => {
                    fetchNextPage();
                }}
                refreshing={isLoading && isFetchingNextPage}
                onRefresh={() => {
                    // queryClient.invalidateQueries(["movies"]);
                    refetch();
                }}
                ListFooterComponent={() =>
                    isFetchingNextPage && (
                        <View>
                            <ActivityIndicator size="large" color={Colors.primary} />
                        </View>
                    )
                }
            />
        </View>
    );
}
