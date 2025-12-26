import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, Text, TouchableWithoutFeedback, View, Platform } from 'react-native';

interface ErrorDialogProps {
    visible: boolean;
    title?: string;
    message?: string;
    leftButtonText?: string;
    rightButtonText?: string;
    onLeftButtonPress: () => void;
    onRightButtonPress?: () => void;
}

export const ErrorDialog = ({
    visible,
    title,
    message,
    leftButtonText,
    rightButtonText,
    onRightButtonPress,
    onLeftButtonPress,
}: ErrorDialogProps) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            statusBarTranslucent
            onRequestClose={onLeftButtonPress}>
            <TouchableWithoutFeedback onPress={onLeftButtonPress}>
                <View className="flex-1 items-center justify-center bg-black/60 px-4">
                    <TouchableWithoutFeedback>
                        <View className="w-full max-w-[340px] items-center overflow-hidden rounded-3xl border border-white/10 bg-[#1c1c1c] p-4">
                            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-red-500/10">
                                <View className="h-14 w-14 items-center justify-center rounded-full bg-red-500/20">
                                    <Ionicons
                                        name="warning"
                                        size={32}
                                        color={Colors.errorRed || '#ef4444'}
                                    />
                                </View>
                            </View>

                            {/* Typography */}
                            <Text className="mb-2 text-center text-xl font-bold tracking-wide text-white">
                                {title || 'Oops!'}
                            </Text>

                            <Text className="mb-4 text-center text-base font-medium  text-neutral-400">
                                {message || 'Something went wrong. Please try again.'}
                            </Text>

                            <View className="w-full flex-row gap-3">
                                {/* Secondary Button (Dismiss/Cancel) */}
                                <Pressable
                                    onPress={onLeftButtonPress}
                                    className="flex-1 items-center justify-center rounded-xl border border-white/5 bg-white/5 py-2 active:bg-white/10">
                                    <Text className="text-base font-semibold text-neutral-300">
                                        {leftButtonText ||
                                            (onRightButtonPress ? 'Cancel' : 'Dismiss')}
                                    </Text>
                                </Pressable>

                                {/* Primary Button (Retry) */}
                                {onRightButtonPress && (
                                    <Pressable
                                        onPress={onRightButtonPress}
                                        className="flex-1 items-center justify-center rounded-xl bg-red-600 py-2 active:bg-red-700">
                                        <Text className="text-base font-semibold text-white">
                                            {rightButtonText || 'Retry'}
                                        </Text>
                                    </Pressable>
                                )}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
