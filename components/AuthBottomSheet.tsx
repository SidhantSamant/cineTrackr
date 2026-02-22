import { Colors } from '@/constants/Colors';
import { useGlobalError } from '@/context/GlobalErrorContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import { validate } from '@/utils/validationHelper';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
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
    TextInputProps,
    View,
} from 'react-native';

interface AuthInputProps extends TextInputProps {
    label: string;
}

const AuthInput = forwardRef<TextInput, AuthInputProps>(
    ({ label, onFocus, onBlur, className, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);

        return (
            <View>
                <Text className="mb-2 ml-1 text-xs font-bold uppercase tracking-widest text-neutral-500">
                    {label}
                </Text>
                <TextInput
                    ref={ref}
                    {...props}
                    onFocus={(e) => {
                        setIsFocused(true);
                        onFocus?.(e);
                    }}
                    onBlur={(e) => {
                        setIsFocused(false);
                        onBlur?.(e);
                    }}
                    placeholderTextColor={Colors.placeholderText}
                    autoCapitalize="none"
                    className={`rounded-2xl border ${
                        isFocused ? 'border-primary' : 'border-neutral-800'
                    } bg-neutral-900/50 px-4 py-4 text-base text-white ${className || ''}`}
                />
            </View>
        );
    },
);

export interface AuthBottomSheetRef {
    present: (mode: 'login' | 'signup') => void;
    dismiss: () => void;
}
const AuthBottomSheet = forwardRef<AuthBottomSheetRef, {}>((props, ref) => {
    const { showError } = useGlobalError();
    const { showSuccessToast } = useToast();
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

    const onPresent = () => {
        setIsOpen(true);
    };

    const onDismiss = () => {
        setMode('login');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setIsOpen(false);
    };

    const handleDismiss = () => {
        if (sheetRef && 'current' in sheetRef) {
            sheetRef.current?.dismiss();
        }
    };

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
    }, [isOpen, sheetRef]);

    const loginMutation = useMutation({
        mutationFn: async (credentials: typeof inputs) => {
            const { data, error } = await supabase.auth.signInWithPassword(credentials);
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            handleDismiss();
            showSuccessToast?.('Login successful!');
        },
        onError: (error: any) => {
            showError({
                message: error.message,
                rightButtonText: 'Retry',
                onRightButtonPress: handleLogin,
            });
        },
    });

    const signupMutation = useMutation({
        mutationFn: async (credentials: typeof inputs) => {
            const { data, error } = await supabase.auth.signUp(credentials);
            if (error) throw error;
            return data;
        },
        onSuccess: (data) => {
            const { session } = data;
            if (!session) {
                showError("Couldn't create account. Please try again.");
            } else {
                handleDismiss();
                showSuccessToast?.('Registration successful!');
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

    const handleLogin = () => {
        const emailCheck = validate.email(inputs.email);
        if (!emailCheck.isValid && emailCheck.error) return showError(emailCheck.error);
        if (!inputs.password) return showError('Please enter your password');
        loginMutation.mutate(inputs);
    };

    const handleSignup = () => {
        const emailCheck = validate.email(inputs.email);
        if (!emailCheck.isValid && emailCheck.error) return showError(emailCheck.error);
        const passwordCheck = validate.password(password);
        if (!passwordCheck.isValid && passwordCheck.error) return showError(passwordCheck.error);
        const matchCheck = validate.match(password, confirmPassword);
        if (!matchCheck.isValid && matchCheck.error) return showError(matchCheck.error);
        signupMutation.mutate(inputs);
    };

    const handleSubmit = () => (mode === 'login' ? handleLogin() : handleSignup());

    const handleToggleMode = () => {
        setPassword('');
        setConfirmPassword('');
        setMode(mode === 'login' ? 'signup' : 'login');
    };

    const isPending = loginMutation.isPending || signupMutation.isPending;

    return (
        <TrueSheet
            ref={sheetRef}
            onDidPresent={onPresent}
            onDidDismiss={onDismiss}
            detents={['auto']}
            cornerRadius={24}
            backgroundColor={'#121212'}
            grabberOptions={{ width: 48, height: 4, topMargin: 12, color: '#ccc' }}
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
                        {isPending ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <Text className="text-lg font-bold text-black">
                                {mode === 'login' ? 'Sign In' : 'CREATE ACCOUNT'}
                            </Text>
                        )}
                    </Pressable>

                    <Pressable onPress={handleToggleMode} className="mt-2" disabled={isPending}>
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
