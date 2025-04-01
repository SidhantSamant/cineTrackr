import { Text, StyleSheet, FlatList, View, ActivityIndicator } from 'react-native';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import MovieListItem from '@/components/MovieListItem';
import { fetchTopRatedTVShows } from '@/utils/tmdbService';
import { Colors } from '@/constants/Colors';

export default function Movies() {
    const queryClient = useQueryClient();

    const { data, isLoading, isFetchingNextPage, error, fetchNextPage, refetch } = useInfiniteQuery(
        {
            queryKey: ['series'],
            initialPageParam: 1,
            queryFn: fetchTopRatedTVShows,
            getNextPageParam: (lastPage, pages) => pages.length + 1,
            gcTime: 0,
        },
    );
    const tvshows = data?.pages.flat();
    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (error) {
        return <Text>{error.message}</Text>;
    }
    return (
        <View className="flex-1" style={{ backgroundColor: Colors.background }}>
            <FlatList
                data={tvshows}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ gap: 8, padding: 8 }}
                columnWrapperStyle={{ gap: 8 }}
                renderItem={({ item }) => <MovieListItem movie={item} />}
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
