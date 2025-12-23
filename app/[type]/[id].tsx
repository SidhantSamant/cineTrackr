import HomeHorizontalList from '@/components/HomeHorizonalList';
import { Colors } from '@/constants/Colors';
import { CastVM } from '@/models/BaseMediaVM';
import { MediaType } from '@/models/TVShowVM';
import { getYouTubeKey } from '@/utils/detailHelper';
import { getDetails } from '@/utils/tmdbService';
import {
    formatMovieRuntime,
    formatTVSeasonsMeta,
    formatTVYear,
    getMovieYear,
} from '@/utils/uiHelper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useSharedValue,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

const renderCastItem = ({ item }: { item: any }) => (
    <View className="my-2 mr-4 items-center">
        <Image
            source={
                item.profile_path
                    ? {
                          uri: `https://image.tmdb.org/t/p/w500${item.profile_path}`,
                      }
                    : require('@/assets/images/placeholder_profile.jpg')
            }
            style={{
                width: 96,
                height: 96,
                borderRadius: 99,
                // borderWidth: 2,
                // borderColor: 'white',
            }}
            contentFit="cover"
            placeholderContentFit="cover"
        />

        <Text className="text-sm text-white">{item.name}</Text>
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

    // const { data: cast } = useQuery({
    //     queryKey: [type, 'cast', id],
    //     queryFn: () => getCast(type, +id),
    // });

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
                        Extrapolation.CLAMP,
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

    const handleWatchTrailer = async () => {
        // 1. Try to get the specific video key
        const videoKey = getYouTubeKey(data?.videos?.results);

        if (videoKey) {
            // 2. Open directly in YouTube App or Browser
            const url = `https://www.youtube.com/watch?v=${videoKey}`;
            const supported = await Linking.canOpenURL(url);

            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Error', 'Cannot open YouTube');
            }
        } else {
            // 3. FALLBACK: If no video key exists, Search for it
            const query = `${data?.title} Trailer`;
            const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
            Linking.openURL(searchUrl);
        }
    };

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

    const meta = data
        ? type === 'movie'
            ? formatMovieRuntime(data)
            : formatTVSeasonsMeta(data)
        : '';

    const formatedDate = data ? (type === 'movie' ? getMovieYear(data) : formatTVYear(data)) : '';

    return (
        <View className="flex-1 bg-[#121212]">
            <StatusBar style="auto" />

            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <Animated.Text
                            numberOfLines={1}
                            style={[
                                {
                                    textAlign: 'center',
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: 18,
                                    marginHorizontal: 8,
                                },
                                headerAnimatedStyle,
                            ]}>
                            {type === 'movie' ? data.title : data.name}
                        </Animated.Text>
                    ),
                    headerTitleAlign: 'center',
                    headerTransparent: true,
                    headerLeft: () => (
                        <Pressable
                            className="rounded-full p-2"
                            onPress={router.back}
                            hitSlop={20}
                            style={{ backgroundColor: 'rgba(30, 30, 30, 0.5)' }}>
                            <Ionicons name="chevron-back" size={24} color="white" />
                        </Pressable>
                    ),
                    headerBackground: () => (
                        <Animated.View style={[styles.header, headerAnimatedStyle]} />
                    ),
                }}
            />
            <Animated.ScrollView
                className="flex-1 bg-[#121212]"
                // ref={scrollRef}
                onScroll={handleScroll}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={16}>
                <Animated.View style={[{ backgroundColor: Colors.background }, imageAnimatedStyle]}>
                    {/* Backdrop Image */}
                    <Image
                        source={{
                            uri: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
                        }}
                        placeholder={require('@/assets/images/placeholder_img.jpg')}
                        style={{
                            width: '100%',
                            height: 224,
                            marginBottom: 8,
                        }}
                        contentFit="cover"
                        placeholderContentFit="cover"
                    />
                    <LinearGradient
                        // Button Linear Gradient
                        style={{
                            width: '100%',
                            height: 224,
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        }}
                        colors={['transparent', 'transparent', Colors.background]}
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
                            style={{
                                position: 'absolute',
                                left: 16,
                                top: -64,
                                height: 152,
                                width: 98,
                                borderRadius: 8,
                            }}
                            contentFit="cover"
                            placeholderContentFit="cover"
                        />
                        {/* <LinearGradient
                            style={{
                                position: 'absolute',
                                left: 16,
                                top: -64,
                                height: 152,
                                width: 98,
                                borderRadius: 8,
                            }}
                            colors={['transparent', 'transparent', Colors.background]}
                        /> */}
                    </View>
                    {/* Title & Rating */}
                    <View className="ml-36">
                        <Text className="text-2xl font-bold text-white">
                            {type === 'movie' ? data.title : data.name}
                        </Text>
                        <View className="mt-1 flex-row items-center">
                            <Ionicons name="star" size={14} color="#facc15" />

                            <Text className="ml-0.5 text-lg font-semibold text-yellow-400 ">
                                {data.vote_average.toFixed(1)}
                            </Text>
                            <Text className="font-semibolde mx-4 text-lg text-white">
                                {formatedDate}
                            </Text>
                            <Text className="font-semibolde text-lg text-white">
                                {type === 'movie' ? meta : ''}
                            </Text>
                        </View>
                        <Text className="text-lg text-white">{type !== 'movie' ? meta : ''}</Text>
                    </View>
                    {/* Action Buttons */}
                    <View className="mt-6 flex-1 flex-row items-center justify-evenly gap-2">
                        <View className="items-center">
                            <Pressable
                                className="rounded-full bg-white/10 p-3 active:bg-orange-300/30"
                                onPress={handleWatchTrailer}
                                hitSlop={8}>
                                <Ionicons name="play" size={20} color="white" />
                            </Pressable>
                            <Text className="mt-2 text-xs text-white">Watch Trailer</Text>
                        </View>
                        <View className="items-center">
                            <Pressable
                                className="rounded-full bg-white/10 p-3 active:bg-orange-300/30"
                                onPress={() => console.log('Add to Watchlist')}
                                hitSlop={8}>
                                <Ionicons name="bookmark-outline" size={20} color="white" />
                            </Pressable>
                            <Text className="mt-2 text-xs text-white">Add to Watchlist</Text>
                        </View>
                        <View className="items-center">
                            <Pressable
                                className="rounded-full bg-white/10 p-3 active:bg-orange-300/30"
                                onPress={() => console.log('Mark as Watched')}
                                hitSlop={8}>
                                <Ionicons name="checkmark" size={20} color="white" />
                            </Pressable>
                            <Text className="mt-2 text-xs text-white">Mark as Watched</Text>
                        </View>
                    </View>
                </Animated.View>
                <View className="bg-[#121212] p-3">
                    {/* Overview */}
                    <View className="mt-4">
                        <Text className="text-xl font-semibold text-white">Overview</Text>
                        <Text className="mt-2 text-lg text-gray-300">{data.overview}</Text>
                    </View>

                    {/* Genres */}
                    <View className="mt-6">
                        <Text className="text-xl font-semibold text-white">Genres</Text>

                        <ScrollView
                            className="mt-3 flex-row flex-wrap"
                            horizontal
                            showsHorizontalScrollIndicator={false}>
                            {data.genres.map((genre: any) => (
                                <TouchableOpacity
                                    key={genre.id}
                                    className="mb-2 mr-2 rounded-full bg-gray-700 px-4 py-2">
                                    <Text className="text-sm text-white">{genre.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
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
                    {/* Cast */}
                    <View className="mt-6">
                        <Text className="text-xl font-semibold text-white">Top Cast</Text>
                        <FlatList<CastVM>
                            data={data?.credits?.cast?.slice(0, 10)}
                            renderItem={renderCastItem}
                            keyExtractor={(item, index) => item.id.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                    {/* Similar */}
                    {data?.similar?.results.length > 0 && (
                        <View className="pb-4 ">
                            <HomeHorizontalList
                                ListHeading="More Like This"
                                listType={type}
                                listData={data?.similar?.results}
                                showMore={false}
                            />
                        </View>
                    )}
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
        backgroundColor: Colors.background,
        color: 'white',
        height: 100,
        borderWidth: StyleSheet.hairlineWidth,
    },
    imageOverlay: {
        height: 224 + 50,
        ...StyleSheet.absoluteFillObject,
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
