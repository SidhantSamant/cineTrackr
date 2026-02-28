import { useGlobalError } from '@/context/GlobalErrorContext';
import { useToast } from '@/context/ToastContext';
import { supabase } from '@/lib/supabase';
import { getSupabaseAuthError } from '@/utils/uiHelper';
import { validate } from '@/utils/validationHelper';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import { useMutation } from '@tanstack/react-query';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import AuthInput from './UI/AuthInput';

export interface ChangePasswordSheetRef {
    present: () => void;
    dismiss: () => void;
}

const ChangePasswordSheet = forwardRef<ChangePasswordSheetRef, {}>((props, ref) => {
    const { showError } = useGlobalError();
    const { showSuccessToast } = useToast();
    const sheetRef = useRef<TrueSheet>(null);
    const confirmPasswordRef = useRef<TextInput>(null);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useImperativeHandle(ref, () => ({
        present: () => sheetRef.current?.present(),
        dismiss: () => sheetRef.current?.dismiss(),
    }));

    const onDismiss = () => {
        setPassword('');
        setConfirmPassword('');
    };

    const updatePasswordMutation = useMutation({
        mutationFn: async (newPassword: string) => {
            const { data, error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            sheetRef.current?.dismiss();
            showSuccessToast?.('Password updated successfully!');
        },
        onError: (error: any) => {
            showError({
                message: getSupabaseAuthError(error),
                rightButtonText: 'Retry',
                onRightButtonPress: handleUpdate,
            });
        },
    });

    const handleUpdate = () => {
        Keyboard.dismiss();
        const passwordCheck = validate.password(password);
        if (!passwordCheck.isValid && passwordCheck.error) return showError(passwordCheck.error);

        const matchCheck = validate.match(password, confirmPassword);
        if (!matchCheck.isValid && matchCheck.error) return showError(matchCheck.error);

        updatePasswordMutation.mutate(password);
    };

    const isPending = updatePasswordMutation.isPending;

    return (
        <TrueSheet
            ref={sheetRef}
            onDidDismiss={onDismiss}
            detents={['auto']}
            cornerRadius={24}
            backgroundColor={'#121212'}
            grabberOptions={{ width: 48, height: 4, topMargin: 12, color: '#fff' }}
            grabber={true}>
            <Pressable onPress={Keyboard.dismiss} style={StyleSheet.absoluteFill} />

            <View pointerEvents="box-none" className="px-6 pb-12 pt-6">
                <View className="mb-8">
                    <Text className="text-3xl font-bold tracking-tight text-white">
                        Change Password
                    </Text>
                    <Text className="mt-2 text-base leading-6 text-neutral-400">
                        Enter a new password for your Cine Trackr account.
                    </Text>
                </View>

                <View className="gap-y-4">
                    <AuthInput
                        label="New Password"
                        placeholder="Min. 6 characters"
                        value={password}
                        onChangeText={setPassword}
                        editable={!isPending}
                        secureTextEntry={true}
                        textContentType="newPassword"
                        autoComplete="new-password"
                        returnKeyType="next"
                        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                    />

                    <AuthInput
                        ref={confirmPasswordRef}
                        label="Confirm New Password"
                        placeholder="Repeat your new password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        editable={!isPending}
                        secureTextEntry={true}
                        textContentType="newPassword"
                        returnKeyType="done"
                        onSubmitEditing={handleUpdate}
                    />

                    <Pressable
                        onPress={handleUpdate}
                        disabled={isPending}
                        className={`mt-4 items-center rounded-full bg-white py-4 shadow-lg active:opacity-90`}>
                        {isPending ? (
                            <ActivityIndicator color="black" />
                        ) : (
                            <Text className="text-lg font-bold uppercase text-black">
                                Update Password
                            </Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </TrueSheet>
    );
});

export default ChangePasswordSheet;
