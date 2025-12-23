export enum SectionHeadings {
    // Movies
    PopularMovies = 'Popular Movies',
    TopRatedMovies = 'Top Rated Movies',
    UpcomingMovies = 'Upcoming Movies',
    NowPlayingMovies = 'Now Playing Movies',

    // TV Series
    PopularTV = 'Popular TV Series',
    TopRatedTV = 'Top Rated TV Series',
    AiringTodayTV = 'Airing Today TV Series',
    OnTheAirTV = 'On The Air TV Series',
}

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

        // TV Series
        case SectionHeadings.PopularTV:
            return 'popular';
        case SectionHeadings.TopRatedTV:
            return 'top_rated';
        case SectionHeadings.AiringTodayTV:
            return 'airing_today';
        case SectionHeadings.OnTheAirTV:
            return 'on_the_air';
    }
};
