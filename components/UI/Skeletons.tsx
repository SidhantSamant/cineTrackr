import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    cancelAnimation,
    Easing,
    interpolate,
    SharedValue,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

const AnimatedGradient = Animated.createAnimatedComponent(LinearGradient);

const useShimmerAnimation = () => {
    const shimmer = useSharedValue(0);

    useEffect(() => {
        shimmer.value = withRepeat(
            withTiming(1, { duration: 1500, easing: Easing.linear }),
            -1,
            false,
        );
        return () => cancelAnimation(shimmer);
    }, []);

    return shimmer;
};

const SkeletonBox = ({
    className,
    style,
    shimmer,
}: {
    className?: string;
    style?: any;
    shimmer: SharedValue<number>;
}) => {
    const rStyle = useAnimatedStyle(() => {
        const translateX = interpolate(shimmer.value, [0, 1], [-120, 120]);
        return {
            transform: [{ translateX: `${translateX}%` }],
        };
    });

    return (
        <View className={`overflow-hidden bg-neutral-800 ${className}`} style={style}>
            <AnimatedGradient
                colors={[
                    'transparent',
                    'rgba(255,255,255, 0.03)',
                    'rgba(255,255,255, 0.10)',
                    'rgba(255,255,255, 0.03)',
                    'transparent',
                ]}
                locations={[0, 0.25, 0.5, 0.75, 1]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }, rStyle]}
            />

            {/* <AnimatedGradient
                colors={['transparent', 'rgba(255,255,255,0.12)', 'transparent']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={[StyleSheet.absoluteFill, { width: '100%', height: '100%' }, rStyle]}
            /> */}
        </View>
    );
};

export const TrendingSkeleton = () => {
    const shimmer = useShimmerAnimation();

    return (
        <View className="mb-2 flex-row gap-2">
            {[1, 2].map((i) => (
                <SkeletonBox
                    key={i}
                    shimmer={shimmer}
                    className="aspect-[5/3] w-[300px] rounded-2xl"
                />
            ))}
        </View>
    );
};

export const HorizontalListSkeleton = ({ hasTitle = true }: { hasTitle?: boolean }) => {
    const shimmer = useShimmerAnimation();

    return (
        <View className="mb-2 mt-6">
            {hasTitle && <SkeletonBox shimmer={shimmer} className="mb-3 ml-1 h-6 w-40 rounded" />}
            <View className="flex-row gap-x-2">
                {[1, 2, 3, 4].map((i) => (
                    <SkeletonBox
                        key={i}
                        shimmer={shimmer}
                        className="aspect-[3/5] w-[100px] rounded-2xl"
                    />
                ))}
            </View>
        </View>
    );
};

export const MediaListSkeleton = ({ hasTitle = true }: { hasTitle?: boolean }) => {
    const shimmer = useShimmerAnimation();

    return (
        <View>
            {/* Header Skeleton */}
            {hasTitle && (
                <View className="flex-row items-center justify-between pb-3 pt-6">
                    <SkeletonBox shimmer={shimmer} className="h-6 w-32 rounded" />
                    <View className="flex-row gap-x-1.5">
                        {[1, 2, 3].map((i) => (
                            <SkeletonBox
                                key={i}
                                shimmer={shimmer}
                                className="h-7 w-16 rounded-full"
                            />
                        ))}
                    </View>
                </View>
            )}

            {/* List Skeleton */}
            <View className="flex-row gap-x-2">
                {[1, 2, 3, 4].map((i) => (
                    <SkeletonBox
                        key={i}
                        shimmer={shimmer}
                        className="aspect-[3/5] w-[100px] rounded-2xl"
                    />
                ))}
            </View>
        </View>
    );
};

export const EpisodeItemSkeleton = ({ shimmer }: { shimmer: SharedValue<number> }) => {
    return (
        <View className="flex-row items-center border-b border-neutral-800/50 p-4">
            <SkeletonBox shimmer={shimmer} className="mr-4 h-[77px] w-[102px] rounded-lg" />
            <View className="flex-1 justify-center gap-3">
                <SkeletonBox shimmer={shimmer} className="h-4 w-3/4 rounded-sm" />
                <SkeletonBox shimmer={shimmer} className="h-3 w-1/3 rounded-sm" />
            </View>
            <SkeletonBox shimmer={shimmer} className="ml-2 h-7 w-7 rounded-full" />
        </View>
    );
};

export const EpisodeListSkeleton = ({ count = 6 }: { count?: number }) => {
    const shimmer = useShimmerAnimation();

    return (
        <View>
            {Array.from({ length: count }).map((_, i) => (
                <EpisodeItemSkeleton key={i} shimmer={shimmer} />
            ))}
        </View>
    );
};

