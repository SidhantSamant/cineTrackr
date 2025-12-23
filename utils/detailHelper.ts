import { VideoResultVM } from '@/models/BaseMediaVM';

export const getYouTubeKey = (videos: VideoResultVM[] | undefined): string | null => {
    if (!videos || videos.length === 0) return null;

    // Priority 1: Official Trailer on YouTube
    const trailer = videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official);

    // Priority 2: Any Trailer on YouTube
    const anyTrailer = videos.find((v) => v.site === 'YouTube' && v.type === 'Trailer');

    // Priority 3: A Teaser (better than nothing)
    const teaser = videos.find((v) => v.site === 'YouTube' && v.type === 'Teaser');

    return trailer?.key || anyTrailer?.key || teaser?.key || null;
};
