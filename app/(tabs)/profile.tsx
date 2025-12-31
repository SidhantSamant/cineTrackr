import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Alert, Pressable, Text, View } from 'react-native';

const ProfileScreen = () => {
    const handleSignIn = () => {
        Alert.alert('Navigation', 'Navigate to Login Screen');
    };

    const handleAction = (action: string) => {
        Alert.alert('Action', `Tapped ${action}`);
    };

    const MenuItem = ({ icon, label, isDestructive = false, hasArrow = true }: any) => (
        <Pressable
            onPress={() => handleAction(label)}
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
        <View className="flex-1 bg-black" style={{ backgroundColor: Colors.background }}>
            <View className="mt-6 items-center px-6">
                <View className="mb-4 h-24 w-24 items-center justify-center rounded-full border-2 border-neutral-700 bg-neutral-800">
                    <Ionicons name="person" size={48} color="#525252" />
                </View>

                <Text className="mb-2 text-center text-xl font-bold text-white">
                    Sign in to your account
                </Text>
                <Text className="mb-6 text-center text-sm text-neutral-400">
                    Sync your watchlist and get personalized recommendations.
                </Text>

                <Pressable
                    onPress={handleSignIn}
                    className="w-full flex-row items-center justify-center rounded-full bg-white py-3.5 active:bg-neutral-200">
                    <Text className="text-base font-bold text-black">Sign In</Text>
                </Pressable>

                <Pressable onPress={() => handleAction('SignUp')} className="mt-4 p-2">
                    <Text className="font-semibold text-neutral-400">
                        Don't have an account? <Text className="text-white">Sign Up</Text>
                    </Text>
                </Pressable>
            </View>

            {/* <View className="mt-10">
                <Text className="mb-2 px-5 text-xs font-bold uppercase tracking-wider text-neutral-500">
                    General
                </Text>
                <View className="border-b border-t border-neutral-800 bg-neutral-900/50">
                    <MenuItem icon="moon-outline" label="Appearance" />
                   <MenuItem icon="notifications-outline" label="Notifications" />
                    <MenuItem icon="globe-outline" label="Language" /> 
                </View>

                <Text className="mb-2 mt-6 px-5 text-xs font-bold uppercase tracking-wider text-neutral-500">
                    Support & About
                </Text>
                <View className="border-b border-t border-neutral-800 bg-neutral-900/50">
                 <MenuItem icon="help-circle-outline" label="Help Center" /> 
                    <MenuItem icon="shield-checkmark-outline" label="Privacy Policy" />
                    <MenuItem icon="document-text-outline" label="Terms of Service" />
                </View>

                 <View className="mb-10 mt-8 items-center">
                    <Text className="text-xs text-neutral-600">Version 1.0.2 (Build 450)</Text>
                </View> *
            </View> */}
        </View>
    );
};

export default ProfileScreen;