export const SearchResultItemSkeleton = ({ shimmer }: { shimmer: SharedValue<number> }) => {
    return (
        <View className="mx-2.5 mb-3 flex-row rounded-xl bg-neutral-900/50 p-2">
            <SkeletonBox shimmer={shimmer} className="h-[105px] w-[70px] rounded-lg" />

            <View className="flex-1 justify-start gap-3 px-4 pt-4">
                <SkeletonBox shimmer={shimmer} className="h-4 w-2/3 rounded-sm" />
                <SkeletonBox shimmer={shimmer} className="h-6 w-full rounded-sm" />
                <SkeletonBox shimmer={shimmer} className="h-3 w-1/2 rounded-sm" />
            </View>
        </View>
    );
};

export const SearchResultListSkeleton = ({ count = 6 }: { count?: number }) => {
    const shimmer = useShimmerAnimation();

    return (
        <View className="pt-4">
            {Array.from({ length: count }).map((_, i) => (
                <SearchResultItemSkeleton key={i} shimmer={shimmer} />
            ))}
        </View>
    );
};

export const DetailScreenSkeleton = () => {
    const shimmer = useShimmerAnimation();

    return (
        <View className="flex-1 bg-[#121212]">
            {/* Backdrop */}
            <SkeletonBox shimmer={shimmer} className="h-[200px] w-full" />
            <View className="-mt-16 px-4">
                <View className="flex-row items-end">
                    {/* Poster */}
                    <SkeletonBox shimmer={shimmer} className="h-[152px] w-[100px] rounded-[10px]" />

                    {/* Title & Metadata */}
                    <View className="ml-4 flex-1 gap-2 pb-1">
                        <SkeletonBox shimmer={shimmer} className="h-7 w-5/6 rounded-sm" />
                        <SkeletonBox shimmer={shimmer} className="h-7 w-2/3 rounded-sm" />
                        <View className="mt-2 flex-row gap-2">
                            <SkeletonBox shimmer={shimmer} className="h-4 w-12 rounded-sm" />
                            <SkeletonBox shimmer={shimmer} className="h-4 w-20 rounded-sm" />
                        </View>
                    </View>
                </View>

                {/* Action Buttons Row */}
                <View className="mt-6 flex-row justify-between rounded-xl bg-neutral-900/50 p-3">
                    <SkeletonBox shimmer={shimmer} className="h-[60px] w-[60px] rounded-full" />
                    <SkeletonBox shimmer={shimmer} className="h-[60px] w-[60px] rounded-full" />
                    <SkeletonBox shimmer={shimmer} className="h-[60px] w-[60px] rounded-full" />
                    <SkeletonBox shimmer={shimmer} className="h-[60px] w-[60px] rounded-full" />
                </View>

                {/* Overview Block) */}
                <View className="mt-8 gap-3">
                    <SkeletonBox shimmer={shimmer} className="mb-2 h-6 w-32 rounded-sm" />
                    <SkeletonBox shimmer={shimmer} className="h-4 w-full rounded-sm" />
                    <SkeletonBox shimmer={shimmer} className="h-4 w-full rounded-sm" />
                    <SkeletonBox shimmer={shimmer} className="h-4 w-full rounded-sm" />
                    <SkeletonBox shimmer={shimmer} className="h-4 w-full rounded-sm" />
                    <SkeletonBox shimmer={shimmer} className="h-4 w-3/4 rounded-sm" />
                </View>

                {/* Genres */}
                <View className="mt-6 flex-row gap-2.5">
                    <SkeletonBox shimmer={shimmer} className="h-8 w-20 rounded-full" />
                    <SkeletonBox shimmer={shimmer} className="h-8 w-28 rounded-full" />
                    <SkeletonBox shimmer={shimmer} className="h-8 w-16 rounded-full" />
                </View>

                {/* Production Companies */}
                <View className="mt-8">
                    <SkeletonBox shimmer={shimmer} className="mb-4 h-6 w-28 rounded-sm" />

                    <View className="flex-row gap-3">
                        <SkeletonBox shimmer={shimmer} className="h-4 w-36 rounded-sm" />
                        <SkeletonBox shimmer={shimmer} className="h-4 w-36 rounded-sm" />
                    </View>
                </View>

                {/* Horizontal Cast List */}
                <View className="mt-8">
                    <SkeletonBox shimmer={shimmer} className="mb-4 h-6 w-24 rounded-sm" />
                    <View className="flex-row gap-3">
                        <SkeletonBox shimmer={shimmer} className="h-24 w-24 rounded-full" />
                        <SkeletonBox shimmer={shimmer} className="h-24 w-24 rounded-full" />
                        <SkeletonBox shimmer={shimmer} className="h-24 w-24 rounded-full" />
                        <SkeletonBox shimmer={shimmer} className="h-24 w-24 rounded-full" />
                    </View>
                </View>
            </View>
        </View>
    );
};
