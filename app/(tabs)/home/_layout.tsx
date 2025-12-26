import { Colors } from '@/constants/Colors';
import { router, Stack } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable } from 'react-native';

export default function HomeStackLayout() {
    return (
        <Stack
            initialRouteName="index"
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: Colors.background,
                },
                headerTitleStyle: {
                    color: Colors.headingText,
                    fontWeight: 'bold',
                    fontSize: 24,
                },
            }}>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: 'Cine Trackr',
                    // headerRight: () => <HeaderRightProfileIcon addExtraMargin={false} />,
                }}
            />

            <Stack.Screen
                name="type-list"
                options={{
                    headerTitle: '',
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
                }}
            />
        </Stack>
    );
}
