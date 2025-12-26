import { TrendingItemVM } from '@/models/TrendingItemVM';
import {
    BLURHASH_TRANSITION,
    getBlurHash,
    getPlaceholderImage,
    getTMDBImageSource,
} from '@/utils/imgHelper';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { FlatList, Pressable, View, Text } from 'react-native';

type TrendingListProps = {
    listData: (TrendingItemVM | undefined)[] | undefined;
};

type TrendingListItemProps = {
    data: TrendingItemVM;
};

const TrendingListItem = ({ data }: TrendingListItemProps) => {
    const type = data?.media_type;
    const title = data?.media_type === 'movie' ? data?.title : data?.name;
    const date = data?.media_type === 'movie' ? data?.release_date : data?.first_air_date;
    const year = date?.split('-')[0];

    return (
        <Link href={`/${type}/${data?.id}`} asChild>
            <Pressable style={{ width: 300 }}>
                <View style={{ borderRadius: 16, overflow: 'hidden' }}>
                    <Image
                        source={getTMDBImageSource(data.backdrop_path, 'w780')}
                        style={{ width: '100%', aspectRatio: 5 / 3 }}
                        contentFit="cover"
                        placeholderContentFit="cover"
                        placeholder={getBlurHash(data.backdrop_path)}
                        transition={BLURHASH_TRANSITION}
                    />
                    {/* Bottom shadow */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        start={{ x: 0.5, y: 0 }}
                        end={{ x: 0.5, y: 1 }}
                        style={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            height: 100,
                        }}>
                        <View
                            style={{
                                position: 'absolute',
                                right: 0,
                                left: 10,
                                bottom: 10,
                            }}>
                            <Text
                                numberOfLines={1}
                                className="mr-1 text-lg font-semibold text-white">
                                {title}
                            </Text>
                            <View className="flex-row items-center">
                                <Ionicons name="star" size={12} color="white" />
                                <Text className="ms-1 text-base font-light text-white">
                                    {data?.vote_average?.toFixed(1)}
                                </Text>
                                {/* <Text className="mx-3 text-3xl font-normal text-white">•</Text>
                                <Text className="text-base font-normal text-white">{year}</Text> */}
                                <Text className="ms-4 text-base font-light text-white">{year}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>
            </Pressable>
        </Link>
    );
};

export default function TrendingList({ listData }: TrendingListProps) {
    return (
        <View className="pt-2">
            <FlatList<TrendingItemVM>
                data={listData as any[]}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                    // paddingHorizontal: 8,
                    gap: 8,
                }}
                renderItem={({ item }) => <TrendingListItem data={item} />}
            />
        </View>
    );
}
