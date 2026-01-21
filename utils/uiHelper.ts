export function formatTVYearRange(firstAirDate?: string, lastAirDate?: string, status?: string) {
    if (!firstAirDate) return '';

    const startYear = firstAirDate.split('-')[0];

    // Ongoing
    if (status !== 'Ended') {
        return `${startYear}-`;
    }

    const endYear = lastAirDate?.split('-')[0] ?? startYear;

    return startYear === endYear ? startYear : `${startYear}-${endYear}`;
}

export function formatTVMeta(tv: {
    number_of_seasons?: number;
    number_of_episodes?: number;
    first_air_date?: string;
    last_air_date?: string;
    status?: string;
}) {
    const parts = [];

    if (tv.number_of_seasons) {
        parts.push(`${tv.number_of_seasons} Season${tv.number_of_seasons > 1 ? 's' : ''}`);
    }

    if (tv.number_of_episodes) {
        parts.push(`${tv.number_of_episodes} Episode${tv.number_of_episodes > 1 ? 's' : ''}`);
    }

    const years = formatTVYearRange(tv.first_air_date, tv.last_air_date, tv.status);

    if (years) parts.push(years);

    return parts.join(' • ');
}

export function formatMovieMeta(movie: { runtime?: number | null; release_date?: string }) {
    const year = movie.release_date ? movie.release_date.split('-')[0] : '';

    if (movie.runtime && movie.runtime > 0) {
        const h = Math.floor(movie.runtime / 60);
        const m = movie.runtime % 60;

        return year ? `${h}h ${m}m • ${year}` : `${h}h ${m}m`;
    }

    return year;
}

export function formatMovieRuntime(movie: { runtime?: number | null }) {
    if (!movie.runtime) return '';

    const h = Math.floor(movie.runtime / 60);
    const m = movie.runtime % 60;

    return h ? `${h}h ${m}m` : `${m}m`;
}

export function getMovieYear(movie: { release_date?: string }) {
    return movie?.release_date?.split('-')[0] ?? '';
}

export function formatTVYear(tv: {
    number_of_seasons?: number;
    number_of_episodes?: number;
    first_air_date?: string;
    last_air_date?: string;
    status?: string;
}) {
    if (!tv.first_air_date) return '';

    const startYear = tv.first_air_date.split('-')[0];

    // Ongoing
    if (tv.status !== 'Ended') {
        // return `${startYear} - `;
        return `${startYear} • Continuing`;
    }

    const endYear = tv.last_air_date?.split('-')[0] ?? startYear;

    return startYear === endYear ? startYear : `${startYear}-${endYear}`;
}

export function formatTVSeasonsMeta(tv: {
    number_of_seasons?: number;
    number_of_episodes?: number;
    first_air_date?: string;
    last_air_date?: string;
    status?: string;
}) {
    const parts = [];

    if (tv.number_of_seasons) {
        parts.push(`${tv.number_of_seasons} Season${tv.number_of_seasons > 1 ? 's' : ''}`);
    }

    if (tv.number_of_episodes) {
        parts.push(`${tv.number_of_episodes} Episode${tv.number_of_episodes > 1 ? 's' : ''}`);
    }

    return parts.join(' • ');
}

export const getRatingColor = (voteAverage: number): string => {
    if (voteAverage >= 7) return '#22c55e'; // Green-500
    if (voteAverage >= 5) return '#eab308'; // Yellow-500
    return '#ef4444'; // Red-500
};

export const formatDateFast = (dateString?: string) => {
    if (!dateString) return '';
    // Input: "2024-05-20" -> Output: "May 20"
    // Using simple mapping is faster than Intl.DateTimeFormat for lists
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;

    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    return `${months[monthIndex]} ${day}`;
};
