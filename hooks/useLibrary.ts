import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../store/useAuthStore';
import UserLibraryVM, { MediaStatus, MediaType } from '@/models/UserLibraryVM';
import { libraryService } from '@/utils/libraryService';

// Query Keys for Caching
export const QUERY_KEYS = {
    library: 'user-library',
    itemStatus: 'library-item-status',
};

export const useLibrary = (status?: MediaStatus, isAnime?: boolean) => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: [QUERY_KEYS.library, status, isAnime],
        queryFn: () => libraryService.getLibrary(status, isAnime),
        enabled: !!user,
    });
};

export const useItemStatus = (tmdbId: number, mediaType: MediaType) => {
    const { user } = useAuthStore();

    return useQuery({
        queryKey: [QUERY_KEYS.itemStatus, tmdbId, mediaType],
        queryFn: () => libraryService.getItemStatus(tmdbId, mediaType),
        enabled: !!user && !!tmdbId,
    });
};

export const useLibraryMutations = () => {
    const queryClient = useQueryClient();

    const addToLibrary = useMutation({
        mutationFn: libraryService.upsertItem,

        onMutate: async (vars) => {
            await queryClient.cancelQueries({
                queryKey: [QUERY_KEYS.itemStatus, vars.tmdb_id, vars.media_type],
            });

            const previousStatus = queryClient.getQueryData([
                QUERY_KEYS.itemStatus,
                vars.tmdb_id,
                vars.media_type,
            ]);

            queryClient.setQueryData(
                [QUERY_KEYS.itemStatus, vars.tmdb_id, vars.media_type],
                (old: any) => ({
                    ...old,
                    id: 'temp-optimistic-id',
                    tmdb_id: vars.tmdb_id,
                    media_type: vars.media_type,
                    status: vars.status,
                    is_favorite: vars.is_favorite,
                }),
            );

            return { previousStatus };
        },
        onError: (err, vars, context) => {
            queryClient.setQueryData(
                [QUERY_KEYS.itemStatus, vars.tmdb_id, vars.media_type],
                context?.previousStatus,
            );
        },
        onSettled: (_, __, vars) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.itemStatus, vars.tmdb_id, vars.media_type],
            });
            // queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.library] });
        },
    });

    const removeFromLibrary = useMutation({
        mutationFn: ({ tmdbId, mediaType }: { tmdbId: number; mediaType: MediaType }) =>
            libraryService.removeItem(tmdbId, mediaType),
        onMutate: async (vars) => {
            const queryKey = [QUERY_KEYS.itemStatus, vars.tmdbId, vars.mediaType];
            await queryClient.cancelQueries({ queryKey });

            const previousItem = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, null);

            return { previousItem };
        },
        onError: (err, vars, context) => {
            queryClient.setQueryData(
                [QUERY_KEYS.itemStatus, vars.tmdbId, vars.mediaType],
                context?.previousItem,
            );
        },
        onSettled: (_, __, vars) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.itemStatus, vars.tmdbId, vars.mediaType],
            });
            // queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.library] });
        },
    });

    const toggleFavorite = useMutation({
        mutationFn: (vars: {
            id: string;
            isFavorite: boolean;
            tmdbId: number;
            mediaType: MediaType;
        }) => libraryService.updateFavorite(vars.id, vars.isFavorite),
        onMutate: async (vars) => {
            const queryKey = [QUERY_KEYS.itemStatus, vars.tmdbId, vars.mediaType];

            await queryClient.cancelQueries({ queryKey });

            const previousItem = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (old: UserLibraryVM | undefined) => {
                if (!old) return null;

                return {
                    ...old,
                    is_favorite: vars.isFavorite,
                    updated_at: new Date().toISOString(),
                };
            });

            return { previousItem };
        },
        onError: (err, vars, context) => {
            queryClient.setQueryData(
                [QUERY_KEYS.itemStatus, vars.tmdbId, vars.mediaType],
                context?.previousItem,
            );
        },
        onSettled: (_, __, vars) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.itemStatus, vars.tmdbId, vars.mediaType],
            });
            // queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.library] });
        },
    });

    const updateStatus = useMutation({
        mutationFn: (vars: {
            id: string;
            status: MediaStatus;
            tmdbId: number;
            mediaType: MediaType;
        }) => libraryService.updateStatus(vars.id, vars.status),
        onMutate: async (vars) => {
            const queryKey = [QUERY_KEYS.itemStatus, vars.tmdbId, vars.mediaType];

            await queryClient.cancelQueries({ queryKey });

            const previousItem = queryClient.getQueryData(queryKey);

            queryClient.setQueryData(queryKey, (old: UserLibraryVM | undefined) => {
                if (!old) return null;

                const now = new Date().toISOString();

                return {
                    ...old,
                    status: vars.status,
                    updated_at: now,
                    completed_at: vars.status === 'completed' ? now : null,
                };
            });

            return { previousItem };
        },
        onError: (err, vars, context) => {
            queryClient.setQueryData(
                [QUERY_KEYS.itemStatus, vars.tmdbId, vars.mediaType],
                context?.previousItem,
            );
        },
        onSettled: (_, __, vars) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.itemStatus, vars.tmdbId, vars.mediaType],
            });
            // queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.library] });
        },
    });

    return { addToLibrary, removeFromLibrary, toggleFavorite, updateStatus };
};
