import { supabase } from '@/lib/supabase';
import UserLibraryVM, { MediaStatus, MediaType } from '@/models/UserLibraryVM';

export const LibraryService = {
    /**
     * Fetch all items
     */
    getLibrary: async (status?: MediaStatus, isAnime?: boolean) => {
        let query = supabase
            .from('user_library')
            .select('*')
            .order('updated_at', { ascending: false });

        if (status) query = query.eq('status', status);
        if (isAnime !== undefined) query = query.eq('is_anime', isAnime);

        const { data, error } = await query;
        if (error) throw error;
        return data as UserLibraryVM[];
    },

    /**
     * Check if an item exists and return its status
     */
    getItemStatus: async (tmdbId: number, mediaType: MediaType) => {
        const { data, error } = await supabase
            .from('user_library')
            .select('id, status, is_favorite')
            .eq('tmdb_id', tmdbId)
            .eq('media_type', mediaType)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    /**
     * Add or Update an item
     */
    upsertItem: async (item: Partial<UserLibraryVM>) => {
        const { data, error } = await supabase.from('user_library').upsert(item).select().single();

        if (error) throw error;
        return data;
    },

    /**
     * Remove from Library
     */
    removeItem: async (tmdbId: number, mediaType: MediaType) => {
        const { error } = await supabase
            .from('user_library')
            .delete()
            .eq('tmdb_id', tmdbId)
            .eq('media_type', mediaType);

        if (error) throw error;
        return true;
    },

    /**
     * Updates the status
     */
    updateStatus: async (id: string, status: MediaStatus) => {
        const { data, error } = await supabase
            .from('user_library')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Update Favorite
     */
    updateFavorite: async (id: string, isFavorite: boolean) => {
        const { data, error } = await supabase
            .from('user_library')
            .update({ is_favorite: isFavorite })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },
};
