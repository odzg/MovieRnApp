/**
 * @fileoverview Visual representation of a movie in list contexts.
 */
import { memo, useMemo } from 'react';
import { Image } from 'react-native';
import { Button, Card, Paragraph, Text, XStack, YStack } from 'tamagui';
import type { MovieSummary } from '../types/movie.ts';

/**
 * Base URL used when building poster image URLs. The 200px wide variant keeps
 * the UI lightweight while still looking crisp on modern devices.
 */
export const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w200';

interface MovieCardProps {
  isFavorite: boolean;
  movie: MovieSummary;
  onToggleFavorite: (movie: MovieSummary) => void;
}

const POSTER_WIDTH = 90;
const POSTER_HEIGHT = 135;

/**
 * MovieCard renders a condensed layout optimised for list contexts, keeping the
 * amount of re-render work minimal by memoising derived values and wrapping the
 * component with `memo`.
 */
const MovieCardComponent = ({
  isFavorite,
  movie,
  onToggleFavorite,
}: MovieCardProps) => {
  const posterUri = useMemo(() => {
    if (!movie.posterPath) {
      return undefined;
    }
    return `${TMDB_IMAGE_BASE_URL}${movie.posterPath}`;
  }, [movie.posterPath]);

  return (
    <Card elevate bordered padding="$3" marginVertical="$2">
      <XStack gap="$3">
        <YStack
          width={POSTER_WIDTH}
          height={POSTER_HEIGHT}
          overflow="hidden"
          borderRadius="$4"
        >
          {posterUri ? (
            <Image
              accessibilityLabel={`${movie.title} poster`}
              source={{ uri: posterUri }}
              style={{
                height: POSTER_HEIGHT,
                width: POSTER_WIDTH,
              }}
              resizeMode="cover"
            />
          ) : (
            <YStack
              alignItems="center"
              backgroundColor="$gray5"
              flex={1}
              justifyContent="center"
              padding="$2"
            >
              <Text fontSize="$3" color="$gray11" textAlign="center">
                No poster
              </Text>
            </YStack>
          )}
        </YStack>
        <YStack flex={1} gap="$2" justifyContent="space-between">
          <YStack gap="$1.5">
            <Text fontSize="$5" fontWeight="700">
              {movie.title}
            </Text>
            <Paragraph fontSize="$3" color="$gray11" numberOfLines={3}>
              {movie.overview || 'No synopsis available.'}
            </Paragraph>
          </YStack>
          <XStack alignItems="center" justifyContent="space-between">
            <Text fontSize="$3" color="$gray12">
              ⭐ {movie.averageRating.toFixed(1)}
            </Text>
            <Button
              size="$3"
              onPress={() => onToggleFavorite(movie)}
              theme={isFavorite ? 'red' : null}
            >
              {isFavorite ? 'Remove Favourite' : 'Add Favourite'}
            </Button>
          </XStack>
        </YStack>
      </XStack>
    </Card>
  );
};

export const MovieCard = memo(MovieCardComponent);
