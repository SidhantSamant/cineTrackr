import LibraryListSection from '@/components/LibraryListSection';
import { ScrollView } from 'react-native';

export default function CollectionScreen() {
    return (
        <ScrollView className="gap-2 px-3">
            <LibraryListSection
                title="Continue Watching"
                status="watching"
                emptyMessage="Start watching something!"
                showMovieTab={false}
            />

            <LibraryListSection
                title="Watchlist"
                status="watchlist"
                emptyMessage="No items in your watchlist"
            />

            <LibraryListSection
                title="Favorites"
                isFavorite={true}
                emptyMessage="No favorites yet"
            />

            <LibraryListSection
                title="Completed"
                status="completed"
                emptyMessage="No items completed yet"
            />
        </ScrollView>
    );
}
