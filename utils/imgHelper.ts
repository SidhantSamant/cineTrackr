import { ImageSource } from 'expo-image';
import { ImageURISource } from 'react-native';

// export const BLURHASH = '|rF?hV%2WCj[ayj[azj[azj[ayj[';
const BLURHASH =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

export const BLURHASH_TRANSITION = 300;

export const getBlurHash = (imageUrl?: string | null) => {
    return imageUrl ? BLURHASH : null;
};

type TMDBImageSize = 'w92' | 'w185' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original';

export const getTMDBImageUrl = (path?: string | null, size: TMDBImageSize = 'w342') => {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
};

export const getTMDBImageSource = (
    path?: string | null,
    size: TMDBImageSize = 'w342',
    placeholder: 'default' | 'profile' = 'default',
): ImageSource | undefined => {
    // if (!path) return undefined;
    if (!path) {
        switch (placeholder) {
            case 'default':
                return getPlaceholderImage();
            case 'profile':
                return getPlaceholderProfileImage();
        }
    }

    return { uri: getTMDBImageUrl(path, size)! };
};

export const getPlaceholderImage = (): ImageURISource => {
    return require('@/assets/images/placeholder_img.jpg');
};

export const getPlaceholderProfileImage = (): ImageURISource => {
    return require('@/assets/images/placeholder_profile.jpg');
};
