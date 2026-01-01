import { MovieVM } from '@/models/MovieVM';
import { MediaType, TVShowVM } from '@/models/TVShowVM';
import { getCategorySlug, SectionHeadings } from '@/utils/homeScreenHelper';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import MediaListItem from './MediaListItem';
import { Colors } from '@/constants/Colors';

type HorizontalMediaListProps = {
    ListHeading: string;
    listType: MediaType;
    listData: (MovieVM | undefined)[] | (TVShowVM | undefined)[] | undefined;
    showMore?: boolean;
};

export default function HomeHorizontalList({
    ListHeading,
    listType,
    listData,
    showMore = true,
}: HorizontalMediaListProps) {
    return (
        <View>
            <Pressable
                className="flex-row items-center pb-3 pt-6 active:opacity-70"
                onPress={() =>
                    router.push({
                        pathname: '/home/type-list',
                        params: {
                            type: listType,
                            slug: getCategorySlug(ListHeading as SectionHeadings),
                            title: ListHeading,
                        },
                    })
                }>
                <Text
                    className={`text-lg font-bold text-white ${
                        showMore && 'uppercase tracking-tight'
                    }`}>
                    {ListHeading}
                </Text>

                {showMore && <Ionicons name="chevron-forward" size={16} color={Colors.primary} />}
            </Pressable>

            <FlatList<MovieVM | TVShowVM>
                data={listData as any[]}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ gap: 8 }}
                renderItem={({ item }) => (
                    <MediaListItem data={item} type={listType} isGridView={false} />
                )}
            />
        </View>
    );
}
