import MediaListItem from '@/components/MediaListItem';
import { Colors } from '@/constants/Colors';
import { useGlobalError } from '@/context/GlobalErrorContext';
import { MediaType } from '@/models/TVShowVM';
import { MediaStatus } from '@/models/UserLibraryVM';
import { LibraryFilters, libraryService } from '@/utils/libraryService';
import { mapLibraryToTmdb } from '@/utils/mappers';
import { tmdbService } from '@/utils/tmdbService';
import { useInfiniteQuery } from '@tanstack/react-query';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useMemo } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

export default function LibraryListScreen() {
    const navigation = useNavigation();
    const { showError } = useGlobalError();
    // const { slug, title } = useLocalSearchParams<{
    //     slug: string;
    //     title: string;
    // }>();

    const { title, status, isAnime, isFavorite, type } = useLocalSearchParams<{
        title: string;
        status?: string;
        isAnime?: string;
        isFavorite?: string;
        type?: string;
    }>();

    const filters: LibraryFilters = useMemo(
        () => ({
            status: status as MediaStatus | undefined,
            mediaType: type as MediaType,
            isAnime: isAnime === 'true' ? true : undefined,
            isFavorite: isFavorite === 'true' ? true : undefined,
        }),
        [],
    );

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: title,
        });
    }, [navigation, title]);

    const { data, isLoading, isFetchingNextPage, error, fetchNextPage, refetch } = useInfiniteQuery(
        {
            queryKey: ['library', filters],
            initialPageParam: 1,
            queryFn: async ({ pageParam }) => {
                const data = await libraryService.getLibrary(filters, pageParam);
                return data.map(mapLibraryToTmdb);
            },
            // queryFn: ({ pageParam }) => libraryService.getLibrary({ slug, pageParam}),
            getNextPageParam: (lastPage, pages) => pages.length + 1,
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
                contentContainerStyle={{ gap: 8, padding: 8, flexGrow: 1 }}
                columnWrapperStyle={{ gap: 8 }}
                renderItem={({ item }) => (
                    <MediaListItem data={item} type={type as MediaType} isGridView={true} />
                )}
                onEndReached={() => {
                    fetchNextPage();
                }}
                refreshing={isLoading && isFetchingNextPage}
                onRefresh={refetch}
                ListFooterComponent={() =>
                    isFetchingNextPage && <ActivityIndicator size="large" color={Colors.primary} />
                }
            />
        </View>
    );
}
