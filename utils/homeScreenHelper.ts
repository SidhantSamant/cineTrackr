export enum SectionHeadings {
    PopularMovies = 'Trending Movies',
    PopularTV = 'Trending Series',
    TrendingAnime = 'Trending Anime',
    AiringTodayTV = 'New Episodes',
    UpcomingMovies = 'Coming Soon',
    TopRatedAnime = 'Top Rated Anime',
    TopRatedTV = 'Top Rated Series',
    TopRatedMovies = 'Top Rated Movies',
    // NowPlayingMovies = 'Now Playing Movies',
    // OnTheAirTV = 'On The Air TV Series',
}

export const HomeListSections = [
    { heading: SectionHeadings.PopularTV, type: 'tv' as const },
    { heading: SectionHeadings.TrendingAnime, type: 'tv' as const },
    { heading: SectionHeadings.PopularMovies, type: 'movie' as const },
    { heading: SectionHeadings.AiringTodayTV, type: 'tv' as const },
    { heading: SectionHeadings.UpcomingMovies, type: 'movie' as const },
    { heading: SectionHeadings.TopRatedTV, type: 'tv' as const },
    { heading: SectionHeadings.TopRatedAnime, type: 'tv' as const },
    { heading: SectionHeadings.TopRatedMovies, type: 'movie' as const },
    // { heading: SectionHeadings.NowPlayingMovies, type: 'movie' as const }, //overlap with Popular
    // { heading: SectionHeadings.OnTheAirTV, type: 'tv' as const }, //overlap with Popular and AiringToday
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
        // case SectionHeadings.NowPlayingMovies:
        //     return 'now_playing';

        // TV Series
        case SectionHeadings.PopularTV:
            return 'popular';
        case SectionHeadings.TopRatedTV:
            return 'top_rated';
        case SectionHeadings.AiringTodayTV:
            return 'airing_today';
        // case SectionHeadings.OnTheAirTV:
        //     return 'on_the_air';

        // Anime
        case SectionHeadings.TrendingAnime:
            return 'trending_anime';
        case SectionHeadings.TopRatedAnime:
            return 'top_rated_anime';
    }
};
