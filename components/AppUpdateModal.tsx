import { Colors } from '@/constants/Colors';
import { useAppUpdate } from '@/hooks/useAppUpdate';
import { Ionicons } from '@expo/vector-icons';
import { BackHandler, Linking, Modal, Platform, Pressable, Text, View } from 'react-native';

export default function AppUpdateModal() {
    const { isVisible, isMandatory, version, releaseNotes, url, dismissUpdate, skipThisVersion } =
        useAppUpdate();

    if (!isVisible) return null;

    const handleUpdate = () => {
        Linking.openURL(url);
    };

    return (
        <Modal
            transparent
            visible={isVisible}
            animationType="fade"
            onRequestClose={() => {
                if (!isMandatory) {
                    dismissUpdate();
                } else if (Platform.OS === 'android') {
                    BackHandler.exitApp();
                }
            }}>
            <View className="flex-1 items-center justify-center bg-black/80 px-6">
                <View className="w-full max-w-sm items-center rounded-3xl border border-neutral-800 bg-neutral-900 p-6">
                    <View
                        className="mb-4 h-16 w-16 items-center justify-center rounded-full"
                        style={{ backgroundColor: `${Colors.primary}20` }}>
                        <Ionicons name="rocket" size={32} color={Colors.primary} />
                    </View>

                    <Text className="mb-2 text-center text-2xl font-bold text-white">
                        {isMandatory ? 'Update Required' : 'Update Available'}
                    </Text>
                    <Text className="mb-6 text-center text-base text-neutral-400">
                        Version {version} is ready to download!
                    </Text>

                    <View className="mb-6 w-full rounded-xl border border-neutral-700 bg-neutral-800 p-4">
                        <Text className="mb-1 text-sm font-medium text-neutral-300">
                            What's New:
                        </Text>
                        <Text className="text-sm leading-5 text-neutral-400">{releaseNotes}</Text>
                    </View>

                    <View className="w-full gap-3">
                        <Pressable
                            onPress={handleUpdate}
                            className="w-full items-center rounded-xl bg-primary py-4 active:opacity-80">
                            <Text className="text-base font-bold text-neutral-800">
                                Download Update
                            </Text>
                        </Pressable>

                        {!isMandatory && (
                            <>
                                <Pressable
                                    onPress={dismissUpdate}
                                    className="w-full items-center rounded-xl py-3 active:bg-neutral-800">
                                    <Text className="text-base font-bold text-neutral-400">
                                        Maybe Later
                                    </Text>
                                </Pressable>

                                <Pressable
                                    onPress={skipThisVersion}
                                    className="w-full items-center py-2">
                                    <Text className="text-sm font-medium text-neutral-500">
                                        Don't show again for this version
                                    </Text>
                                </Pressable>
                            </>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}
