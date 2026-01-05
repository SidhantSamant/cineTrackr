import KeyboardAwareScrollView from '@/components/UI/KeyboardAwareScrollView';
import { Colors } from '@/constants/Colors';
import { useGlobalError } from '@/context/GlobalErrorContext';
import { supabase } from '@/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const router = useRouter();
    const { showError } = useGlobalError();

    const handleSignup = async () => {
        if (!email || !password) return showError('Fields cannot be empty');
        if (password !== confirmPassword) return showError('Passwords do not match');

        setLoading(true);
        const {
            data: { session },
            error,
        } = await supabase.auth.signUp({ email, password });

        if (error) {
            showError({
                message: error.message,
                rightButtonText: 'Retry',
                onRightButtonPress: handleSignup,
            });
            setLoading(false);
        } else {
            if (!session) {
                // Alert.alert('Success', 'Check your email for a verification link!');
                router.replace('/(auth)/login');
            } else {
                router.replace('/(tabs)/profile');
            }
        }
    };

    // Helper for input styling based on focus
    const getInputStyle = (fieldName: string) => {
        return `rounded-2xl border ${focusedField === fieldName ? 'border-primary' : 'border-neutral-800'} bg-neutral-900/50 px-4 py-4 text-white text-base`;
    };

    return (
        <View className="flex-1 bg-[#121212] px-6 pt-16">
            <Pressable onPress={router.back} className="mb-8">
                <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>

            <KeyboardAwareScrollView>
                <View className="mb-10">
                    <Text className="text-4xl font-bold tracking-tight text-white">
                        Join the track
                    </Text>
                    <Text className="mt-2 text-base leading-6 text-neutral-400">
                        Create an account to sync your watchlist and movie history across devices.
                    </Text>
                </View>
                <View className="gap-y-5">
                    <View>
                        <Text className="mb-2 ml-1 text-xs font-bold uppercase tracking-widest text-neutral-500">
                            Email Address
                        </Text>
                        <TextInput
                            placeholder="name@example.com"
                            placeholderTextColor={Colors.placeholderText}
                            className={getInputStyle('email')}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField(null)}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View>
                        <Text className="mb-2 ml-1 text-xs font-bold uppercase tracking-widest text-neutral-500">
                            Create Password
                        </Text>
                        <TextInput
                            placeholder="Min. 6 characters"
                            placeholderTextColor={Colors.placeholderText}
                            secureTextEntry
                            className={getInputStyle('password')}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            onChangeText={setPassword}
                            autoCapitalize="none"
                        />
                    </View>

                    <View>
                        <Text className="mb-2 ml-1 text-xs font-bold uppercase tracking-widest text-neutral-500">
                            Confirm Password
                        </Text>
                        <TextInput
                            placeholder="Repeat your password"
                            placeholderTextColor={Colors.placeholderText}
                            secureTextEntry
                            className={getInputStyle('confirm')}
                            onFocus={() => setFocusedField('confirm')}
                            onBlur={() => setFocusedField(null)}
                            onChangeText={setConfirmPassword}
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Submit Button */}
                    <Pressable
                        onPress={handleSignup}
                        disabled={loading}
                        className={`mt-4 items-center rounded-full bg-primary py-4 shadow-lg shadow-primary/20 active:opacity-90`}>
                        {loading ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <Text className="text-lg font-black text-black">CREATE ACCOUNT</Text>
                        )}
                    </Pressable>

                    {/* Navigation Link */}
                    <Pressable onPress={() => router.replace('/(auth)/login')} className="mt-4">
                        <Text className="text-center text-neutral-400">
                            Already have an account?{' '}
                            <Text className="font-bold text-white">Log In</Text>
                        </Text>
                    </Pressable>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
}
