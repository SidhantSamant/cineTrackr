import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleProp, ViewStyle } from 'react-native';

const setKeyboardBehavior =
    Platform.OS === 'ios' || (Platform.OS === 'android' && Platform.Version > 34);

type KeyboardAwareScrollViewProps = {
    children: React.ReactNode;
    customContentContainerStyle?: StyleProp<ViewStyle>;
    verticalOffset?: number;
};

export default function KeyboardAwareScrollView({
    children,
    verticalOffset,
    customContentContainerStyle,
}: KeyboardAwareScrollViewProps) {
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            // keyboardVerticalOffset={verticalOffset}
            behavior={setKeyboardBehavior ? 'padding' : undefined}>
            <ScrollView
                contentContainerStyle={[
                    { flexGrow: 1, paddingBottom: 32 },
                    customContentContainerStyle,
                ]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export type CustomKeyboardAwareScrollViewRef = {
    scrollToBottom: () => void;
};

export const CustomKeyboardAwareScrollView = forwardRef<
    CustomKeyboardAwareScrollViewRef,
    KeyboardAwareScrollViewProps
>(({ children, verticalOffset, customContentContainerStyle }, ref) => {
    const scrollViewRef = useRef<ScrollView>(null);

    const scrollToBottom = useCallback(() => {
        if (scrollViewRef.current) {
            setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 500);
        }
    }, []);

    useImperativeHandle(ref, () => ({ scrollToBottom }), [scrollToBottom]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={setKeyboardBehavior ? 'padding' : 'height'}
            keyboardVerticalOffset={verticalOffset && setKeyboardBehavior ? verticalOffset : 0}>
            <ScrollView
                contentContainerStyle={[{ flexGrow: 1 }, customContentContainerStyle]}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                ref={scrollViewRef}>
                {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
});
