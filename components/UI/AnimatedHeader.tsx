import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AnimatedHeaderProps {
    title: string;
    headerHeight: number;
    animatedStyle: any;
}

const AnimatedHeader = ({ title, headerHeight, animatedStyle }: AnimatedHeaderProps) => {
    const insets = useSafeAreaInsets();

    return (
        <View
            style={[styles.customHeaderContainer, { height: headerHeight }]}
            pointerEvents="box-none">
            {/* The fading background */}
            <Animated.View
                pointerEvents="none"
                style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: Colors.background },
                    animatedStyle,
                ]}
            />

            {/* header content */}
            <View
                pointerEvents="box-none"
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: insets.top,
                    paddingHorizontal: 16,
                }}>
                <Pressable
                    className="rounded-full bg-black/40 p-2 active:bg-black/60"
                    onPress={router.back}
                    hitSlop={20}>
                    <Ionicons name="chevron-back" size={24} color="white" />
                </Pressable>

                <Animated.Text
                    numberOfLines={1}
                    style={[styles.headerTitle, animatedStyle, { flex: 1, textAlign: 'center' }]}>
                    {title}
                </Animated.Text>

                {/* Spacer to center title */}
                <View style={{ width: 40 }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    customHeaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    headerTitle: {
        color: 'white',
        fontWeight: '600',
        fontSize: 18,
        marginHorizontal: 16,
    },
});

export default AnimatedHeader;
