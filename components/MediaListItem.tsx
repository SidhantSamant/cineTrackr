import { Colors } from '@/constants/Colors';
import { useThrottle } from '@/hooks/useThrottle';
import { MovieVM } from '@/models/MovieVM';
import { MediaType, TVShowVM } from '@/models/TVShowVM';
import { BLURHASH_TRANSITION, getBlurHash, getTMDBImageSource } from '@/utils/imgHelper';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Pressable } from 'react-native';

type MediaListItemProps = {
    data?: MovieVM | TVShowVM;
    isGridView: boolean;
    type: MediaType;
    isLibrary?: boolean;
};

const MediaListItem = ({ isGridView, isLibrary, data, type }: MediaListItemProps) => {
    const { id: currentId, type: currentType } = useLocalSearchParams<{
        id: string;
        type: string;
    }>();

    const width = isGridView ? (isLibrary ? '100%' : '32.6%') : 100;

    const handlePress = useThrottle(() => {
        if (!data?.id) return;

        if (currentId === String(data.id) && currentType === type) {
            return;
        }

        router.push(`/${type}/${data.id}`);
    }, 500);

    return (
        //<Pressable style={{ width: width }} onPress={() => router.navigate(`/${type}/${data?.id}`)}>
        <Pressable style={{ width: width }} onPress={handlePress}>
            <Image
                source={getTMDBImageSource(data?.poster_path)}
                style={{
                    width: '100%',
                    aspectRatio: 3 / 5,
                    borderRadius: 16,
                    backgroundColor: Colors.imgBackground,
                }}
                contentFit="cover"
                placeholderContentFit="cover"
                placeholder={getBlurHash(data?.poster_path)}
                transition={BLURHASH_TRANSITION}
            />
        </Pressable>
    );
};

export default MediaListItem;
