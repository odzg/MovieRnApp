/**
 * @fileoverview Favorites screen showing the locally saved movies.
 */
import { useCallback } from 'react';
import { FlatList } from 'react-native';
import { Button, Separator, Text, YStack } from 'tamagui';
import { MovieCard } from '../components/movie-card.tsx';
import { useFavorites } from '../hooks/use-favorites.ts';
import type { MovieSummary } from '../types/movie.ts';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../auth/auth-context.tsx';

const CONTENT_PADDING = 16;

const FAVORITES_LIST_CONTENT_STYLE = {
  paddingBottom: CONTENT_PADDING * 2,
} as const;

const FAVORITES_EMPTY_CONTENT_STYLE = {
  flexGrow: 1,
  paddingBottom: CONTENT_PADDING * 2,
} as const;

export const FavoritesScreen = () => {
  const navigation = useNavigation();
  const { signOut } = useAuth();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

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

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
      paddingHorizontal={CONTENT_PADDING}
    >
      <YStack
        marginTop="$4"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Text fontSize="$7" fontWeight="700">
          Your Favorites
        </Text>
        <Button
          size="$3"
          theme="active"
          onPress={() => {
            signOut().catch(() => undefined);
          }}
        >
          Sign out
        </Button>
      </YStack>
      <Separator marginVertical="$3" />
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={
          favorites && favorites.length > 0
            ? FAVORITES_LIST_CONTENT_STYLE
            : FAVORITES_EMPTY_CONTENT_STYLE
        }
        ListEmptyComponent={
          <YStack flex={1} alignItems="center" justifyContent="center" gap="$3">
            <Text fontSize="$5" textAlign="center">
              No favorites yet.
            </Text>
            <Button
              size="$4"
              onPress={() => {
                navigation.navigate('Home');
              }}
            >
              Browse Movies
            </Button>
          </YStack>
        }
      />
    </YStack>
  );
};
