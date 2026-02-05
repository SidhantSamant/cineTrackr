import LibraryListSection from '@/components/LibraryListSection';
import { ScrollView } from 'react-native';

export default function HomeScreen() {
    return (
        <ScrollView>
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
