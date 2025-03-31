import { View, Text, ActivityIndicator, Image, Pressable } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FontAwesome } from "@expo/vector-icons";
import { addMovieToWatchlist } from "@/api/watchlist";
import { getMovieDetails } from "@/utils/apiService";

const MovieDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ["movies", id],
    queryFn: () => getMovieDetails(+id),
  });

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: () => addMovieToWatchlist(+id),
    onSuccess: () => queryClient.invalidateQueries(["watchlist"]),
  });

  if (isLoading || isPending) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Failed to fetch data</Text>;
  }

  return (
    <View>
      <Stack.Screen options={{ title: data.title }} />
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w500${data.backdrop_path}` }}
        style={{ width: "100%", height: 300 }}
      />
      <View style={{ padding: 10 }}>
        <Text style={{ fontSize: 24, fontWeight: "500", marginVertical: 10 }}>
          {data.title}
        </Text>
        <View style={{ marginVertical: 10 }}>
          <Pressable
            onPress={() => mutate()}
            style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
          >
            <FontAwesome name="bookmark-o" size={24} color="black" />
            <Text>Add to watchlist</Text>
          </Pressable>
        </View>
        <Text style={{ fontSize: 16 }}>{data.overview}</Text>
      </View>
    </View>
  );
};

export default MovieDetails;
