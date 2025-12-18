import { Colors } from '@/constants/Colors';
import { Stack } from 'expo-router';
import { HeaderRightIcon } from '../_layout';

export default function HomeStackLayout() {
    return (
        <Stack
            initialRouteName="home"
            screenOptions={{
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: '#121212',
                },
                headerTitleStyle: {
                    color: Colors.headingText,
                    fontWeight: 'bold',
                    fontSize: 24,
                },
            }}>
            <Stack.Screen
                name="home"
                options={{
                    headerTitle: 'Cine Trackr',
                    headerRight: () => <HeaderRightIcon addExtraMargin={false} />,
                }}
            />

            <Stack.Screen
                name="[type]"
                options={{
                    headerTitle: '',
                    headerTitleStyle: {
                        color: Colors.headingText,
                        fontWeight: 'semibold',
                        fontSize: 20,
                    },
                    // headerLeft: () => (
                    //     <Pressable onPress={router.back} hitSlop={20}>
                    //         <Entypo name="chevron-left" size={24} color="white" />
                    //     </Pressable>
                    // ),
                }}
            />
        </Stack>
    );
}
