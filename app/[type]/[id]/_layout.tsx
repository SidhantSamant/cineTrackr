import { Colors } from '@/constants/Colors';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Stack } from 'expo-router';
import { Pressable } from 'react-native';

export default function DetailStackLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerTitle: '',
                }}
            />

            <Stack.Screen
                name="episode-guide"
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
