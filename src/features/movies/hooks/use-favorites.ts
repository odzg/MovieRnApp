/**
 * @fileoverview Hook to manage favorite movies persisted in MMKV.
 */
import { useCallback, useMemo } from 'react';
import { setJSON } from '../../../storage/mmkv.ts';
import { useAuth } from '../../auth/auth-context.tsx';
import type { MovieSummary } from '../types/movie.ts';
import { useMMKVObject } from 'react-native-mmkv';

const buildFavoritesKey = (userId: string) => `favorites:${userId}`;
const ANONYMOUS_KEY = 'favorites:anonymous';

interface FavoritesManager {
  favorites: ReadonlyArray<MovieSummary> | undefined;
  isFavorite: (movieId: number) => boolean;
  toggleFavorite: (movie: MovieSummary) => void;
  removeFavorite: (movieId: number) => void;
}

/**
 * Exposes a high-level API to toggle favorite movies while persisting them per
 * authenticated user. When no user is logged in the functions become no-ops.
 */
export const useFavorites = (): FavoritesManager => {
  const { currentUser } = useAuth();
  const storageKey = currentUser
    ? buildFavoritesKey(currentUser.id)
    : ANONYMOUS_KEY;

  const [favorites] = useMMKVObject<ReadonlyArray<MovieSummary>>(storageKey);

  const upsertFavorites = useCallback(
    (
      updater: (current: ReadonlyArray<MovieSummary>) => Array<MovieSummary>,
    ) => {
      if (!currentUser || !favorites) {
        return;
      }

      const next = updater(favorites);
      setJSON(buildFavoritesKey(currentUser.id), next);
    },
    [currentUser, favorites],
  );

  const toggleFavorite = useCallback(
    (movie: MovieSummary) => {
      upsertFavorites((current) => {
        const exists = current.some((item) => item.id === movie.id);
        if (exists) {
          return current.filter((item) => item.id !== movie.id);
        }

        return [...current, movie];
      });
    },
    [upsertFavorites],
  );

  const removeFavorite = useCallback(
    (movieId: number) => {
      upsertFavorites((current) =>
        current.filter((item) => item.id !== movieId),
      );
    },
    [upsertFavorites],
  );

  const isFavorite = useCallback(
    (movieId: number) => !!favorites?.some((movie) => movie.id === movieId),
    [favorites],
  );

  return useMemo(
    () => ({
      favorites,
      isFavorite,
      removeFavorite,
      toggleFavorite,
    }),
    [favorites, isFavorite, removeFavorite, toggleFavorite],
  );
};
