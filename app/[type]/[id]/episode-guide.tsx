import SeasonAccordionItem from '@/components/SeasonAccordionItem';
import { Colors } from '@/constants/Colors';
import { useGlobalError } from '@/context/GlobalErrorContext';
import { SeasonVM } from '@/models/SeasonVM';
import { MediaType } from '@/models/TVShowVM';
import { useAuthStore } from '@/store/useAuthStore';
import { mapTmdbToLibraryItem } from '@/utils/mappers';
import { tmdbService } from '@/utils/tmdbService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

export default function EpisodeGuideScreen() {
    const navigation = useNavigation();
    const { id, title, type } = useLocalSearchParams<{
        id: string;
        title: string;
        type: MediaType;
    }>();
    const { showError } = useGlobalError();
    const queryClient = useQueryClient();
    const user = useAuthStore((state) => state.user);
    // const [selectedSeason, setSelectedSeason] = useState(0);

    useLayoutEffect(() => {
        navigation.setOptions({
            // headerTitle: title,
            headerTitle: 'Episode Guide',
        });
    }, [navigation, title]);

    const { data, isLoading, error } = useQuery({
        queryKey: [type, id],
        queryFn: () => tmdbService.getDetails(type, +id),
    });

    const seasons = data?.seasons?.filter((s: { season_number: number }) => s.season_number > 0);

    useEffect(() => {
        const lastSeason = seasons?.[seasons.length - 1];
        if (!lastSeason) return;

        const year = new Date(lastSeason.air_date || Date.now()).getFullYear();
        const isRecent = year >= new Date().getFullYear() - 2;

        if (isRecent) {
            queryClient.prefetchQuery({
                queryKey: ['season', +id, lastSeason.season_number],
                queryFn: () => tmdbService.getSeasonDetails(+id, lastSeason.season_number),
            });
        }
    }, [seasons, id, queryClient]);

    const showMetadata = useMemo(() => {
        if (user && data) {
            return mapTmdbToLibraryItem(user.id, data, type);
        }
    }, [data, user, type]);

    useEffect(() => {
        if (error || (!data && !isLoading)) {
            showError({
                leftButtonText: 'Go Back',
                onLeftButtonPress: router.back,
            });
        }
    }, [error, data, isLoading]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-[#121212]">
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (error || (!data && !isLoading)) {
        return <View className="flex-1 bg-[#121212]" />;
    }

    // const handleToggle = (seasonNum: number) => {
    //     setSelectedSeason((prev) => (prev === seasonNum ? 0 : seasonNum));
    // };

    const renderItem = useCallback(
        ({ item }: { item: SeasonVM }) => (
            <SeasonAccordionItem
                tvShowId={+id}
                seasonSummary={item}
                showMetadata={showMetadata}
                // isExpanded={selectedSeason === item.season_number}
                // onToggle={() => handleToggle(item.season_number)}
            />
        ),
        [id, showMetadata],
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
