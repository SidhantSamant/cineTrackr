import { getMovieCast, getMovieDetails } from '@/utils/tmdbService';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';

const MovieDetails = () => {
    const { id } = useLocalSearchParams<{ id: string }>();

    const { data, isLoading, error } = useQuery({
        queryKey: ['movies', id],
        queryFn: () => getMovieDetails(+id),
    });

    const { data: cast } = useQuery({
        queryKey: ['movies', 'cast', id],
        queryFn: () => getMovieCast(+id),
    });
    // console.log('cast', cast);

    const renderCastItem = ({ item }: { item: any }) => (
        <View className="mr-4 items-center">
            {item.profile_path ? (
                <Image
                    source={{
                        uri: `https://image.tmdb.org/t/p/w500${item.profile_path}`,
                    }}
                    className="h-24 w-24 rounded-full border-2 border-white"
                    contentFit="cover"
                />
            ) : (
                <View className="h-24 w-24 items-center justify-center rounded-full border-2 border-white bg-gray-600">
                    <Text className="text-xl text-white">{item.name.charAt(0)}</Text>
                </View>
            )}
            <Text className="mt-2 text-sm text-white">{item.name}</Text>
            <Text className="max-w-24 text-center text-xs text-gray-300" numberOfLines={1}>
                {item.character || item.job}
            </Text>
        </View>
    );
    // const queryClient = useQueryClient();
    // const { mutate, isPending } = useMutation({
    //     mutationFn: () => addMovieToWatchlist(+id),
    //     onSuccess: () => queryClient.invalidateQueries(['watchlist']),
    // });
    // Loading state
    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-900">
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View className="flex-1 items-center justify-center bg-gray-900">
                <Text className="text-white">No details found or an error occurred</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-[#121212] p-3">
            <Stack.Screen options={{ title: data.title }} />
            {/* Backdrop Image */}
            <Image
                source={{
                    uri: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
                }}
                placeholder={require('@/assets/placeholder_img.jpg')}
                className="mb-4 h-56 w-full rounded-b-lg"
                contentFit="cover"
            />

            {/* Movie Poster */}
            <View className="relative">
                <Image
                    source={{
                        uri: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
                    }}
                    placeholder={require('@/assets/placeholder_img.jpg')}
                    className="absolute left-4 top-[-80px] h-56 w-36 rounded-lg border-4 border-white"
                    contentFit="contain"
                />
            </View>
            {/* Title & Rating */}
            <View className="ml-44 mt-4">
                <Text className="text-3xl font-bold text-white">{data.title}</Text>
                <View className="mt-2 flex-row items-center">
                    <Text className="text-lg text-yellow-400">{data.vote_average}</Text>
                    <Text className="ml-2 text-sm text-gray-400">/ 10</Text>
                </View>
                <Text className="text-sm text-gray-400">({data.vote_count} votes)</Text>
                <Text className="mt-2 text-sm text-gray-400">
                    Popularity: {data.popularity.toFixed(1)}
                </Text>
            </View>

            {/* Tagline */}
            <Text className="mt-4 text-lg italic text-gray-400">"{data.tagline}"</Text>

            {/* Overview */}
            <View className="mt-6">
                <Text className="text-xl font-semibold text-white">Overview</Text>
                <Text className="mt-2 text-lg text-gray-300">{data.overview}</Text>
            </View>

            {/* Genres */}
            <View className="mt-6">
                <Text className="text-xl font-semibold text-white">Genres</Text>
                <View className="mt-3 flex-row flex-wrap">
                    {data.genres.map((genre: any) => (
                        <TouchableOpacity
                            key={genre.id}
                            className="mb-2 mr-2 rounded-full bg-gray-700 px-4 py-2">
                            <Text className="text-sm text-white">{genre.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Production Companies */}
            <View className="mt-6">
                <Text className="text-xl font-semibold text-white">Production Companies</Text>
                <View className="mt-3">
                    {data.production_companies.map((company: any) => (
                        <View key={company.id} className="mb-2 flex-row items-center">
                            {company.logo_path && (
                                <Image
                                    source={{
                                        uri: `https://image.tmdb.org/t/p/w500${company.logo_path}`,
                                    }}
                                    className="mr-4 h-12 w-12"
                                    contentFit="contain"
                                    tintColor={'#ffffff'}
                                />
                            )}
                            <Text className="text-lg text-white">{company.name}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Production Countries */}
            <View className="mt-6">
                <Text className="text-xl font-semibold text-white">Production Countries</Text>
                <Text className="mt-3 text-lg text-gray-300">
                    {data.production_countries.map((country: any) => country.name).join(', ')}
                </Text>
            </View>

            {/* Release Date & Runtime */}
            <View className="mt-6">
                <Text className="text-xl font-semibold text-white">Release Date & Runtime</Text>
                <Text className="mt-3 text-lg text-gray-300">
                    Release Date: {data.release_date}
                </Text>
                <Text className="mt-2 text-lg text-gray-300">
                    Runtime: {Math.floor(data.runtime / 60)}h {data.runtime % 60}m
                </Text>
            </View>
            {/* Cast and Crew */}
            <View className="mt-6">
                <Text className="text-xl font-semibold text-white">Cast & Crew</Text>
                <FlatList
                    data={cast}
                    renderItem={renderCastItem}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                />
            </View>

            {/* Action Buttons */}
            <View className="my-6 flex-row justify-around">
                <TouchableOpacity
                    className="rounded-full bg-blue-600 px-6 py-2"
                    onPress={() => console.log('Play Movie')}>
                    <Text className="text-lg font-semibold text-white">Play Movie</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className="rounded-full bg-red-600 px-6 py-2"
                    onPress={() => console.log('Add to Watchlist')}>
                    <Text className="text-lg font-semibold text-white">Add to Watchlist</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default MovieDetails;
