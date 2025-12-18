import { Movie } from '@/models/Movie';
import { MediaType, TVShow } from '@/models/Show';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';

type MovieListItemProps = {
    data?: Movie | TVShow;
    isGridView: boolean;
    type: MediaType;
};

const MovieListItem = ({ isGridView, data, type }: MovieListItemProps) => {
    return (
        <Link href={`/${type}/${data?.id}`} asChild>
            <Pressable style={{ width: isGridView ? '33%' : 100 }}>
                <Image
                    placeholder={require('@/assets/images/placeholder_img.jpg')}
                    source={{ uri: `https://image.tmdb.org/t/p/w500${data?.poster_path}` }}
                    style={{ width: '100%', aspectRatio: 3 / 5, borderRadius: 16 }}
                    contentFit="cover"
                    placeholderContentFit="cover"
                />
            </Pressable>
        </Link>
    );
};

export default MovieListItem;
