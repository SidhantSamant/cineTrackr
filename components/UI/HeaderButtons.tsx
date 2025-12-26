import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Pressable } from 'react-native';

export function HeaderRightProfileIcon({ addExtraMargin = true }: { addExtraMargin?: boolean }) {
    return (
        <Link href="/modal" asChild>
            <Pressable>
                {({ pressed }) => (
                    <Ionicons
                        name="person-circle"
                        size={36}
                        color={'#8c8c8c'}
                        style={{
                            marginRight: addExtraMargin ? 16 : 0,
                            marginBottom: addExtraMargin ? 8 : 0,
                            opacity: pressed ? 0.5 : 1,
                        }}
                    />
                )}
            </Pressable>
        </Link>
    );
}

export function HeaderRightSettingsIcon({ addExtraMargin = true }: { addExtraMargin?: boolean }) {
    return (
        <Link href="/modal" asChild>
            <Pressable>
                {({ pressed }) => (
                    <Ionicons
                        name="settings-outline"
                        size={36}
                        color={'white'}
                        style={{
                            marginRight: addExtraMargin ? 16 : 0,
                            marginBottom: addExtraMargin ? 8 : 0,
                            opacity: pressed ? 0.5 : 1,
                        }}
                    />
                )}
            </Pressable>
        </Link>
    );
}
