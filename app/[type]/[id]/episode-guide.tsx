import MovieListItem from '@/components/MovieListItem';
import { Colors } from '@/constants/Colors';
import { MediaType } from '@/models/TVShowVM';
import { fetchListData, fetchSeasonDetails } from '@/utils/tmdbService';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default function MoviesScreen() {
    const navigation = useNavigation();
    const { id, title, totalSeasons } = useLocalSearchParams<{
        id: string;
        title: string;
        totalSeasons: string;
    }>();
    const [seleactedSeason, setSelectedSeason] = useState(0);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: title,
        });
    }, [navigation, title]);

    const { data, isLoading, error } = useQuery({
        queryKey: [id, seleactedSeason],
        queryFn: () => fetchSeasonDetails(+id, seleactedSeason),
        enabled: seleactedSeason > 0,
    });

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-[#121212]">
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (error) {
        return <Text>{error.message}</Text>;
    }

    return (
        <View className="flex-1 p-3" style={{ backgroundColor: Colors.background }}>
            <Text
                style={{
                    color: Colors.headingText,
                    fontWeight: '600',
                    fontSize: 18,
                }}>
                Episode Guide
            </Text>
        </View>
    );
}
