import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { mapLibraryToTmdb } from '@/utils/mappers';
import { LibraryFilters, libraryService } from '@/utils/libraryService';
import { QUERY_KEYS } from './useLibrary';

export const useMappedLibrary = (filters: LibraryFilters, limit?: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.library, filters],
        queryFn: async () => {
            const data = await libraryService.getLibrary(filters, limit);
            return data.map(mapLibraryToTmdb);
        },
        placeholderData: keepPreviousData,
    });
};
