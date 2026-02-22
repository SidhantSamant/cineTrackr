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

const PARALLAX_FACTOR = 0.5;
const FADE_DISTANCE = 50;

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
                        [-imgHeight * PARALLAX_FACTOR, 0, imgHeight * PARALLAX_FACTOR],
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
        const fadeEnd = imgHeight - headerHeight;
        const fadeStart = fadeEnd - FADE_DISTANCE;

        return {
            opacity: interpolate(
                scrollOffset.value,
                [fadeStart, fadeEnd],
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
