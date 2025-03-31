// const headers = {
//     accept: "application/json",
//     Authorization:
//         "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlNGQxZjA4OTQ5OTgyMDgzNjc3MzQ0ODVjMDZmZGQ1ZSIsIm5iZiI6MTczMjM1MTA0MC4wMTgyMjkyLCJzdWIiOiI2NzQxODQzYjlmNDBhN2FhZjZlYTA5YWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.dhO6mN-RiDg_LZsrM86xTP7HK0ZQJCnZbRGOMsZPuqo",
// };

// // export const fetchTopRatedMovies = async (page: number = 1) => {
// export const fetchTopRatedMovies = async ({ pageParam }: { pageParam: number }) => {
//     const options = {
//         method: "GET",
//         headers,
//     };

//     const response = await fetch(
//         `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${pageParam}`,
//         options
//     );

//     if (!response.ok) {
//         throw new Error("Failed to fetch data");
//     }

//     const data = await response.json();
//     return data.results;
// };

// export const getMovieDetails = async (id: number) => {
//     const options = {
//         method: "GET",
//         headers,
//     };

//     const response = await fetch(
//         `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
//         options
//     );

//     if (!response.ok) {
//         throw new Error("Failed to fetch data");
//     }

//     const data = await response.json();
//     return data;
// };
