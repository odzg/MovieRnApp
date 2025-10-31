/**
 * @fileoverview Home screen showing the list of popular movies.
 */
import { useCallback, useMemo } from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Button, Separator, Spinner, Text, YStack } from 'tamagui';
import { MovieCard } from '../components/movie-card.tsx';
import { useFavorites } from '../hooks/use-favorites.ts';
import { usePopularMovies } from '../hooks/use-popular-movies.ts';
import type { MovieSummary } from '../types/movie.ts';

const deriveErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    if (/network request failed/i.test(error.message)) {
      return 'Unable to reach TMDb. Check your internet connection.';
    }
    return error.message;
  }
  return 'Something went wrong while loading movies.';
};

const CONTENT_PADDING = 16;

const HOME_LIST_CONTENT_STYLE = {
  paddingBottom: CONTENT_PADDING * 2,
} as const;

export const HomeScreen = () => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { error, isFetching, isLoading, movies, refetch } = usePopularMovies();

  const friendlyError = useMemo(
    () => (error ? deriveErrorMessage(error) : null),
    [error],
  );

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={isFetching}
        onRefresh={() => {
          refetch({ cancelRefetch: false }).catch(() => undefined);
        }}
      />
    ),
    [isFetching, refetch],
  );

  const renderItem = useCallback(
    ({ item }: { item: MovieSummary }) => (
      <MovieCard
        isFavorite={isFavorite(item.id)}
        movie={item}
        onToggleFavorite={toggleFavorite}
      />
    ),
    [isFavorite, toggleFavorite],
  );

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
        <Spinner size="large" color="$color" />
        <Text marginTop="$3" fontSize="$5">
          Loading popular movies…
        </Text>
      </YStack>
    );
  }

  if (friendlyError) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignItems="center"
        padding="$5"
        gap="$3"
      >
        <Text fontSize="$6" textAlign="center">
          {friendlyError}
        </Text>
        <Button
          size="$4"
          onPress={() => {
            refetch().catch(() => undefined);
          }}
        >
          Retry
        </Button>
      </YStack>
    );
  }

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingHorizontal={CONTENT_PADDING}
    >
      <Text fontSize="$7" fontWeight="700" marginTop="$4">
        Popular Movies
      </Text>
      <Separator marginVertical="$3" />
      <FlatList
        contentContainerStyle={HOME_LIST_CONTENT_STYLE}
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={refreshControl}
        renderItem={renderItem}
        ListEmptyComponent={
          <YStack alignItems="center" marginTop="$5">
            <Text>No movies found.</Text>
          </YStack>
        }
      />
    </YStack>
  );
};
