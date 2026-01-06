import KeyboardAwareScrollView from '@/components/UI/KeyboardAwareScrollView';
import { Colors } from '@/constants/Colors';
import { useGlobalError } from '@/context/GlobalErrorContext';
import { supabase } from '@/lib/supabase';
import { validate } from '@/utils/validationHelper';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, TextInput, View } from 'react-native';

export default function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const router = useRouter();
    const { showError } = useGlobalError();

    const signupMutation = useMutation({
        mutationFn: async (credentials: typeof inputs) => {
            const { data, error } = await supabase.auth.signUp(credentials);
            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            const { session } = data;

            if (!session) {
                router.replace('/(auth)/login');
                // showWarning('Check your email for the confirmation link!');
            } else {
                router.replace('/(tabs)/profile');
            }
        },
        onError: (error: any) => {
            showError({
                message: error.message,
                rightButtonText: 'Retry',
                onRightButtonPress: handleSignup,
            });
        },
    });

    const inputs = { email: email.trim(), password };

    const handleSignup = () => {
        const emailCheck = validate.email(email);
        if (!emailCheck.isValid && emailCheck.error) return showError(emailCheck.error);

        const passwordCheck = validate.password(password);
        if (!passwordCheck.isValid && passwordCheck.error) return showError(passwordCheck.error);

        const matchCheck = validate.match(password, confirmPassword);
        if (!matchCheck.isValid && matchCheck.error) return showError(matchCheck.error);

        signupMutation.mutate(inputs);
    };

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
                        Join the Cine trackr community
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
                        disabled={signupMutation.isPending}
                        className={`mt-4 items-center rounded-full bg-primary py-4 shadow-lg shadow-primary/20 active:opacity-90`}>
                        {signupMutation.isPending ? (
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
