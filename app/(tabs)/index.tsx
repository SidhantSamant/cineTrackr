import MovieListItem from '@/components/MovieListItem';
import { fetchTopRatedMovies } from '@/utils/tmdbService';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default function Movies() {
    const queryClient = useQueryClient();

    const { data, isLoading, isFetchingNextPage, error, fetchNextPage, refetch } = useInfiniteQuery(
        {
            queryKey: ['movies'],
            initialPageParam: 1,
            queryFn: fetchTopRatedMovies,
            getNextPageParam: (lastPage, pages) => pages.length + 1,
            gcTime: 0,
        },
    );
    const movies = data?.pages.flat();

    if (isLoading) {
        return <ActivityIndicator />;
    }

    if (error) {
        return <Text>{error.message}</Text>;
    }
    return (
        <View className="flex-1 ">
            <FlatList
                data={movies}
                numColumns={2}
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
                            <ActivityIndicator size="large" color="#0000ff" />
                        </View>
                    )
                }
                // ListFooterComponent={() => {
                // 	console.log("isLoading " + isLoading);
                // 	console.log("isFetchingNextPage " + isFetchingNextPage);

                // 	if (isLoading || isFetchingNextPage) {
                // 		return <ActivityIndicator size="large" color="#0000ff" style={{ paddingBottom: 50 }} />;
                // 	} else {
                // 		return null;
                // 	}
                // }}
            />
        </View>
    );
}
