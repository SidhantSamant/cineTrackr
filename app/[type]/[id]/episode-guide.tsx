import SeasonAccordionItem from '@/components/SeasonAccordionItem';
import { Colors } from '@/constants/Colors';
import { SeasonVM } from '@/models/SeasonVM';
import { MediaType } from '@/models/TVShowVM';
import { getDetails } from '@/utils/tmdbService';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

export default function MoviesScreen() {
    const navigation = useNavigation();
    const { id, title, type } = useLocalSearchParams<{
        id: string;
        title: string;
        type: MediaType;
    }>();
    const [seleactedSeason, setSelectedSeason] = useState(0);

    useLayoutEffect(() => {
        navigation.setOptions({
            // headerTitle: title,
            headerTitle: 'Episode Guide',
        });
    }, [navigation, title]);

    const { data, isLoading, error } = useQuery({
        queryKey: [type, id],
        queryFn: () => getDetails(type, +id),
    });

    const seasons = data?.seasons?.filter((s: { season_number: number }) => s.season_number > 0);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-[#121212]">
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (error) {
        return <Text>Something went wrong</Text>;
    }

    const handleToggle = (seasonNum: number) => {
        setSelectedSeason((prev) => (prev === seasonNum ? 0 : seasonNum));
    };

    const renderItem = useCallback(
        ({ item }: { item: SeasonVM }) => (
            <SeasonAccordionItem
                tvShowId={+id}
                seasonSummary={item}
                // isExpanded={seleactedSeason === item.season_number}
                // onToggle={() => handleToggle(item.season_number)}
            />
        ),
        [id, seleactedSeason, handleToggle],
    );

    return (
        <View className="flex-1 p-3" style={{ backgroundColor: Colors.background }}>
            <FlatList
                data={seasons}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}
