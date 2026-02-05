import { Colors } from '@/constants/Colors';
import { MovieVM } from '@/models/MovieVM';
import { MediaType, TVShowVM } from '@/models/TVShowVM';
import { BLURHASH_TRANSITION, getBlurHash, getTMDBImageSource } from '@/utils/imgHelper';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

type MediaListItemProps = {
    data?: MovieVM | TVShowVM;
    isGridView: boolean;
    type: MediaType;
    isLibrary?: boolean;
};

const MediaListItem = ({ isGridView, isLibrary, data, type }: MediaListItemProps) => {
    const width = isGridView ? (isLibrary ? '100%' : '32.6%') : 100;
    return (
        <Pressable style={{ width: width }} onPress={() => router.navigate(`/${type}/${data?.id}`)}>
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
