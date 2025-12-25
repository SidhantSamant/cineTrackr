import { CastVM } from '@/models/BaseMediaVM';
import { BLURHASH_TRANSITION, getBlurHash, getTMDBImageSource } from '@/utils/imgHelper';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const CastItem = React.memo(({ item }: { item: CastVM }) => (
    <View className="mr-4 w-[90px] items-center">
        <Image
            source={getTMDBImageSource(item.profile_path, 'w185', 'profile')}
            style={styles.castImage}
            placeholder={getBlurHash(item.profile_path)}
            transition={BLURHASH_TRANSITION}
            contentFit="cover"
        />
        <Text className="mt-2 text-center text-sm font-medium text-white" numberOfLines={1}>
            {item.name}
        </Text>
        <Text className="text-center text-xs text-neutral-400" numberOfLines={1}>
            {item.character}
        </Text>
    </View>
));

const styles = StyleSheet.create({
    castImage: {
        width: 80,
        height: 80,
        borderRadius: 80,
    },
});
export default CastItem;
