import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const ActionButton = React.memo(
    ({
        icon,
        label,
        onPress,
    }: {
        icon: keyof typeof Ionicons.glyphMap;
        label: string;
        onPress: () => void;
    }) => (
        <View className="min-w-[60px] items-center">
            <Pressable
                className="rounded-full bg-white/10 p-3 active:scale-90 active:opacity-70"
                onPress={onPress}
                hitSlop={8}>
                <Ionicons name={icon} size={22} color="white" />
            </Pressable>
            <Text className="mt-2 text-xs font-medium text-neutral-300">{label}</Text>
        </View>
    ),
);

export default ActionButton;
