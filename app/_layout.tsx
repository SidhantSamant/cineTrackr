import AppUpdateModal from '@/components/AppUpdateModal';
import { Colors } from '@/constants/Colors';
import { MyDarkTheme } from '@/constants/Theme';
import { AuthSheetProvider } from '@/context/AuthSheetContext';
import { GlobalErrorProvider } from '@/context/GlobalErrorContext';
import { ToastProvider } from '@/context/ToastContext';
import '@/global.css';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
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
            staleTime: 1000 * 60 * 30,
            gcTime: 1000 * 60 * 60,
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

    // init google auth
    useEffect(() => {
        const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
        if (webClientId) {
            GoogleSignin.configure({
                scopes: [
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/userinfo.profile',
                ],
                webClientId: webClientId,
            });
        }
    }, []);

    // init supabase auth
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
            NavigationBar.setStyle('dark');
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
                            <AppUpdateModal />
                            <Stack
                                screenOptions={{
                                    contentStyle: { backgroundColor: Colors.background },
                                }}>
                                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                <Stack.Screen name="(legal)" options={{ headerShown: false }} />
                                <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                                <Stack.Screen name="[type]/[id]" options={{ headerShown: false }} />
                            </Stack>
                        </AuthSheetProvider>
                    </ToastProvider>
                </GlobalErrorProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
