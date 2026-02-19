import { useGlobalError } from '@/context/GlobalErrorContext';
import { useToast } from '@/context/ToastContext';
import { useLibraryMutations } from '@/hooks/useLibrary';
import UserLibraryVM, { MediaStatus, MediaType } from '@/models/UserLibraryVM';
import { useAuthStore } from '@/store/useAuthStore';
import { getYouTubeKey } from '@/utils/detailHelper';
import { mapTmdbToLibraryItem } from '@/utils/mappers';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';

type Params = {
    libraryItem?: Partial<UserLibraryVM> | null;
    data: any;
    type: MediaType;
};

export const useMediaActions = ({ libraryItem, data, type }: Params) => {
    const user = useAuthStore((state) => state.user);
    const { showWarning } = useGlobalError();
    const { showErrorToast, showSuccessToast } = useToast();
    const router = useRouter();
    const { addToLibrary, removeFromLibrary, updateStatus, toggleFavorite } = useLibraryMutations();

    const requireAuth = (actionName: string) => {
        if (!user) {
            showWarning({
                message: `Sign in to ${actionName}`,
                rightButtonText: 'Sign In',
                onRightButtonPress: () => router.navigate('/(auth)/login'),
            });
            return false;
        }
        return true;
    };

    /**
     * Handles "Watchlist", "Watched" buttons.
     */
    const handleStatusPress = (targetAction: MediaStatus) => {
        if (!requireAuth(targetAction === 'watchlist' ? 'add to watchlist' : 'mark as watched'))
            return;

        if (libraryItem) {
            if (libraryItem.status !== targetAction) {
                updateStatus.mutate({
                    id: libraryItem.id!,
                    status: targetAction,
                    tmdbId: data.id,
                    mediaType: type,
                });
            } else if (!libraryItem.is_favorite) {
                removeFromLibrary.mutate({
                    tmdbId: data.id,
                    mediaType: type,
                });
            } else {
                updateStatus.mutate({
                    id: libraryItem.id!,
                    status: null,
                    tmdbId: data.id,
                    mediaType: type,
                });
            }
        } else {
            const payload = mapTmdbToLibraryItem(user!.id, data, type);
            addToLibrary.mutate({ ...payload, status: targetAction });
        }

        showSuccessToast(`Watchlist updated`);
    };

    /**
     * Handles the Favorite button.
     */
    const handleFavoritePress = () => {
        if (!requireAuth('mark as favorite')) return;

        if (libraryItem) {
            if (libraryItem.status) {
                toggleFavorite.mutate({
                    id: libraryItem.id!,
                    isFavorite: !libraryItem.is_favorite,
                    tmdbId: data.id,
                    mediaType: type,
                });
            } else {
                removeFromLibrary.mutate({ tmdbId: data.id, mediaType: type });
            }
        } else {
            const payload = mapTmdbToLibraryItem(user!.id, data, type);
            addToLibrary.mutate({ ...payload, is_favorite: true });
        }

        showSuccessToast(`Favorites updated`);
    };

    /**
     * Handles the Watch Trailer button.
     */
    const handleWatchTrailer = async () => {
        const videoKey = getYouTubeKey(data?.videos?.results);
        const query = `${data?.title ?? data?.name ?? ''} Trailer`;

        try {
            const url = videoKey
                ? `https://www.youtube.com/watch?v=${videoKey}`
                : `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

            await Linking.openURL(url);
        } catch (err) {
            showErrorToast('Could not open video link');
        }
    };

    return {
        handleWatchTrailer,
        handleStatusPress,
        handleFavoritePress,
    };
};
