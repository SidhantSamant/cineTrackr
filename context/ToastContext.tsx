import { Ionicons } from '@expo/vector-icons';
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { Text, View, Pressable, Keyboard, Platform, LayoutAnimation } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ToastType = 'success' | 'error' | 'warning';

interface ToastContextData {
    show: (message: string, type: ToastType, duration?: number) => void;
    hide: () => void;
}

const VARIANTS = {
    success: { color: '#4ADE80', icon: 'checkmark-circle' as const, bg: 'rgba(74, 222, 128, 0.2)' },
    error: { color: '#EF4444', icon: 'alert-circle' as const, bg: 'rgba(239, 68, 68, 0.2)' },
    warning: { color: '#F59E0B', icon: 'warning' as const, bg: 'rgba(245, 158, 11, 0.2)' },
};

const ToastContext = createContext<ToastContextData | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<ToastType>('success');
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const insets = useSafeAreaInsets();
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const showSub = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setKeyboardHeight(e.endCoordinates.height);
            },
        );
        const hideSub = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                setKeyboardHeight(0);
            },
        );

        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const hide = useCallback(() => {
        setVisible(false);
        if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    const show = useCallback((msg: string, toastType: ToastType, duration = 3000) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setMessage(msg);
        setType(toastType);
        setVisible(true);
        timerRef.current = setTimeout(() => setVisible(false), duration);
    }, []);

    const value = useMemo(() => ({ show, hide }), [show, hide]);
    const variant = VARIANTS[type];

    const bottomOffset = 20 + (insets.bottom || 10) + keyboardHeight;

    return (
        <ToastContext.Provider value={value}>
            <View className="relative flex-1">
                {children}

                {visible && (
                    <View
                        className="absolute left-5 right-5 z-[9999] items-center"
                        style={{ bottom: bottomOffset }}
                        pointerEvents="box-none">
                        <Pressable
                            onPress={hide}
                            className="w-full flex-row items-center rounded-2xl border border-l-4 border-[#333] bg-[#1A1A1A] p-3 shadow-lg shadow-black/30 active:opacity-90"
                            style={{ borderLeftColor: variant.color }}
                            accessibilityRole="alert">
                            <View
                                className="mr-3 h-10 w-10 items-center justify-center rounded-full"
                                style={{ backgroundColor: variant.bg }}>
                                <Ionicons name={variant.icon} size={22} color={variant.color} />
                            </View>

                            <Text className="flex-1 text-[15px] font-semibold text-white">
                                {message}
                            </Text>

                            <Ionicons name="close" size={20} color="#A3A3A3" />
                        </Pressable>
                    </View>
                )}
            </View>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');

    return {
        showSuccessToast: useCallback(
            (msg: string, t?: number) => context.show(msg, 'success', t),
            [context],
        ),
        showErrorToast: useCallback(
            (msg: string, t?: number) => context.show(msg, 'error', t),
            [context],
        ),
        showWarningToast: useCallback(
            (msg: string, t?: number) => context.show(msg, 'warning', t),
            [context],
        ),
    };
};
