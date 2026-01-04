import {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';

type ParallaxConfig = {
    imgHeight: number;
    headerHeight: number;
};

export const useParallaxScroll = ({ imgHeight, headerHeight }: ParallaxConfig) => {
    const scrollOffset = useSharedValue(0);

    const onScroll = useAnimatedScrollHandler((event) => {
        scrollOffset.value = event.contentOffset.y;
    });

    const imageAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-imgHeight, 0, imgHeight],
                        [-imgHeight * 0.5, 0, imgHeight * 0.5],
                        Extrapolation.CLAMP,
                    ),
                },
                {
                    scale: interpolate(
                        scrollOffset.value,
                        [-imgHeight, 0],
                        [2, 1],
                        Extrapolation.CLAMP,
                    ),
                },
            ],
        };
    });

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(
                scrollOffset.value,
                [imgHeight - headerHeight - 40, imgHeight - headerHeight],
                [0, 1],
                Extrapolation.CLAMP,
            ),
        };
    });

    return {
        onScroll,
        imageAnimatedStyle,
        headerAnimatedStyle,
        scrollOffset,
    };
};
