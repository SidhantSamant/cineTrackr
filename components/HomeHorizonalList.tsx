import { Colors } from '@/constants/Colors';
import { MovieVM } from '@/models/MovieVM';
import { MediaType, TVShowVM } from '@/models/TVShowVM';
import { getCategorySlug, SectionHeadings } from '@/utils/dashBoardHelper';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import MovieListItem from './MovieListItem';

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
                        ? router.push({
                              pathname: `/index/[type]`,
                              params: {
                                  type: listType,
                                  slug: getCategorySlug(ListHeading as SectionHeadings),
                                  title: ListHeading,
                              },
                          })
                        : null
                }>
                <Text
                    style={{
                        color: Colors.headingText,
                        fontWeight: '600',
                        fontSize: 18,
                    }}>
                    {ListHeading}
                </Text>
                {showMore && <Entypo name="chevron-right" size={24} color="white" />}
            </Pressable>

            <FlatList<MovieVM | TVShowVM>
                data={listData as any[]}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                    // paddingHorizontal: 8,
                    gap: 8,
                }}
                renderItem={({ item }) => (
                    <MovieListItem data={item} type={listType} isGridView={false} />
                )}
            />
        </View>
    );
}
