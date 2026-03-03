import { useState, useEffect } from 'react';
import * as Application from 'expo-application';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

const compareVersions = (v1: string, v2: string) => {
    const v1Parts = v1.split('.').map(Number);
    const v2Parts = v2.split('.').map(Number);
    const maxLength = Math.max(v1Parts.length, v2Parts.length);
    for (let i = 0; i < maxLength; i++) {
        const p1 = v1Parts[i] || 0;
        const p2 = v2Parts[i] || 0;
        if (p1 > p2) return 1;
        if (p1 < p2) return -1;
    }
    return 0;
};

export const useAppUpdate = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [updateInfo, setUpdateInfo] = useState({
        isMandatory: false,
        version: '',
        releaseNotes: '',
        url: '',
    });

    useEffect(() => {
        const checkVersion = async () => {
            // if (__DEV__) return;

            try {
                const currentVersion = Application.nativeApplicationVersion;
                if (!currentVersion) return;

                const { data, error } = await supabase
                    .from('app_versions')
                    .select('*')
                    .eq('platform', Platform.OS)
                    .single();

                if (error || !data) throw error;

                const isHardUpdate = compareVersions(currentVersion, data.min_required_version) < 0;
                const isSoftUpdate = compareVersions(currentVersion, data.latest_version) < 0;

                const baseInfo = {
                    version: data.latest_version,
                    releaseNotes: data.release_notes || 'Bug fixes and performance improvements.',
                    url: data.update_url,
                };

                if (isHardUpdate) {
                    setUpdateInfo({ ...baseInfo, isMandatory: true });
                    setIsVisible(true);
                    return;
                }

                if (isSoftUpdate) {
                    const skippedVersion = await AsyncStorage.getItem('skipped_update_version');
                    if (skippedVersion !== data.latest_version) {
                        setUpdateInfo({ ...baseInfo, isMandatory: false });
                        setIsVisible(true);
                    }
                }
            } catch (error) {
                console.error('Version check failed with error: ', error);
            }
        };

        checkVersion();
    }, []);

    const dismissUpdate = () => setIsVisible(false);

    const skipThisVersion = async () => {
        await AsyncStorage.setItem('skipped_update_version', updateInfo.version);
        setIsVisible(false);
    };

    return { isVisible, ...updateInfo, dismissUpdate, skipThisVersion };
};
