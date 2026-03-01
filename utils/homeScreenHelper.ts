export enum SectionHeadings {
    PopularMovies = 'Trending Movies',
    PopularTV = 'Trending Series',
    TrendingAnime = 'Trending Anime',
    AiringTodayTV = 'New Episodes',
    UpcomingMovies = 'Upcoming Movies',
    TopRatedAnime = 'Top Rated Anime',
    TopRatedTV = 'Top Rated Series',
    TopRatedMovies = 'Top Rated Movies',
    NowPlayingMovies = 'Now Playing Movies',
    OnTheAirTV = 'On The Air TV Series',
    HiddenGemsMovies = 'Hidden Gems Movies',
    HiddenGemsTV = 'Hidden Gems TV Series',
    HiddenGemsAnime = 'Hidden Gems Anime',
}

export const HomeListSections = [
    { heading: SectionHeadings.PopularTV, type: 'tv' as const },
    { heading: SectionHeadings.TrendingAnime, type: 'tv' as const },
    { heading: SectionHeadings.PopularMovies, type: 'movie' as const },
    { heading: SectionHeadings.UpcomingMovies, type: 'movie' as const },
    { heading: SectionHeadings.TopRatedTV, type: 'tv' as const },
    { heading: SectionHeadings.TopRatedAnime, type: 'tv' as const },
    { heading: SectionHeadings.TopRatedMovies, type: 'movie' as const },
    { heading: SectionHeadings.HiddenGemsMovies, type: 'movie' as const },
    { heading: SectionHeadings.HiddenGemsTV, type: 'tv' as const },
    { heading: SectionHeadings.HiddenGemsAnime, type: 'tv' as const },
];

export const getCategorySlug = (heading: SectionHeadings): string => {
    switch (heading) {
        // Movies
        case SectionHeadings.PopularMovies:
            return 'popular';
        case SectionHeadings.TopRatedMovies:
            return 'top_rated';
        case SectionHeadings.UpcomingMovies:
            return 'upcoming';
        case SectionHeadings.NowPlayingMovies:
            return 'now_playing';
        case SectionHeadings.HiddenGemsMovies:
            return 'hidden_gems';

        // TV Series
        case SectionHeadings.PopularTV:
            return 'popular';
        case SectionHeadings.TopRatedTV:
            return 'top_rated';
        case SectionHeadings.AiringTodayTV:
            return 'airing_today';
        case SectionHeadings.OnTheAirTV:
            return 'on_the_air';
        case SectionHeadings.HiddenGemsTV:
            return 'hidden_gems';

        // Anime
        case SectionHeadings.TrendingAnime:
            return 'trending_anime';
        case SectionHeadings.TopRatedAnime:
            return 'top_rated_anime';
        case SectionHeadings.HiddenGemsAnime:
            return 'hidden_gems_anime';
    }
};
