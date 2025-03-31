const headers = {
	accept: "application/json",
	Authorization:
		"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNGQxZjA4OTQ5OTgyMDgzNjc3MzQ0ODVjMDZmZGQ1ZSIsIm5iZiI6MTczMjM1MTA0MC4wMTgyMjkyLCJzdWIiOiI2NzQxODQzYjlmNDBhN2FhZjZlYTA5YWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.dhO6mN-RiDg_LZsrM86xTP7HK0ZQJCnZbRGOMsZPuqo",
};

export const addMovieToWatchlist = async (id: number) => {
	const options = {
		method: "POST",
		headers: {
			accept: "application/json",
			"content-type": "application/json",
			Authorization:
				"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNGQxZjA4OTQ5OTgyMDgzNjc3MzQ0ODVjMDZmZGQ1ZSIsIm5iZiI6MTczMjM4MTU3NC42MDQ3Mjg1LCJzdWIiOiI2NzQxODQzYjlmNDBhN2FhZjZlYTA5YWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.F6y-WLZgW-n8oQoC8pDZtDX9mS-3G45EGk4QsicwYro",
		},
		body: JSON.stringify({ media_type: "movie", media_id: id, watchlist: true }),
	};

	const response = await fetch("https://api.themoviedb.org/3/account/21647222/watchlist", options);

	if (!response.ok) {
		throw new Error("Failed adding movie to watchlist");
	}

	const data = await response.json();
	return data;
};

export const fetchWatchlistMovies = async () => {
	const options = {
		method: "GET",
		headers,
	};

	const response = await fetch(
		"https://api.themoviedb.org/3/account/21647222/watchlist/movies?language=en-US&page=1&sort_by=created_at.asc",
		options
	);

	if (!response.ok) {
		throw new Error("Failed to fetch data");
	}

	const data = await response.json();
	return data.results;
};
