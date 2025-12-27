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
};

const MediaListItem = ({ isGridView, data, type }: MediaListItemProps) => {
    return (
        <Pressable
            style={{ width: isGridView ? '33%' : 100 }}
            onPress={() => router.navigate(`/${type}/${data?.id}`)}>
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
