import { Colors } from '@/constants/Colors';
import { Movie } from '@/models/Movie';
import { MediaType, TVShow } from '@/models/Show';
import { getCategorySlug, SectionHeadings } from '@/utils/dashBoardHelper';
import Entypo from '@expo/vector-icons/Entypo';
import { router } from 'expo-router';
import { FlatList, Pressable, Text, View } from 'react-native';
import MovieListItem from './MovieListItem';

type HomeListProps = {
    ListHeading: string;
    listType: MediaType;
    listData: (Movie | undefined)[] | (TVShow | undefined)[] | undefined;
};

export default function HomeHorizontalList({ ListHeading, listType, listData }: HomeListProps) {
    return (
        <View>
            <Pressable
                className={'flex-row items-center px-4 pb-2 pt-6'}
                onPress={() =>
                    router.push({
                        pathname: `/${listType}`,
                        params: {
                            slug: getCategorySlug(ListHeading as SectionHeadings),
                            title: ListHeading,
                        },
                    })
                }>
                <Text
                    style={{
                        color: Colors.headingText,
                        fontWeight: '600',
                        fontSize: 18,
                    }}>
                    {ListHeading}
                </Text>
                <Entypo name="chevron-right" size={24} color="white" />
            </Pressable>

            <FlatList<Movie | TVShow>
                data={listData as any[]}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{
                    paddingHorizontal: 8,
                    gap: 8,
                }}
                renderItem={({ item }) => (
                    <MovieListItem data={item} type={listType} isGridView={false} />
                )}
            />
        </View>
    );
}
