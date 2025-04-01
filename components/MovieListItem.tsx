import { View, Text, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Movie } from '@/models/Movie';
import { TVShow } from '@/models/Show';
import { Image } from 'expo-image';

const MovieListItem = ({ movie }: { movie?: Movie | TVShow }) => {
    return (
        <Link
            // href={{
            // 	pathname: "/[id]",
            // 	params: { id: movie.id },
            // }}
            href={`/${movie?.id}`}
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
                    placeholder={require('@/assets/placeholder_img.jpg')}
                    source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }}
                    style={{ width: '100%', aspectRatio: 3 / 5, borderRadius: 16 }}
                />
            </Pressable>
        </Link>
    );
};

export default MovieListItem;
