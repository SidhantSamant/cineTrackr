import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
export { ErrorBoundary } from 'expo-router';
// import { useReactQueryDevTools } from '@dev-plugins/react-query';
import { MyDarkTheme } from '@/constants/Theme';
import '@/global.css';
import { GlobalErrorProvider } from '@/context/GlobalErrorContext';
import { Colors } from '@/constants/Colors';
import * as SystemUI from 'expo-system-ui';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 10,
            gcTime: 1000 * 60 * 15,
            retry: 2,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
    },
});

export const unstable_settings = {
    initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SystemUI.setBackgroundColorAsync(Colors.background);
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    // useReactQueryDevTools(queryClient);
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider value={MyDarkTheme}>
                <StatusBar style={'light'} />
                <GlobalErrorProvider>
                    <Stack screenOptions={{ contentStyle: { backgroundColor: Colors.background } }}>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
                        <Stack.Screen
                            name="[type]/[id]"
                            options={{ title: '', headerShown: false }}
                        />
                    </Stack>
                </GlobalErrorProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}
