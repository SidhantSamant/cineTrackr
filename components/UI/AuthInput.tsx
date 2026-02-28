import { Colors } from '@/constants/Colors';
import { forwardRef, useState } from 'react';
import { TextInput, TextInputProps, View, Text } from 'react-native';

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
                    } bg-neutral-900/50 px-4 py-4 text-base text-white ${className}`}
                />
            </View>
        );
    },
);

export default AuthInput;
