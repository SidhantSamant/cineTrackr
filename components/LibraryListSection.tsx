import { useLibraryLists } from '@/hooks/useLibraryLists';
import { useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import SectionHeader, { ListMediaType } from './SectionHeader';
import AnimatedHorizontalList from './UI/AnimatedHorizontalList';
import { MediaListSkeleton } from './UI/Skeletons';
import LibraryGridList from './LibraryGridList';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';

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
    const userId = useAuthStore((state) => state.user?.id);

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

    const { data, isLoading, isPlaceholderData } = useLibraryLists(
        userId,
        filters,
        isGridView ? 8 : 20,
    );

    const handleSeeAll = useCallback(() => {
        let targetType = 'tv';
        if (activeTab === 'movies') targetType = 'movie';

        const params: any = {
            title: title,
        };

        if (status) params.status = status;
        if (isFavorite !== undefined) params.isFavorite = isFavorite.toString();
        if (activeTab !== 'all') params.type = targetType;
        if (activeTab === 'anime') params.isAnime = true;

        router.push({
            pathname: isGridView ? '/collection/library-list' : '/home/library-list',
            params: params,
        });
    }, [title, status, isFavorite, activeTab]);

    if (!isGridView && isLoading) {
        return <MediaListSkeleton hasTitle={true} />;
    }

    if (!isGridView && activeTab === 'all' && data?.length === 0) return null;

    return (
        <View>
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
            ) : (
                data &&
                data.length > 0 && (
                    <AnimatedHorizontalList data={data} isPlaceholderData={isPlaceholderData} />
                )
            )}
        </View>
    );
}
