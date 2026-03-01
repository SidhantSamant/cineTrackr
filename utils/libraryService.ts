import { supabase } from '@/lib/supabase';
import UserLibraryVM, { MediaStatus, MediaType } from '@/models/UserLibraryVM';

export interface LibraryFilters {
    status?: MediaStatus;
    isAnime?: boolean;
    mediaType?: MediaType;
    isFavorite?: boolean;
}

class LibraryService {
    /**
     * Fetch all items, optionally filtered by status, anime, or media type.
     */
    public async getLibrary(filters: LibraryFilters = {}, page: number = 1, limit: number = 20) {
        let query = supabase
            .from('user_library')
            .select('*')
            .order('updated_at', { ascending: false });

        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        if (filters.mediaType) {
            query = query.eq('media_type', filters.mediaType);
        }
        if (filters.isAnime !== undefined) {
            query = query.eq('is_anime', filters.isAnime);
        }
        if (filters.isFavorite !== undefined) {
            query = query.eq('is_favorite', filters.isFavorite);
        }

        // Calculate pagination range (0-indexed and inclusive)
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        query = query.range(from, to);

        const { data, error } = await query;
        if (error) throw error;

        return (data || []) as UserLibraryVM[];
    }

    /**
     * Check if an item exists and return its status
     */
    public async getItemStatus(tmdbId: number, mediaType: MediaType) {
        const { data, error } = await supabase
            .from('user_library')
            .select('id, status, is_favorite, episodes_watched')
            .eq('tmdb_id', tmdbId)
            .eq('media_type', mediaType)
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    /**
     * Add or Update an item
     */
    public async upsertItem(item: Partial<UserLibraryVM>) {
        const { data, error } = await supabase.from('user_library').upsert(item).select().single();

        if (error) throw error;
        return data as UserLibraryVM;
    }

    /**
     * Remove from Library
     */
    public async removeItem(tmdbId: number, mediaType: MediaType) {
        const { error } = await supabase
            .from('user_library')
            .delete()
            .eq('tmdb_id', tmdbId)
            .eq('media_type', mediaType);

        if (error) throw error;
        return true;
    }

    /**
     * Updates the status
     */
    public async updateStatus(id: string, status: MediaStatus) {
        const { data, error } = await supabase
            .from('user_library')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as UserLibraryVM;
    }

    /**
     * Update Favorite
     */
    public async updateFavorite(id: string, isFavorite: boolean) {
        const { data, error } = await supabase
            .from('user_library')
            .update({ is_favorite: isFavorite })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as UserLibraryVM;
    }
}

export const libraryService = new LibraryService();
