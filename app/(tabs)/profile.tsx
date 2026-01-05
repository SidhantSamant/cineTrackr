import { Colors } from '@/constants/Colors';
import { useGlobalError } from '@/context/GlobalErrorContext';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';

const ProfileScreen = () => {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const signOutStore = useAuthStore((state) => state.signOut);

    const { showWarning } = useGlobalError();

    const handleSignOut = async () => {
        showWarning({
            title: 'Sign Out',
            message: 'Are you sure you want to sign out?',
            leftButtonText: 'Cancel',
            rightButtonText: 'Sign Out',
            onRightButtonPress: async () => {
                await supabase.auth.signOut();
                signOutStore();
            },
        });
    };

    const MenuItem = ({ icon, label, isDestructive = false, hasArrow = true, onPress }: any) => (
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

    return (
        <ScrollView className="flex-1" style={{ backgroundColor: Colors.background }}>
            <View className="mt-10 items-center px-6">
                <View className="mb-4 h-24 w-24 items-center justify-center rounded-full border-2 border-neutral-700 bg-neutral-800">
                    <Ionicons name="person" size={48} color={user ? Colors.primary : '#525252'} />
                </View>

                {user ? (
                    <>
                        <View className="w-full items-center">
                            <Text className="text-2xl font-black tracking-tight text-white">
                                {user.email?.split('@')[0]}
                            </Text>
                            <Text className="mb-6 text-sm font-medium text-neutral-500">
                                {user.email}
                            </Text>

                            <View className="mb-8 w-full flex-row justify-center gap-x-8 border-y border-neutral-900 py-4">
                                <View className="items-center">
                                    <Text className="text-lg font-bold text-yellow-500">124</Text>
                                    <Text className="text-[10px] uppercase tracking-widest text-neutral-500">
                                        Watched
                                    </Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-lg font-bold text-white">12</Text>
                                    <Text className="text-[10px] uppercase tracking-widest text-neutral-500">
                                        Watchlist
                                    </Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-lg font-bold text-white">4.8</Text>
                                    <Text className="text-[10px] uppercase tracking-widest text-neutral-500">
                                        Avg Rating
                                    </Text>
                                </View>
                            </View>

                            <Pressable
                                onPress={() => {
                                    console.log('Manage Profile Pressed');
                                }}
                                className="w-full flex-row items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900 py-4 active:bg-neutral-800">
                                <Ionicons
                                    name="settings-outline"
                                    size={18}
                                    color="white"
                                    style={{ marginRight: 8 }}
                                />
                                <Text className="text-sm font-bold uppercase tracking-widest text-white">
                                    Manage Profile
                                </Text>
                            </Pressable>
                        </View>
                    </>
                ) : (
                    <>
                        <Text className="mb-2 text-center text-xl font-bold text-white">
                            Sign in to your account
                        </Text>
                        <Text className="mb-6 text-center text-sm text-neutral-400">
                            Sync your watchlist and get personalized recommendations.
                        </Text>

                        <Pressable
                            onPress={() => router.push('/(auth)/login')}
                            className="w-full flex-row items-center justify-center rounded-full bg-white py-3.5 active:bg-neutral-200">
                            <Text className="text-base font-bold text-black">Sign In</Text>
                        </Pressable>

                        <Pressable
                            onPress={() => router.push('/(auth)/signup')}
                            className="mt-4 p-2">
                            <Text className="font-semibold text-neutral-400">
                                Don't have an account? <Text className="text-white">Sign Up</Text>
                            </Text>
                        </Pressable>
                    </>
                )}
            </View>

            {user && (
                <View className="mt-10">
                    <Text className="mb-2 px-5 text-xs font-bold uppercase tracking-wider text-neutral-500">
                        Account
                    </Text>
                    <View className="border-b border-t border-neutral-800 bg-neutral-900/50">
                        <MenuItem
                            icon="log-out-outline"
                            label="Sign Out"
                            isDestructive={true}
                            hasArrow={false}
                            onPress={handleSignOut}
                        />
                    </View>
                </View>
            )}

            {/* <View className="mt-10">
              <Text className="mb-2 px-5 text-xs font-bold uppercase tracking-wider text-neutral-500">
                    General
                </Text>
                <View className="border-b border-t border-neutral-800 bg-neutral-900/50">
                    <MenuItem icon="moon-outline" label="Appearance" />
                    <MenuItem icon="notifications-outline" label="Notifications" />
                </View> 
        

       <Text className="mb-2 mt-6 px-5 text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Account
                </Text> 
              <View className="border-b border-t border-neutral-800 bg-neutral-900/50">
                    <MenuItem icon="shield-checkmark-outline" label="Privacy Policy" />
                    {user && (
                        <MenuItem
                            icon="log-out-outline"
                            label="Sign Out"
                            isDestructive={true}
                            hasArrow={false}
                            onPress={handleSignOut}
                        />
                    )}
                </View> 

               <View className="mb-10 mt-8 items-center">
                    <Text className="text-xs text-neutral-600">Cine Trackr v1.0.0</Text>
                </View> 
            </View> */}
        </ScrollView>
    );
};

export default ProfileScreen;
