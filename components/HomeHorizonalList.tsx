import { MovieVM } from '@/models/MovieVM';
import { MediaType, TVShowVM } from '@/models/TVShowVM';
import { getCategorySlug, SectionHeadings } from '@/utils/homeScreenHelper';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import MediaListItem from './MediaListItem';

type HomeListProps = {
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
}: HomeListProps) {
    return (
        <View>
            <Pressable
                className={'flex-row items-center pb-2 pt-6'}
                onPress={() =>
                    showMore
                        ? router.navigate({
                              pathname: '/home/type-list',
                              params: {
                                  type: listType,
                                  slug: getCategorySlug(ListHeading as SectionHeadings),
                                  title: ListHeading,
                              },
                          })
                        : null
                }>
                <Text className="text-lg font-bold text-white">{ListHeading}</Text>

                {showMore && <Entypo name="chevron-right" size={24} color="white" />}
            </Pressable>

            <FlatList<MovieVM | TVShowVM>
                data={listData as any[]}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                    gap: 8,
                }}
                renderItem={({ item }) => (
                    <MediaListItem data={item} type={listType} isGridView={false} />
                )}
            />
        </View>
    );
}
