export enum SectionHeadings {
    // Movies
    PopularMovies = 'Popular Movies',
    TopRatedMovies = 'Top Rated Movies',
    UpcomingMovies = 'Upcoming Movies',
    NowPlayingMovies = 'Now Playing Movies',

    // TV Shows
    PopularTV = 'Popular TV Shows',
    TopRatedTV = 'Top Rated TV Shows',
    AiringTodayTV = 'Airing Today TV Shows',
    OnTheAirTV = 'On The Air TV Shows',
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

        // TV Shows
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
