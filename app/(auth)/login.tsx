import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useGlobalError } from '@/context/GlobalErrorContext';
import KeyboardAwareScrollView from '@/components/UI/KeyboardAwareScrollView';
import { validate } from '@/utils/validationHelper';
import { useMutation } from '@tanstack/react-query';

export default function LoginScreen() {
    const { showError } = useGlobalError();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const loginMutation = useMutation({
        mutationFn: async (credentials: typeof inputs) => {
            const { data, error } = await supabase.auth.signInWithPassword(credentials);
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            router.replace('/(tabs)/profile');
        },
        onError: (error: any) => {
            showError({
                message: error.message,
                rightButtonText: 'Retry',
                onRightButtonPress: handleLogin,
            });
        },
    });

    const inputs = { email: email.trim(), password };

    const handleLogin = () => {
        const emailCheck = validate.email(inputs.email);
        if (!emailCheck.isValid && emailCheck.error) return showError(emailCheck.error);

        const passwordCheck = validate.password(inputs.password);
        if (!passwordCheck.isValid && passwordCheck.error) return showError(passwordCheck.error);

        loginMutation.mutate(inputs);
    };

    return (
        <View className="flex-1 bg-[#121212] px-6 pt-16">
            <Pressable onPress={router.back} className="mb-8">
                <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>

            <KeyboardAwareScrollView>
                <View className="mb-10">
                    <Text className="text-4xl font-bold text-white">Welcome back</Text>
                    <Text className="mt-2 text-base text-neutral-400">
                        Sign in to your Cine Trackr account
                    </Text>
                </View>
                <View className="gap-y-4">
                    <View>
                        <Text className="mb-2 ml-1 text-xs font-bold uppercase tracking-widest text-neutral-500">
                            Email Address
                        </Text>
                        <TextInput
                            placeholder="email@example.com"
                            placeholderTextColor={Colors.placeholderText}
                            className="rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-4 text-white focus:border-primary"
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View>
                        <Text className="mb-2 ml-1 text-xs font-bold uppercase tracking-widest text-neutral-500">
                            Password
                        </Text>
                        <TextInput
                            placeholder="••••••••"
                            placeholderTextColor={Colors.placeholderText}
                            secureTextEntry
                            className="rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-4 text-white focus:border-primary"
                            onChangeText={setPassword}
                            autoCapitalize="none"
                        />
                    </View>

                    <Pressable
                        onPress={handleLogin}
                        disabled={loginMutation.isPending}
                        className="mt-6 items-center rounded-full bg-white py-4 active:bg-neutral-200">
                        {loginMutation.isPending ? (
                            <ActivityIndicator color={Colors.primary} />
                        ) : (
                            <Text className="text-lg font-bold text-black">Sign In</Text>
                        )}
                    </Pressable>

                    <Pressable onPress={() => router.replace('/(auth)/signup')} className="mt-4">
                        <Text className="text-center text-neutral-400">
                            Don't have an account?{' '}
                            <Text className="font-bold text-white">Sign Up</Text>
                        </Text>
                    </Pressable>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
}
