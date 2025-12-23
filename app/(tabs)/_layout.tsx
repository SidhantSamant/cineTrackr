import { Colors } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function HeaderRightIcon({ addExtraMargin = true }: { addExtraMargin?: boolean }) {
    return (
        <Link href="/modal" asChild>
            <Pressable>
                {({ pressed }) => (
                    <Ionicons
                        name="person-circle"
                        size={36}
                        color={'#8c8c8c'}
                        style={{
                            marginRight: addExtraMargin ? 16 : 0,
                            marginBottom: addExtraMargin ? 8 : 0,
                            opacity: pressed ? 0.5 : 1,
                        }}
                    />
                )}
            </Pressable>
        </Link>
    );
}

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                // tabBarShowLabel: false,
                tabBarActiveTintColor: Colors.activeTab,
                tabBarInactiveTintColor: Colors.inactiveTab,
                tabBarStyle: {
                    // backgroundColor: '#1E1E1E',
                    borderTopColor: '#2C2C2C',
                    borderTopWidth: 1,
                    height: Platform.OS === 'android' ? 60 + insets.bottom : 85 + insets.bottom,
                    paddingTop: 8,
                    paddingBottom: Platform.OS === 'android' ? 8 : 28,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginTop: -2,
                    marginBottom: 4,
                },
                headerStyle: {
                    backgroundColor: Colors.background,
                    shadowColor: 'transparent',
                    elevation: 0,
                    borderBottomWidth: 0,
                },
                headerTitleStyle: {
                    color: Colors.headingText,
                    fontWeight: 'bold',
                    fontSize: 24,
                },
                headerTitleAlign: 'left',
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false,
                    // headerTitle: 'Cine Trackr',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'home' : 'home-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                    // headerRight: () => <HeaderRightIcon />,
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: 'Search',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'search' : 'search-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                    headerRight: () => <HeaderRightIcon />,
                }}
            />
            <Tabs.Screen
                name="series"
                options={{
                    title: 'TV Series',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons name={focused ? 'tv' : 'tv-outline'} size={size} color={color} />
                    ),
                    headerRight: () => <HeaderRightIcon />,
                }}
            />
            <Tabs.Screen
                name="watchlist"
                options={{
                    title: 'Watchlist',
                    tabBarIcon: ({ color, size, focused }) => (
                        <Ionicons
                            name={focused ? 'bookmark' : 'bookmark-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                    headerRight: () => <HeaderRightIcon />,
                }}
            />
        </Tabs>
    );
}
