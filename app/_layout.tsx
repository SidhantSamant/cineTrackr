import { Colors } from '@/constants/Colors';
import { MyDarkTheme } from '@/constants/Theme';
import { AuthSheetProvider } from '@/context/AuthSheetContext';
import { GlobalErrorProvider } from '@/context/GlobalErrorContext';
import { ToastProvider } from '@/context/ToastContext';
import '@/global.css';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
    duration: 400,
    fade: true,
});

export const unstable_settings = {
    initialRouteName: '(tabs)',
};

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 15,
            gcTime: 1000 * 60 * 30,
            retry: 2,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
    },
});

export default function RootLayout() {
    const setSession = useAuthStore((state) => state.setSession);

    const [loaded, fontError] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...Ionicons.font,
    });

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, [setSession]);

    useEffect(() => {
        if (fontError) throw fontError;
    }, [fontError]);

    useEffect(() => {
        if (loaded) {
            SystemUI.setBackgroundColorAsync(Colors.background);
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) return null;

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider value={MyDarkTheme}>
                <StatusBar style="light" />
                <GlobalErrorProvider>
                    <ToastProvider>
                        <AuthSheetProvider>
                            <Stack
                                screenOptions={{
                                    contentStyle: { backgroundColor: Colors.background },
                                }}>
                                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                                <Stack.Screen
                                    name="[type]/[id]"
                                    options={{ title: '', headerShown: false }}
                                />
                            </Stack>
                        </AuthSheetProvider>
                    </ToastProvider>
                </GlobalErrorProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
