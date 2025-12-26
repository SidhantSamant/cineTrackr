import { MovieVM } from '@/models/MovieVM';
import { MediaType, TVShowVM } from '@/models/TVShowVM';
import { BLURHASH_TRANSITION, getBlurHash, getTMDBImageSource } from '@/utils/imgHelper';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable } from 'react-native';

type MovieListItemProps = {
    data?: MovieVM | TVShowVM;
    isGridView: boolean;
    type: MediaType;
};

const MovieListItem = ({ isGridView, data, type }: MovieListItemProps) => {
    return (
        <Pressable
            style={{ width: isGridView ? '33%' : 100 }}
            onPress={() => router.navigate(`/${type}/${data?.id}`)}>
            <Image
                source={getTMDBImageSource(data?.poster_path)}
                style={{ width: '100%', aspectRatio: 3 / 5, borderRadius: 16 }}
                contentFit="cover"
                placeholderContentFit="cover"
                placeholder={getBlurHash(data?.poster_path)}
                transition={BLURHASH_TRANSITION}
            />
        </Pressable>
    );
};

export default MovieListItem;
