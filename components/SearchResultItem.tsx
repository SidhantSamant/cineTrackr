import React from 'react';
import { Pressable, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getTMDBImageSource, getBlurHash, BLURHASH_TRANSITION } from '@/utils/imgHelper';
import { getRatingColor } from '@/utils/uiHelper';
import { MovieVM } from '@/models/MovieVM';
import { TVShowVM } from '@/models/TVShowVM';

const SearchResultItem = React.memo(({ item }: { item: MovieVM | TVShowVM }) => {
    const isMovie = item.media_type === 'movie';
    const title = isMovie ? item.title : item.name;
    const date = isMovie ? item.release_date : item.first_air_date;
    const year = date ? date.substring(0, 4) : null;

    const ratingColor = getRatingColor(item.vote_average || 0);

    const handlePress = () => {
        router.push(`/${item.media_type || 'movie'}/${item.id}`);
    };

    return (
        <Pressable
            onPress={handlePress}
            className="mx-2.5 mb-3 flex-row overflow-hidden rounded-xl bg-neutral-900/50 p-2 active:bg-neutral-800">
            <Image
                source={getTMDBImageSource(item.poster_path)}
                placeholder={getBlurHash(item.poster_path)}
                transition={BLURHASH_TRANSITION}
                contentFit="cover"
                style={{
                    width: 70,
                    height: 105,
                    borderRadius: 8,
                    backgroundColor: '#262626',
                }}
            />

            <View className="flex-1 justify-center px-4">
                <Text className="text-base font-bold text-white" numberOfLines={1}>
                    {title || 'Unknown Title'}
                </Text>

                <Text className="mt-1 text-xs text-neutral-400" numberOfLines={2}>
                    {item.overview || 'No description available.'}
                </Text>

                <View className="mt-3 flex-row items-center gap-3">
                    <View
                        className={`rounded px-1.5 py-0.5 ${
                            isMovie ? 'bg-indigo-500/20' : 'bg-pink-500/20'
                        }`}>
                        <Text
                            className={`text-[10px] font-bold uppercase ${
                                isMovie ? 'text-indigo-400' : 'text-pink-400'
                            }`}>
                            {isMovie ? 'Movie' : 'TV Series'}
                        </Text>
                    </View>

                    {year && <Text className="text-xs font-medium text-neutral-500">{year}</Text>}

                    {(item.vote_average || 0) > 0 && (
                        <View
                            className="flex-row items-center rounded px-1.5 py-0.5"
                            style={{ backgroundColor: `${ratingColor}20` }}>
                            <Ionicons name="star" size={10} color={ratingColor} />
                            <Text className="ml-1 text-xs font-bold" style={{ color: ratingColor }}>
                                {item.vote_average?.toFixed(1)}
                            </Text>
                        </View>
                    )}
                </View>
            </View>

            <View className="justify-center">
                <Ionicons name="chevron-forward" size={20} color="#525252" />
            </View>
        </Pressable>
    );
});

export default SearchResultItem;
