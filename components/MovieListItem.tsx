import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Movie } from '@/models/Movie';
import { MediaType, TVShow } from '@/models/Show';
import { Image } from 'expo-image';

const MovieListItem = ({ movie, type }: { movie?: Movie | TVShow; type: MediaType }) => {
    return (
        <Link
            // href={{
            // 	pathname: "/[id]",
            // 	params: { id: movie.id },
            // }}
            href={`/${type}/${movie?.id}`}
            asChild>
            {/* <Pressable style={{ flex: 1 }}>
                <Image
                    source={{
                        uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
                    }}
                    style={{ width: '100%', aspectRatio: 3 / 5, borderRadius: 16 }}
                />
            </Pressable> */}
            <Pressable style={{ width: '33%' }}>
                <Image
                    placeholder={require('@/assets/images/placeholder_img.jpg')}
                    source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }}
                    style={{ width: '100%', aspectRatio: 3 / 5, borderRadius: 16 }}
                />
            </Pressable>
        </Link>
    );
};

export default MovieListItem;
