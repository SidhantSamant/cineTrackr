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
    if (!movie?.runtime) return '';

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
    if (!tv || !tv.first_air_date) return '';

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
    if (!tv) return '';
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

export const getSupabaseAuthError = (error: any): string => {
    const msg = error?.message?.toLowerCase() || '';

    if (msg.includes('invalid login credentials')) {
        return 'Incorrect email or password. Please try again.';
    }
    if (msg.includes('email not confirmed')) {
        return 'Please verify your email address before logging in.';
    }
    if (msg.includes('user already registered') || msg.includes('already exists')) {
        return 'An account with this email already exists. Try logging in!';
    }
    if (msg.includes('password should be at least')) {
        return 'Your password is too weak. Please use at least 6 characters.';
    }
    if (msg.includes('invalid email') || msg.includes('unable to validate email')) {
        return 'Please enter a valid email address.';
    }
    if (msg.includes('signups not allowed')) {
        return 'Registration is currently closed.';
    }
    if (msg.includes('too many requests') || msg.includes('rate limit')) {
        return 'Too many attempts. For your security, please wait a minute and try again.';
    }
    if (msg.includes('network') || msg.includes('timeout') || msg.includes('failed to fetch')) {
        return 'Network error. Please check your internet connection and try again.';
    }
    if (msg.includes('json parse') || msg.includes('unexpected character')) {
        return 'Connection blocked. If you are on Wi-Fi, try using cellular data or a VPN.';
    }

    return 'Something went wrong. Please try again.';
};
