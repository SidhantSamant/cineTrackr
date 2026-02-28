import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { memo, useCallback } from 'react';
import { Pressable, PressableProps, Text, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

export type ListMediaType = 'all' | 'movies' | 'shows' | 'anime';

interface SectionHeaderProps {
    title: string;
    activeTab: ListMediaType;
    tabs: ListMediaType[];
    onTabChange: (tab: ListMediaType) => void;
    onSeeAll: () => void;
}

const SPRING_CONFIG = { damping: 10, stiffness: 150 };

export const BouncyPressable = memo(
    ({
        children,
        onPress,
        style,
        className,
        ...props
    }: PressableProps & { children: React.ReactNode; className?: string }) => {
        const scale = useSharedValue(1);
        const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

        const handlePressIn = useCallback(() => {
            scale.value = withSpring(0.96, SPRING_CONFIG);
        }, []);
        const handlePressOut = useCallback(() => {
            scale.value = withSpring(1, SPRING_CONFIG);
        }, []);

        return (
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                className={className}
                style={style}
                {...props}>
                <Animated.View style={[animatedStyle, { flex: 1 }]}>{children}</Animated.View>
            </Pressable>
        );
    },
);

const TabPill = memo(
    ({
        tab,
        isActive,
        onPress,
    }: {
        tab: ListMediaType;
        isActive: boolean;
        onPress: (t: ListMediaType) => void;
    }) => {
        const handlePress = useCallback(() => {
            Haptics.selectionAsync();
            onPress(tab);
        }, [tab, onPress]);

        return (
            <Pressable
                onPress={handlePress}
                className={`rounded-full border px-3 py-1 active:opacity-60 ${
                    isActive ? 'border-primary bg-primary/10' : 'border-neutral-800 bg-transparent'
                }`}>
                <Text
                    className={`text-[10px] font-bold uppercase ${isActive ? 'text-primary' : 'text-neutral-500'}`}>
                    {tab}
                </Text>
            </Pressable>
        );
    },
);

const SectionHeader = memo(
    ({ title, activeTab, tabs, onTabChange, onSeeAll }: SectionHeaderProps) => {
        const arrowTranslate = useSharedValue(0);

        const arrowStyle = useAnimatedStyle(() => ({
            transform: [{ translateX: arrowTranslate.value }],
        }));

        const handleHeaderPress = useCallback(() => {
            arrowTranslate.value = withSequence(
                withTiming(4, { duration: 150 }),
                withTiming(0, { duration: 150 }),
            );
            onSeeAll();
        }, [onSeeAll]);

        return (
            <View className="flex-row items-center justify-between pb-3 pt-6">
                <Pressable
                    className="flex-row items-center active:opacity-70"
                    onPress={handleHeaderPress}>
                    <Text className="mr-1 text-lg font-semibold tracking-tight text-white">
                        {title}
                    </Text>
                    <Animated.View style={arrowStyle}>
                        <Ionicons name="chevron-forward-sharp" size={16} color={Colors.primary} />
                    </Animated.View>
                </Pressable>

                <View className="flex-row items-center gap-x-1.5">
                    {tabs.map((tab) => (
                        <TabPill
                            key={tab}
                            tab={tab}
                            isActive={activeTab === tab}
                            onPress={onTabChange}
                        />
                    ))}
                </View>
            </View>
        );
    },
);

export default SectionHeader;
