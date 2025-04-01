// import { Text, StyleSheet, FlatList, View, ActivityIndicator } from 'react-native';
// import { useEffect, useState } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import MovieListItem from '@/components/MovieListItem';
// import { Container } from '@/components/UI/Container';

// export default function WatchList() {
//     const {
//         data: movies,
//         isLoading,
//         error,
//     } = useQuery({
//         queryKey: ['watchlist'],
//         queryFn: fetchWatchlistMovies,
//     });

//     if (isLoading) {
//         return <ActivityIndicator />;
//     }

//     if (error) {
//         return <Text>{error.message}</Text>;
//     }
//     return (
//         <Container>
//             <FlatList
//                 data={movies}
//                 numColumns={2}
//                 keyExtractor={(item) => item.id}
//                 contentContainerStyle={{ gap: 8, padding: 8 }}
//                 columnWrapperStyle={{ gap: 8 }}
//                 renderItem={({ item }) => <MovieListItem movie={item} />}
//             />
//         </Container>
//     );
// }
