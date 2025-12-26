import MovieListItem from '@/components/MovieListItem';
import { Colors } from '@/constants/Colors';
import { useGlobalError } from '@/context/GlobalErrorContext';
import { MediaType } from '@/models/TVShowVM';
import { fetchListData } from '@/utils/tmdbService';
import { useInfiniteQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

export default function MoviesScreen() {
    const navigation = useNavigation();
    const { showError } = useGlobalError();
    const { type, slug, title } = useLocalSearchParams<{
        type: MediaType;
        slug: string;
        title: string;
    }>();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: title,
        });
    }, [navigation, title]);

    const { data, isLoading, isFetchingNextPage, error, fetchNextPage, refetch } = useInfiniteQuery(
        {
            queryKey: [type, slug],
            initialPageParam: 1,
            queryFn: ({ pageParam }) => fetchListData({ pageParam, type, slug }),
            getNextPageParam: (lastPage, pages) => pages.length + 1,
            gcTime: 0,
        },
    );

    const listData = data?.pages.flat();

    useEffect(() => {
        if (error || (!listData && !isLoading)) {
            showError({
                leftButtonText: 'Go Back',
                onLeftButtonPress: router.back,
                rightButtonText: 'Retry',
                onRightButtonPress: refetch,
            });
        }
    }, [error, listData, isLoading]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-[#121212]">
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (error || (!listData && !isLoading)) {
        return <View className="flex-1 bg-[#121212]" />;
    }

    return (
        <View className="flex-1 pr-2" style={{ backgroundColor: Colors.background }}>
            <FlatList
                data={listData}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ gap: 8, padding: 8 }}
                columnWrapperStyle={{ gap: 8 }}
                renderItem={({ item }) => (
                    <MovieListItem data={item} type={type} isGridView={true} />
                )}
                onEndReached={() => {
                    fetchNextPage();
                }}
                refreshing={isLoading && isFetchingNextPage}
                onRefresh={refetch}
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
