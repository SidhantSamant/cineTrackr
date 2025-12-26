import SearchResultItem from '@/components/SearchResultItem';
import { SearchResultListSkeleton } from '@/components/UI/Skeletons';
import { Colors } from '@/constants/Colors';
import { useGlobalError } from '@/context/GlobalErrorContext';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchType } from '@/models/TVShowVM';
import { fetchTrendingList, searchMedia } from '@/utils/tmdbService';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { FlatList, Keyboard, Pressable, Text, TextInput, View } from 'react-native';

const SearchScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [activeFilter, setActiveFilter] = useState<SearchType>('multi');
    const { showError } = useGlobalError();
    const debouncedSearchText = useDebounce(searchText, 500);
    const isSearching = debouncedSearchText.length > 2;

    const {
        data: searchResults,
        isLoading: isSearchLoading,
        error: searchError,
        refetch,
    } = useQuery({
        queryKey: ['search', debouncedSearchText, activeFilter],
        queryFn: () => searchMedia(debouncedSearchText, activeFilter),
        enabled: isSearching,
    });

    const { data: trendingData, isLoading: isTrendingLoading } = useQuery({
        queryKey: ['TrendingList'],
        queryFn: fetchTrendingList,
        enabled: !isSearching,
    });

    useEffect(() => {
        if (searchError) {
            showError({
                rightButtonText: 'Retry',
                onRightButtonPress: refetch,
            });
        }
    }, [searchError]);

    const handleFilterChange = (type: SearchType) => {
        setActiveFilter(type);
    };

    const clearSearch = () => {
        setSearchText('');
        Keyboard.dismiss();
    };

    const FilterChip = ({ type, label }: { type: SearchType; label: string }) => (
        <Pressable
            onPress={() => handleFilterChange(type)}
            className={`mr-2 rounded-full border px-4 py-1.5 ${
                activeFilter === type
                    ? 'border-neutral-100 bg-neutral-100'
                    : 'border-neutral-700 bg-transparent'
            }`}>
            <Text
                className={`text-sm font-bold ${activeFilter === type ? 'text-black' : 'text-neutral-400'}`}>
                {label}
            </Text>
        </Pressable>
    );

    const dataToShow = isSearching ? searchResults : trendingData;
    const isLoading = isSearching ? isSearchLoading : isTrendingLoading;

    return (
        <View className="flex-1" style={{ backgroundColor: Colors.background }}>
            <View className="bg-neutral-900 p-2">
                {/* Search Input */}
                <View className="flex-row items-center rounded-full border border-neutral-800 bg-neutral-800/50 px-3 py-2">
                    <Ionicons name="search" size={20} color="#A3A3A3" />
                    <TextInput
                        className="flex-1 px-3 text-base text-white"
                        placeholder="Search Movies & TV Series..."
                        placeholderTextColor="#606060"
                        value={searchText}
                        onChangeText={setSearchText}
                        returnKeyType="search"
                        autoCorrect={false}
                    />
                    {searchText.length > 0 && (
                        <Pressable onPress={clearSearch}>
                            <Ionicons name="close-circle" size={20} color="#606060" />
                        </Pressable>
                    )}
                </View>

                {isSearching && (
                    <View className="mt-3 flex-row px-4">
                        <FilterChip type="multi" label="All" />
                        <FilterChip type="movie" label="Movies" />
                        <FilterChip type="tv" label="TV Series" />
                    </View>
                )}
            </View>

            <View className="flex-1">
                {isLoading ? (
                    <SearchResultListSkeleton />
                ) : (
                    <FlatList
                        data={dataToShow}
                        keyExtractor={(item) => `${item.media_type}_${item.id}`}
                        renderItem={({ item }) => <SearchResultItem item={item} />}
                        onScrollBeginDrag={Keyboard.dismiss}
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ flexGrow: 1, paddingTop: 16, paddingBottom: 40 }}
                        ListHeaderComponent={
                            !isSearching && trendingData && trendingData.length > 0 ? (
                                <Text className="mb-4 ml-4 text-lg font-bold text-white">
                                    Trending Now
                                </Text>
                            ) : null
                        }
                        ListEmptyComponent={() => (
                            <View className="flex-1 items-center justify-center px-4">
                                {isSearching ? (
                                    <>
                                        <Ionicons name="search-outline" size={64} color="#737373" />
                                        <Text className="mt-4 text-center text-lg font-semibold text-neutral-500">
                                            No results found for "{searchText}"
                                        </Text>
                                    </>
                                ) : (
                                    <Text className="text-neutral-500">No content available</Text>
                                )}
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
};

export default SearchScreen;
