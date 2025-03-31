import { View, Text, Image, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { Movie } from '@/models/Movie';
import { TVShow } from '@/models/Show';

const MovieListItem = ({ movie }: { movie?: Movie | TVShow }) => {
    return (
        <Link
            // href={{
            // 	pathname: "/[id]",
            // 	params: { id: movie.id },
            // }}
            href={`/${movie?.id}`}
            asChild>
            <Pressable style={{ flex: 1 }}>
                <Image
                    source={{
                        uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
                    }}
                    style={{ width: '100%', aspectRatio: 3 / 5, borderRadius: 16 }}
                />
            </Pressable>
        </Link>
    );
};

export default MovieListItem;
