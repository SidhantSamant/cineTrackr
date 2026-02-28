import ChangePasswordSheet, { ChangePasswordSheetRef } from '@/components/ChangePasswordSheet';
import { Colors } from '@/constants/Colors';
import { useAuthSheet } from '@/context/AuthSheetContext';
import { useGlobalError } from '@/context/GlobalErrorContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    isDestructive?: boolean;
    hasArrow?: boolean;
    onPress: () => void;
}

const MenuItem = ({
    icon,
    label,
    isDestructive = false,
    hasArrow = true,
    onPress,
}: MenuItemProps) => (
    <Pressable
        onPress={onPress}
        className="flex-row items-center justify-between px-5 py-4 active:bg-neutral-800">
        <View className="flex-row items-center gap-4">
            <View className="h-8 w-8 items-center justify-center rounded-full bg-neutral-800">
                <Ionicons name={icon} size={18} color={isDestructive ? '#ef4444' : '#d4d4d4'} />
            </View>
            <Text
                className={`text-base font-medium ${isDestructive ? 'text-red-500' : 'text-neutral-200'}`}>
                {label}
            </Text>
        </View>
        {hasArrow && <Ionicons name="chevron-forward" size={18} color="#525252" />}
    </Pressable>
);

const ProfileScreen = () => {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const signOutStore = useAuthStore((state) => state.signOut);

    const { presentLogin, presentSignup } = useAuthSheet();
    const { showWarning, showError } = useGlobalError();
    const { showSuccessToast } = useToast();

    const changePasswordSheetRef = useRef<ChangePasswordSheetRef>(null);

    const {
        data: stats,
        isLoading: statsLoading,
        refetch: refetchStats,
    } = useQuery({
        queryKey: ['profileStats', user?.id],
        enabled: !!user,
        queryFn: async () => {
            const [watchingRes, watchedRes, watchlistRes, favoritesRes] = await Promise.all([
                supabase
                    .from('user_library')
                    .select('id', { count: 'exact' })
                    .eq('user_id', user?.id)
                    .eq('status', 'watching'),
                supabase
                    .from('user_library')
                    .select('id', { count: 'exact' })
                    .eq('user_id', user?.id)
                    .eq('status', 'completed'),
                supabase
                    .from('user_library')
                    .select('id', { count: 'exact' })
                    .eq('user_id', user?.id)
                    .eq('status', 'watchlist'),
                supabase
                    .from('user_library')
                    .select('id', { count: 'exact' })
                    .eq('user_id', user?.id)
                    .eq('is_favorite', true),
            ]);

            return {
                watching: watchingRes.count || 0,
                watched: watchedRes.count || 0,
                watchlist: watchlistRes.count || 0,
                favorites: favoritesRes.count || 0,
            };
        },
    });

    useFocusEffect(
        useCallback(() => {
            if (user) {
                refetchStats();
            }
        }, [user, refetchStats]),
    );

    const navigateToLibrary = (statType?: string) => {
        const titleMap: Record<string, string> = {
            watching: 'Continue Watching',
            watchlist: 'Your Watchlist',
            fav: 'Your Favorites',
            completed: 'Completed',
        };

        const formattedTitle = statType ? titleMap[statType] : '';
        router.push({
            pathname: '/collection/library-list',
            params: {
                title: formattedTitle,
                status: statType === 'fav' ? '' : statType,
                isFavorite: statType === 'fav' ? 'true' : 'false',
            },
        });
    };

    const handleSignOut = () => {
        showWarning({
            title: 'Sign Out',
            message: 'Are you sure you want to sign out?',
            leftButtonText: 'Cancel',
            rightButtonText: 'Sign Out',
            onRightButtonPress: async () => {
                try {
                    await supabase.auth.signOut();
                    signOutStore();
                    showSuccessToast('Signed out successfully!');
                } catch (error: any) {
                    showError("Couldn't sign out. Please try again.");
                }
            },
        });
    };

    const handleDeleteAccount = () => {
        showWarning({
            title: 'Delete Account',
            message: 'This is permanent. All your data will be wiped.',
            leftButtonText: 'Cancel',
            rightButtonText: 'Delete',
            onRightButtonPress: async () => {
                try {
                    const { error } = await supabase.rpc('delete_user');
                    if (error) throw error;
                    await supabase.auth.signOut();
                    signOutStore();
                    showSuccessToast('Account deleted successfully!');
                } catch (error: any) {
                    showError("Couldn't delete account. Please try again.");
                }
            },
        });
    };

    const displayName =
        user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0];
    const userInitial = displayName ? displayName.charAt(0).toUpperCase() : '?';

    const STATS_CONFIG = [
        { label: 'Watching', val: stats?.watching, key: 'watching' },
        { label: 'Watched', val: stats?.watched, key: 'completed' },
        { label: 'Watchlist', val: stats?.watchlist, key: 'watchlist' },
        { label: 'Favorites', val: stats?.favorites, key: 'fav', color: 'text-yellow-500' },
    ];

    return (
        <>
            <ScrollView
                className="flex-1"
                style={{ backgroundColor: Colors.background }}
                showsVerticalScrollIndicator={false}>
                <View className="mt-10 items-center px-4">
                    <View className="mb-4 h-24 w-24 items-center justify-center rounded-full border-2 border-neutral-700 bg-neutral-800">
                        {user ? (
                            <Text className="text-4xl font-black text-white">{userInitial}</Text>
                        ) : (
                            <Ionicons name="person" size={48} color="#525252" />
                        )}
                    </View>

                    {user ? (
                        <View className="w-full items-center">
                            <Text className="text-2xl font-black tracking-tight text-white">
                                {displayName}
                            </Text>
                            <Text className="mb-6 text-sm font-medium text-neutral-500">
                                {user.email}
                            </Text>

                            <View className="mb-8 w-full flex-row justify-between border-y border-neutral-900 px-2 py-4">
                                {STATS_CONFIG.map((stat) => (
                                    <Pressable
                                        key={stat.label}
                                        onPress={() => navigateToLibrary(stat.key)}
                                        disabled={statsLoading || stat.val === 0}
                                        className={`flex-1 items-center ${!statsLoading && 'active:opacity-50'}`}>
                                        {statsLoading ? (
                                            <ActivityIndicator
                                                size="small"
                                                color={Colors.primary}
                                                className="mb-1"
                                            />
                                        ) : (
                                            <Text
                                                className={`text-xl font-bold ${stat.color || 'text-white'}`}>
                                                {stat.val || 0}
                                            </Text>
                                        )}
                                        <Text className="mt-1 text-[9px] uppercase tracking-widest text-neutral-500">
                                            {stat.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    ) : (
                        <View className="items-center">
                            <Text className="mb-2 text-xl font-bold text-white">
                                Sign in to your account
                            </Text>
                            <Text className="mb-6 px-10 text-center text-sm text-neutral-400">
                                Sync your watchlist and track your favorite movies across devices.
                            </Text>
                            <Pressable
                                onPress={presentLogin}
                                className="w-full min-w-[280px] rounded-full bg-white py-3.5 active:bg-neutral-200">
                                <Text className="text-center text-base font-bold text-black">
                                    Sign In
                                </Text>
                            </Pressable>
                            <Pressable onPress={presentSignup} className="mt-4 p-2">
                                <Text className="font-semibold text-neutral-400">
                                    Don't have an account?{' '}
                                    <Text className="text-white">Sign Up</Text>
                                </Text>
                            </Pressable>
                        </View>
                    )}
                </View>

                {/* <View className="mt-6">
                    <Text className="mb-2 px-5 text-xs font-bold uppercase tracking-wider text-neutral-500">
                        General
                    </Text>
                    <View className="border-b border-t border-neutral-800 bg-neutral-900/50">
                        <MenuItem
                            icon="shield-checkmark-outline"
                            label="Privacy Policy"
                            // onPress={() => Linking.openURL('https://cine-trackr.com/privacy')}
                            onPress={() => {}}
                        />
                        <MenuItem
                            icon="information-circle-outline"
                            label="Terms of Service"
                            // onPress={() => Linking.openURL('https://cine-trackr.com/terms')}
                            onPress={() => {}}
                        />
                    </View>
                </View> */}

                {user && (
                    <View className="mt-8">
                        <Text className="mb-2 px-5 text-xs font-bold uppercase tracking-wider text-neutral-500">
                            Account
                        </Text>
                        <View className="border-b border-t border-neutral-800 bg-neutral-900/50">
                            <MenuItem
                                icon="key-outline"
                                label="Change Password"
                                onPress={() => changePasswordSheetRef.current?.present()}
                            />
                            <MenuItem
                                icon="log-out-outline"
                                label="Sign Out"
                                hasArrow={false}
                                onPress={handleSignOut}
                            />
                            <MenuItem
                                icon="trash-outline"
                                label="Delete Account"
                                isDestructive
                                hasArrow={false}
                                onPress={handleDeleteAccount}
                            />
                        </View>
                    </View>
                )}

                <View className="mb-10 mt-8 items-center">
                    <Text className="text-xs text-neutral-600">Cine Trackr v1.0.0</Text>
                </View>
            </ScrollView>

            {user && <ChangePasswordSheet ref={changePasswordSheetRef} />}
        </>
    );
};

export default ProfileScreen;
