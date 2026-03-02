import { useGlobalError } from '@/context/GlobalErrorContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/useAuthStore';
import { getSupabaseAuthError } from '@/utils/uiHelper';
import { validate } from '@/utils/validationHelper';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useMutation } from '@tanstack/react-query';
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
    ActivityIndicator,
    BackHandler,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AuthInput from './UI/AuthInput';

export interface AuthBottomSheetRef {
    present: (mode: 'login' | 'signup') => void;
    dismiss: () => void;
}

const AuthBottomSheet = forwardRef<AuthBottomSheetRef, {}>((props, ref) => {
    const { showError } = useGlobalError();
    const { showSuccessToast } = useToast();
    const setSession = useAuthStore((state) => state.setSession);

    const sheetRef = useRef<TrueSheet>(null);
    const passwordRef = useRef<TextInput>(null);
    const confirmPasswordRef = useRef<TextInput>(null);

    const [mode, setMode] = useState<'login' | 'signup'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    const inputs = { email: email.trim(), password };

    useImperativeHandle(ref, () => ({
        present: (targetMode: 'login' | 'signup') => {
            setMode(targetMode);
            sheetRef.current?.present();
        },
        dismiss: () => {
            sheetRef.current?.dismiss();
        },
    }));

    useEffect(() => {
        const onBackPress = () => {
            if (isOpen) {
                handleDismiss();
                return true;
            }
            return false;
        };
        const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
        return () => subscription.remove();
    }, [isOpen]);

    const onPresent = () => setIsOpen(true);

    const handleDismiss = () => sheetRef.current?.dismiss();

    const onDismiss = () => {
        setMode('login');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setIsOpen(false);
    };

    const handleAuthSuccess = (session: any, successMessage: string) => {
        if (!session) {
            showError("Couldn't authenticate. Please try again.");
            return;
        }
        setSession(session);
        handleDismiss();
        showSuccessToast(successMessage);
    };

    const handleAuthError = (error: any, retryAction?: () => void) => {
        showError({
            message: getSupabaseAuthError(error),
            rightButtonText: retryAction ? 'Retry' : undefined,
            onRightButtonPress: retryAction,
        });
    };

    const loginMutation = useMutation({
        mutationFn: async (credentials: typeof inputs) => {
            const { data, error } = await supabase.auth.signInWithPassword(credentials);
            if (error) throw error;
            return data;
        },
        onSuccess: ({ session }) => handleAuthSuccess(session, 'Login successful!'),
        onError: (error) => handleAuthError(error, handleLogin),
    });

    const signupMutation = useMutation({
        mutationFn: async (credentials: typeof inputs) => {
            const { data, error } = await supabase.auth.signUp(credentials);
            if (error) throw error;
            return data;
        },
        onSuccess: ({ session }) => handleAuthSuccess(session, 'Registration successful!'),
        onError: (error) => handleAuthError(error, handleSignup),
    });

    const googleAuthMutation = useMutation({
        mutationFn: async () => {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();

            if (userInfo.data?.idToken) {
                const { data, error } = await supabase.auth.signInWithIdToken({
                    provider: 'google',
                    token: userInfo.data.idToken,
                });
                if (error) throw error;
                return data;
            }
            throw new Error('No ID token present!');
        },
        onSuccess: ({ session }) =>
            handleAuthSuccess(session, 'Successfully signed in with Google!'),
        onError: (error: any) => {
            if (error.code !== 'SIGN_IN_CANCELLED') {
                handleAuthError(error);
            }
        },
    });

    const handleLogin = () => {
        Keyboard.dismiss();
        const emailCheck = validate.email(inputs.email);
        if (!emailCheck.isValid) return showError(emailCheck.error!);
        if (!inputs.password) return showError('Please enter your password');
        loginMutation.mutate(inputs);
    };

    const handleSignup = () => {
        Keyboard.dismiss();
        const emailCheck = validate.email(inputs.email);
        if (!emailCheck.isValid) return showError(emailCheck.error!);

        const passwordCheck = validate.password(password);
        if (!passwordCheck.isValid) return showError(passwordCheck.error!);

        const matchCheck = validate.match(password, confirmPassword);
        if (!matchCheck.isValid) return showError(matchCheck.error!);

        signupMutation.mutate(inputs);
    };

    const handleSubmit = () => (mode === 'login' ? handleLogin() : handleSignup());

    const handleToggleMode = () => {
        setPassword('');
        setConfirmPassword('');
        setMode(mode === 'login' ? 'signup' : 'login');
    };

    const isPending =
        loginMutation.isPending || signupMutation.isPending || googleAuthMutation.isPending;

    return (
        <TrueSheet
            ref={sheetRef}
            onDidPresent={onPresent}
            onDidDismiss={onDismiss}
            detents={['auto']}
            cornerRadius={24}
            backgroundColor={'#121212'}
            grabberOptions={{ width: 48, height: 4, topMargin: 12, color: '#fff' }}
            grabber={true}>
            <Pressable onPress={Keyboard.dismiss} style={StyleSheet.absoluteFill} />

            <View pointerEvents="box-none" className="px-6 pb-12 pt-6">
                <View className="mb-8">
                    <Text className="text-4xl font-bold tracking-tight text-white">
                        {mode === 'login' ? 'Welcome back' : 'Track Movies & Shows'}
                    </Text>
                    <Text className="mt-2 text-base leading-6 text-neutral-400">
                        {mode === 'login'
                            ? 'Sign in to your Cine Trackr account'
                            : 'Sign up to sync your watchlist everywhere.'}
                    </Text>
                </View>

                <View className="gap-y-4">
                    <AuthInput
                        label="Email Address"
                        placeholder="name@example.com"
                        value={email}
                        onChangeText={setEmail}
                        editable={!isPending}
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        autoComplete="email"
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current?.focus()}
                    />

                    <AuthInput
                        ref={passwordRef}
                        label={mode === 'login' ? 'Password' : 'Create Password'}
                        placeholder={mode === 'login' ? '••••••••' : 'Min. 6 characters'}
                        value={password}
                        onChangeText={setPassword}
                        editable={!isPending}
                        secureTextEntry={true}
                        textContentType={mode === 'login' ? 'password' : 'newPassword'}
                        autoComplete={mode === 'login' ? 'password' : 'new-password'}
                        returnKeyType={mode === 'signup' ? 'next' : 'done'}
                        onSubmitEditing={() =>
                            mode === 'signup' ? confirmPasswordRef.current?.focus() : handleSubmit()
                        }
                    />

                    {mode === 'signup' && (
                        <AuthInput
                            ref={confirmPasswordRef}
                            label="Confirm Password"
                            placeholder="Repeat your password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            editable={!isPending}
                            secureTextEntry={true}
                            textContentType="newPassword"
                            returnKeyType="done"
                            onSubmitEditing={handleSubmit}
                        />
                    )}

                    <Pressable
                        onPress={handleSubmit}
                        disabled={isPending}
                        className={`mt-2 items-center rounded-full py-4 shadow-lg active:opacity-90 ${
                            mode === 'login' ? 'bg-white' : 'bg-primary shadow-primary/20'
                        }`}>
                        {loginMutation.isPending || signupMutation.isPending ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <Text className="text-lg font-bold text-black">
                                {mode === 'login' ? 'Sign In' : 'CREATE ACCOUNT'}
                            </Text>
                        )}
                    </Pressable>

                    <View className="my-2 flex-row items-center">
                        <View className="h-[1px] flex-1 bg-neutral-800" />
                        <Text className="mx-4 text-sm font-medium text-neutral-500">OR</Text>
                        <View className="h-[1px] flex-1 bg-neutral-800" />
                    </View>

                    <Pressable
                        onPress={() => googleAuthMutation.mutate()}
                        disabled={isPending}
                        className="flex-row items-center justify-center gap-x-3 rounded-full border border-neutral-700 bg-neutral-900 py-4 active:bg-neutral-800">
                        {googleAuthMutation.isPending ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Ionicons name="logo-google" size={20} color="white" />
                                <Text className="text-base font-bold text-white">
                                    Continue with Google
                                </Text>
                            </>
                        )}
                    </Pressable>

                    <Pressable onPress={handleToggleMode} className="mt-4" disabled={isPending}>
                        <Text className="text-center text-neutral-400">
                            {mode === 'login'
                                ? "Don't have an account? "
                                : 'Already have an account? '}
                            <Text className="font-bold text-white">
                                {mode === 'login' ? 'Sign Up' : 'Log In'}
                            </Text>
                        </Text>
                    </Pressable>
                </View>
            </View>
        </TrueSheet>
    );
});

export default AuthBottomSheet;
