import PaginatedMediaGrid from '@/components/UI/PaginatedMediaGrid';
import { MediaType } from '@/models/TVShowVM';
import { MediaStatus } from '@/models/UserLibraryVM';
import { LibraryFilters, libraryService } from '@/utils/libraryService';
import { mapLibraryToTmdb } from '@/utils/mappers';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useMemo } from 'react';

export default function LibraryListScreen() {
    const navigation = useNavigation();
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
        [status, type, isAnime, isFavorite],
    );

    useLayoutEffect(() => {
        navigation.setOptions({ headerTitle: title });
    }, [navigation, title]);

    const { data, isLoading, isFetchingNextPage, error, fetchNextPage, hasNextPage, refetch } =
        useInfiniteQuery({
            queryKey: ['library', filters],
            initialPageParam: 1,
            queryFn: async ({ pageParam }) => {
                const data = await libraryService.getLibrary(filters, pageParam);
                return data.map(mapLibraryToTmdb);
            },
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
