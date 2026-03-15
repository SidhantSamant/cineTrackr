import { Colors } from '@/constants/Colors';
import { router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';

export default function LegalLayout() {
    return (
        <Stack
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: Colors.background,
                },
                headerTitleStyle: {
                    color: Colors.headingText,
                    fontWeight: 'semibold',
                    fontSize: 20,
                },
                headerLeft: () => (
                    <Pressable onPress={router.back} hitSlop={8} className="pr-4">
                        <Ionicons name="chevron-back" size={26} color="white" />
                    </Pressable>
                ),
            }}>
            <Stack.Screen
                name="privacy"
                options={{
                    headerTitle: 'Privacy Policy',
                }}
            />
            <Stack.Screen
                name="terms"
                options={{
                    headerTitle: 'Terms of Service',
                }}
            />
        </Stack>
    );
}
