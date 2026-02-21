import PaginatedMediaGrid from '@/components/UI/PaginatedMediaGrid';
import { MediaType } from '@/models/TVShowVM';
import { tmdbService } from '@/utils/tmdbService';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

export default function TypeListScreen() {
    const navigation = useNavigation();
    const { type, slug, title } = useLocalSearchParams<{
        type: MediaType;
        slug: string;
        title: string;
    }>();

    useLayoutEffect(() => {
        navigation.setOptions({ headerTitle: title });
    }, [navigation, title]);

    const { data, isLoading, isFetchingNextPage, error, fetchNextPage, hasNextPage, refetch } =
        useInfiniteQuery({
            queryKey: [type, slug],
            initialPageParam: 1,
            queryFn: ({ pageParam }) => tmdbService.getListData({ pageParam, type, slug }),
            getNextPageParam: (lastPage, pages) =>
                lastPage.length === 20 ? pages.length + 1 : undefined,
        });

    return (
        <PaginatedMediaGrid
            listData={data?.pages.flat()}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
            error={error}
            hasNextPage={!!hasNextPage}
            fetchNextPage={fetchNextPage}
            refetch={refetch}
        />
    );
}
