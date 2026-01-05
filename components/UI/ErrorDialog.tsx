import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, Text, TouchableWithoutFeedback, View } from 'react-native';

export type DialogType = 'error' | 'warning';

interface ErrorDialogProps {
    visible: boolean;
    type?: DialogType;
    title?: string;
    message?: string;
    leftButtonText?: string;
    rightButtonText?: string;
    onLeftButtonPress: () => void;
    onRightButtonPress?: () => void;
}

export const ErrorDialog = ({
    visible,
    type = 'error',
    title,
    message,
    leftButtonText,
    rightButtonText,
    onRightButtonPress,
    onLeftButtonPress,
}: ErrorDialogProps) => {
    const isWarning = type === 'warning';

    const theme = {
        icon: isWarning ? 'alert' : 'warning',
        iconBgOuter: isWarning ? 'bg-amber-500/10' : 'bg-red-500/10',
        iconBgInner: isWarning ? 'bg-amber-500/20' : 'bg-red-500/20',
        iconColor: isWarning ? '#f59e0b' : Colors.errorRed || '#ef4444',
        buttonBg: isWarning ? 'bg-amber-600 active:bg-amber-700' : 'bg-red-600 active:bg-red-700',
    } as const;

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
                            {/* Dynamic Icon Container */}
                            <View
                                className={`mb-4 h-20 w-20 items-center justify-center rounded-full ${theme.iconBgOuter}`}>
                                <View
                                    className={`h-14 w-14 items-center justify-center rounded-full ${theme.iconBgInner}`}>
                                    <Ionicons
                                        name={theme.icon as any}
                                        size={32}
                                        color={theme.iconColor}
                                    />
                                </View>
                            </View>

                            {/* Typography */}
                            <Text className="mb-2 text-center text-xl font-bold tracking-wide text-white">
                                {title || (isWarning ? 'Warning' : 'Oops!')}
                            </Text>

                            <Text className="mb-4 text-center text-base font-medium text-neutral-400">
                                {message || 'Something went wrong. Please try again.'}
                            </Text>

                            <View className="w-full flex-row gap-3">
                                {/* Secondary Button (Dismiss/Cancel) - Always neutral */}
                                <Pressable
                                    onPress={onLeftButtonPress}
                                    className="flex-1 items-center justify-center rounded-xl border border-white/5 bg-white/5 py-3 active:bg-white/10">
                                    <Text className="text-base font-semibold text-neutral-300">
                                        {leftButtonText ||
                                            (onRightButtonPress ? 'Cancel' : 'Dismiss')}
                                    </Text>
                                </Pressable>

                                {/* Primary Button (Retry/Confirm) - Dynamic Color */}
                                {onRightButtonPress && (
                                    <Pressable
                                        onPress={onRightButtonPress}
                                        className={`flex-1 items-center justify-center rounded-xl py-3 ${theme.buttonBg}`}>
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
