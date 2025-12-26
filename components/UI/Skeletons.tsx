import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';

const SkeletonBox = ({
    className,
    style,
    opacity,
}: {
    className?: string;
    style?: any;
    opacity: SharedValue<number>;
}) => {
    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View className={`bg-neutral-800 ${className}`} style={[animatedStyle, style]} />
    );
};

const useSkeletonAnimation = () => {
    const opacity = useSharedValue(0.5);

    useEffect(() => {
        opacity.value = withRepeat(
            withSequence(withTiming(1, { duration: 1000 }), withTiming(0.5, { duration: 1000 })),
            -1,
            true,
        );
    }, []);

    return opacity;
};

export const TrendingSkeleton = () => {
    const opacity = useSkeletonAnimation();

    return (
        <View className="mb-4 flex-row gap-3">
            {[1, 2].map((i) => (
                <SkeletonBox
                    key={i}
                    opacity={opacity}
                    className="aspect-[5/3] w-[300px] rounded-2xl"
                />
            ))}
        </View>
    );
};

export const HorizontalListSkeleton = () => {
    const opacity = useSkeletonAnimation();

    return (
        <View className="mb-6">
            <SkeletonBox opacity={opacity} className="mb-3 ml-1 h-5 w-40 rounded" />
            <View className="flex-row gap-3">
                {[1, 2, 3, 4].map((i) => (
                    <SkeletonBox key={i} opacity={opacity} className="h-48 w-32 rounded-xl" />
                ))}
            </View>
        </View>
    );
};

export const EpisodeItemSkeleton = ({ opacity }: { opacity: SharedValue<number> }) => {
    return (
        <View className="flex-row items-center border-b border-neutral-800/50 p-4">
            <SkeletonBox opacity={opacity} className="mr-4 h-[77px] w-[102px] rounded-lg" />
            <View className="flex-1 justify-center gap-3">
                <SkeletonBox opacity={opacity} className="h-4 w-3/4 rounded-sm" />
                <SkeletonBox opacity={opacity} className="h-3 w-1/3 rounded-sm" />
            </View>
            <SkeletonBox opacity={opacity} className="ml-2 h-7 w-7 rounded-full" />
        </View>
    );
};

export const EpisodeListSkeleton = ({ count = 6 }: { count?: number }) => {
    const opacity = useSkeletonAnimation();

    return (
        <View>
            {Array.from({ length: count }).map((_, i) => (
                <EpisodeItemSkeleton key={i} opacity={opacity} />
            ))}
        </View>
    );
};

export const SearchResultItemSkeleton = ({ opacity }: { opacity: SharedValue<number> }) => {
    return (
        <View className="mx-2.5 mb-3 flex-row rounded-xl bg-neutral-900/50 p-2">
            <SkeletonBox opacity={opacity} className="h-[105px] w-[70px] rounded-lg" />

            <View className="flex-1 justify-start gap-3 px-4 pt-4">
                <SkeletonBox opacity={opacity} className="h-4 w-2/3 rounded-sm" />
                <SkeletonBox opacity={opacity} className="h-6 w-full rounded-sm" />
                <SkeletonBox opacity={opacity} className="h-3 w-1/2 rounded-sm" />
            </View>
        </View>
    );
};

export const SearchResultListSkeleton = ({ count = 6 }: { count?: number }) => {
    const opacity = useSkeletonAnimation();

    return (
        <View className="pt-4">
            {Array.from({ length: count }).map((_, i) => (
                <SearchResultItemSkeleton key={i} opacity={opacity} />
            ))}
        </View>
    );
};

export const DetailScreenSkeleton = () => {
    const opacity = useSkeletonAnimation();

    return (
        <View className="flex-1 bg-[#121212]">
            <SkeletonBox opacity={opacity} className="h-[100px] w-full" />

            <View className="-mt-16 px-4">
                <View className="flex-row items-end">
                    <SkeletonBox opacity={opacity} className="h-[152px] w-[100px] rounded-[10px]" />

                    <View className="ml-4 flex-1 gap-2 pb-1">
                        <SkeletonBox opacity={opacity} className="h-6 w-5/6 rounded-md" />
                        <SkeletonBox opacity={opacity} className="h-4 w-1/3 rounded-sm" />
                    </View>
                </View>

                <SkeletonBox opacity={opacity} className="mt-6 h-12 w-full rounded-xl" />

                <View className="mt-6 gap-2">
                    <SkeletonBox opacity={opacity} className="mb-1 h-5 w-24 rounded-sm" />
                    <SkeletonBox opacity={opacity} className="h-3 w-full rounded-sm" />
                    <SkeletonBox opacity={opacity} className="h-3 w-full rounded-sm" />
                    <SkeletonBox opacity={opacity} className="h-3 w-3/4 rounded-sm" />
                </View>
            </View>
        </View>
    );
};
