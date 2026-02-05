import { getTMDBImageSource } from '@/utils/imgHelper';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';

interface WatchProvidersProps {
    providers: any;
    countryCode?: string;
}

const WatchProviders = ({ providers, countryCode = 'IN' }: WatchProvidersProps) => {
    const regionData = providers?.[countryCode];

    const allProviders = useMemo(() => {
        if (!regionData) return [];

        const { flatrate = [], rent = [], buy = [] } = regionData;

        const combined = [
            ...flatrate.map((p: any) => ({ ...p, type: 'Stream' })),
            ...buy.map((p: any) => ({ ...p, type: 'Buy' })),
            ...rent.map((p: any) => ({ ...p, type: 'Rent' })),
        ];

        const uniqueMap = new Map();
        combined.forEach((item) => {
            if (!uniqueMap.has(item.provider_id)) {
                uniqueMap.set(item.provider_id, item);
            }
        });

        return Array.from(uniqueMap.values());
    }, [regionData]);

    if (!regionData || allProviders.length === 0) return null;

    return (
        <View className="pt-6">
            <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-white">Available on</Text>
                <View className="flex-row items-center gap-1.5 opacity-80">
                    <Text className="text-xs text-neutral-400">Powered by JustWatch</Text>
                    {/* <Text className="text-xs text-neutral-400">Powered by</Text> */}
                    {/* <Image
                        source={{
                            uri: 'https://www.themoviedb.org/assets/2/v4/logos/justwatch-c2e58adf5809b6871db650fb74b43db2b8f3637fe3709262572553fa056d8d0a.svg',
                        }}
                        style={{ width: 60, height: 12 }}
                        contentFit="contain"
                    /> */}
                </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-4 pr-4">
                    {allProviders.map((provider) => (
                        <View
                            key={`${provider.provider_id}`}
                            className="flex-row justify-start rounded-lg bg-neutral-700 px-3 py-2">
                            <Image
                                source={getTMDBImageSource(provider.logo_path, 'w92')}
                                style={{ width: 36, height: 36, borderRadius: 8 }}
                                contentFit="contain"
                            />
                            <View className="items-start gap-0.5 pl-2">
                                <Text
                                    numberOfLines={1}
                                    className="text-sm font-semibold text-white">
                                    {provider.provider_name}
                                </Text>
                                <Text className="text-xs text-neutral-200">{provider.type}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default React.memo(WatchProviders);
