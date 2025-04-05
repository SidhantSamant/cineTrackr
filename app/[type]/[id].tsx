import { getAllEpisodes, getCast, getDetails } from '@/utils/tmdbService';
import { useQuery } from '@tanstack/react-query';
import { Stack, useLocalSearchParams } from 'expo-router';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/constants/Colors';
import { MediaType } from '@/models/Show';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedRef,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useScrollViewOffset,
    useSharedValue,
} from 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useRef } from 'react';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

const renderCastItem = ({ item }: { item: any }) => (
    <View className="mr-4 items-center">
        <Image
            source={
                item.profile_path
                    ? {
                          uri: `https://image.tmdb.org/t/p/w500${item.profile_path}`,
                      }
                    : require('@/assets/images/placeholder_profile.jpg')
            }
            // className="h-24 w-24 rounded-full border-2 border-white"
            style={{
                width: 96,
                height: 96,
                borderRadius: 99,
                borderWidth: 2,
                borderColor: 'white',
            }}
            contentFit="cover"
            placeholderContentFit="cover"
        />

        <Text className="mt-2 text-sm text-white">{item.name}</Text>
        <Text className="max-w-24 text-center text-xs text-gray-300" numberOfLines={1}>
            {item.character || item.job}
        </Text>
    </View>
);

const MovieDetails = () => {
    const { id, type } = useLocalSearchParams<{ id: string; type: MediaType }>();

    const { data, isLoading, error } = useQuery({
        queryKey: [type, id],
        queryFn: () => getDetails(type, +id),
    });
    // console.log('Data', data);
    const { data: cast } = useQuery({
        queryKey: [type, 'cast', id],
        queryFn: () => getCast(type, +id),
    });
    // console.log('cast', cast);

    // const { data: episodes } = useQuery({
    //     queryKey: [type, 'episodes', id],
    //     queryFn: () => getAllEpisodes(+id, 1),
    // });
    // console.log('episodes', episodes);

    // const scrollRef = useAnimatedRef<Animated.ScrollView>();
    // const scrollOffset = useScrollViewOffset(scrollRef);

    const scrollOffset = useSharedValue(0);
    const handleScroll = useAnimatedScrollHandler((event) => {
        scrollOffset.value = event.contentOffset.y;
    });

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-IMG_HEIGHT, 0, IMG_HEIGHT],
                        [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75],
                    ),
                },
                {
                    scale: interpolate(scrollOffset.value, [-IMG_HEIGHT, 0, IMG_HEIGHT], [2, 1, 1]),
                },
            ],
        };
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollOffset.value,
                [0, IMG_HEIGHT / 1.5],
                [0, 1],
                Extrapolation.CLAMP,
            ),
        };
    });

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-[#121212]">
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    // Error state
    if (error) {
        return (
            <View className="flex-1 items-center justify-center bg-[#121212]">
                <Text className="text-white">No details found or an error occurred</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#121212]">
            <StatusBar style="auto" />

            <Stack.Screen
                options={{
                    title: data.title,
                    headerTransparent: true,
                    headerLeft: () => <Text>Back</Text>,
                    headerBackground: () => (
                        <Animated.View style={[styles.header, headerAnimatedStyle]} />
                    ),
                }}
            />
            <Animated.ScrollView
                className="flex-1 bg-[#121212]"
                // ref={scrollRef}
                onScroll={handleScroll}
                scrollEventThrottle={16}>
                <Animated.View style={[{ backgroundColor: '#121212' }, imageAnimatedStyle]}>
                    {/* Backdrop Image */}
                    <Image
                        source={{
                            uri: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
                        }}
                        placeholder={require('@/assets/images/placeholder_img.jpg')}
                        // className="mb-4 h-56 w-full rounded-b-lg"
                        style={{
                            width: '100%',
                            height: 224,
                            marginBottom: 8,
                        }}
                        contentFit="cover"
                        placeholderContentFit="cover"
                    />
                    {/* Movie Poster */}
                    <View
                        className="relative"
                        style={{
                            shadowColor: '#000000',
                            shadowOffset: {
                                width: 1,
                                height: 0,
                            },
                            shadowOpacity: 0,
                            shadowRadius: 15,
                            elevation: 0,
                        }}>
                        <Image
                            source={{
                                uri: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
                            }}
                            placeholder={require('@/assets/images/placeholder_img.jpg')}
                            // className="absolute left-4 top-[-80px] h-56 w-36 rounded-lg border-4 border-white"
                            style={{
                                position: 'absolute',
                                left: 16,
                                top: -64,
                                height: 168,
                                width: 108,
                                borderRadius: 8,
                            }}
                            contentFit="contain"
                            placeholderContentFit="cover"
                        />
                    </View>
                    {/* Title & Rating */}
                    <View className="ml-44 mt-4">
                        <Text className="text-3xl font-bold text-white">
                            {type === 'movie' ? data.title : data.name}
                        </Text>
                        <View className="mt-2 flex-row items-center">
                            <Text className="text-lg text-yellow-400">{data.vote_average}</Text>
                            <Text className="ml-2 text-sm text-gray-400">/ 10</Text>
                        </View>
                        <Text className="text-sm text-gray-400">({data.vote_count} votes)</Text>
                        <Text className="mt-2 text-sm text-gray-400">
                            Popularity: {data.popularity.toFixed(1)}
                        </Text>
                    </View>
                </Animated.View>
                <View className="bg-[#121212] p-3">
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
                        <Text className="text-xl font-semibold text-white">
                            Production Companies
                        </Text>
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
                        <Text className="text-xl font-semibold text-white">
                            Production Countries
                        </Text>
                        <Text className="mt-3 text-lg text-gray-300">
                            {data.production_countries
                                .map((country: any) => country.name)
                                .join(', ')}
                        </Text>
                    </View>

                    {/* Release Date & Runtime */}
                    <View className="mt-6">
                        <Text className="text-xl font-semibold text-white">
                            Release Date & Runtime
                        </Text>
                        <Text className="mt-3 text-lg text-gray-300">
                            Release Date:{' '}
                            {type === 'movie' ? data.release_date : data.first_air_date}
                        </Text>
                        {type === 'movie' && (
                            <Text className="mt-2 text-lg text-gray-300">
                                Runtime: {Math.floor(data.runtime / 60)}h {data.runtime % 60}m
                            </Text>
                        )}
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
                            <Text className="text-lg font-semibold text-white">
                                Add to Watchlist
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.ScrollView>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: width,
        height: IMG_HEIGHT,
    },
    header: {
        backgroundColor: '#121212',
        color: 'white',
        height: 100,
        borderWidth: StyleSheet.hairlineWidth,
    },
    // imageShadow: {
    //     shadowColor: '#000000',
    //     shadowOffset: {
    //         width: 1,
    //         height: 0,
    //     },
    //     shadowOpacity: 0,
    //     shadowRadius: 15,
    //     elevation: 0,
    // },
});

export default MovieDetails;
