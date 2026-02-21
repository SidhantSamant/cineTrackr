import MediaListItem from '@/components/MediaListItem';
import { Colors } from '@/constants/Colors';
import { useGlobalError } from '@/context/GlobalErrorContext';
import { MediaType } from '@/models/TVShowVM';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

interface PaginatedMediaGridProps {
    listData: any[] | undefined;
    isLoading: boolean;
    isFetchingNextPage: boolean;
    error: any;
    hasNextPage: boolean;
    fetchNextPage: () => void;
    refetch: () => void;
}

export default function PaginatedMediaGrid({
    listData,
    isLoading,
    isFetchingNextPage,
    error,
    hasNextPage,
    fetchNextPage,
    refetch,
}: PaginatedMediaGridProps) {
    const { showError } = useGlobalError();

    useEffect(() => {
        if (error || (!listData && !isLoading)) {
            showError({
                leftButtonText: 'Go Back',
                onLeftButtonPress: router.back,
                rightButtonText: 'Retry',
                onRightButtonPress: refetch,
            });
        }
    }, [error, listData, isLoading]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center bg-[#121212]">
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (error || (!listData && !isLoading)) {
        return <View className="flex-1 bg-[#121212]" />;
    }

    return (
        <View className="flex-1 pr-2" style={{ backgroundColor: Colors.background }}>
            <FlatList
                data={listData}
                numColumns={3}
                keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                contentContainerStyle={{ gap: 8, padding: 8, flexGrow: 1 }}
                columnWrapperStyle={{ gap: 8 }}
                renderItem={({ item }) => (
                    <MediaListItem
                        data={item}
                        type={(item.media_type as MediaType) || 'tv'}
                        isGridView={true}
                    />
                )}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                onEndReachedThreshold={0.5}
                refreshing={isLoading && isFetchingNextPage}
                onRefresh={refetch}
                ListFooterComponent={() =>
                    isFetchingNextPage ? (
                        <View className="py-4">
                            <ActivityIndicator size="large" color={Colors.primary} />
                        </View>
                    ) : null
                }
            />
        </View>
    );
}
