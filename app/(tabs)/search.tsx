import { Colors } from '@/constants/Colors';
import { Text, View } from 'react-native';

export default function SearchScreen() {
    return (
        <View className="flex-1" style={{ backgroundColor: Colors.background }}>
            <View className="flex-1 items-center justify-center">
                <Text className="text-lg font-bold text-white">Search Screen</Text>
            </View>
        </View>
    );
}
