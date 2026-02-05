import { useMappedLibrary } from '@/hooks/useLibraryLists';
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import SectionHeader, { ListMediaType } from './SectionHeader';
import AnimatedHorizontalList from './UI/AnimatedHorizontalList';
import { HorizontalListSkeleton } from './UI/Skeletons';
import LibraryGridList from './LibraryGridList';

interface LibraryListSectionProps {
    title: string;
    isGridView?: boolean;
    status?: any;
    isFavorite?: boolean;
    emptyMessage?: string;
    showMovieTab?: boolean;
}

export default function LibraryListSection({
    title,
    status,
    isFavorite,
    isGridView = true,
    showMovieTab = true,
    emptyMessage = 'No items found',
}: LibraryListSectionProps) {
    const [activeTab, setActiveTab] = useState<ListMediaType>('all');

    const visibleTabs = useMemo(() => {
        const tabs: ListMediaType[] = ['all', 'shows', 'anime', 'movies'];
        if (showMovieTab) return tabs;
        return tabs.filter((tab) => tab !== 'movies');
    }, [showMovieTab]);

    const filters = useMemo(() => {
        const base = { ...(status && { status }), ...(isFavorite !== undefined && { isFavorite }) };

        if (activeTab === 'all') {
            if (!showMovieTab) return { ...base, mediaType: 'tv' };
            return base;
        }

        return {
            ...base,
            mediaType: activeTab === 'movies' ? 'movie' : 'tv',
            isAnime: activeTab === 'anime' ? true : undefined,
        } as any;
    }, [activeTab, status, isFavorite, showMovieTab]);

    const { data, isLoading, isPlaceholderData } = useMappedLibrary(filters, isGridView ? 8 : 20);

    const handleSeeAll = () => {
        // ... navigation logic
    };

    // const handleSeeAll = useCallback(() => {
    //     router.push({
    //         pathname: '/home/type-list',
    //         params: {
    //             type: mediaType,
    //             slug: getCategorySlug(listHeading),
    //             title: listHeading,
    //         },
    //     });
    // }, [mediaType, listHeading]);

    return (
        <View className="mx-3 mb-8">
            <SectionHeader
                title={title}
                activeTab={activeTab}
                tabs={visibleTabs}
                onTabChange={setActiveTab}
                onSeeAll={handleSeeAll}
            />

            {isGridView ? (
                <LibraryGridList
                    data={data}
                    isLoading={isLoading}
                    onSeeAll={handleSeeAll}
                    activeTab={activeTab}
                    emptyMessage={emptyMessage}
                />
            ) : isLoading ? (
                <HorizontalListSkeleton hasTitle={false} />
            ) : (
                data &&
                data.length > 0 && (
                    <AnimatedHorizontalList data={data} isPlaceholderData={isPlaceholderData} />
                )
            )}
        </View>
    );
}
