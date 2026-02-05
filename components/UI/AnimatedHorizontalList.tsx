import { MovieVM } from '@/models/MovieVM';
import { TVShowVM } from '@/models/TVShowVM';
import { useCallback } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { Easing, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import MediaListItem from '../MediaListItem';

type AnimatedHorizontalListProps = {
    data: (MovieVM | TVShowVM)[] | undefined;
    isPlaceholderData?: boolean;
    style?: StyleProp<ViewStyle>;
};

export default function AnimatedHorizontalList({
    data,
    isPlaceholderData,
    style,
}: AnimatedHorizontalListProps) {
    const renderItem = useCallback(
        ({ item }: { item: MovieVM | TVShowVM }) => (
            <MediaListItem
                data={item}
                isGridView={false}
                type={(item.media_type ?? 'title' in item) ? 'movie' : 'tv'}
            />
        ),
        [],
    );

    const animatedOpacityStyle = useAnimatedStyle(() => {
        return {
            opacity: withTiming(isPlaceholderData ? 0.4 : 1, {
                duration: 500,
                easing: Easing.out(Easing.cubic),
            }),
        };
    }, [isPlaceholderData]);

    return (
        <Animated.FlatList<MovieVM | TVShowVM>
            style={[style, animatedOpacityStyle]}
            data={data}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ gap: 8 }}
            renderItem={renderItem}
            initialNumToRender={6}
            maxToRenderPerBatch={4}
            windowSize={3}
        />
    );
}
