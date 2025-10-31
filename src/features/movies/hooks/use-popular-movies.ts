/**
 * @fileoverview Hook exposing the popular movies query.
 */
import { useQuery } from '@tanstack/react-query';
import { moviePopularListOptions } from '../../../../generated/tmdb/@tanstack/react-query.gen';
import { tmdbClient } from '../../../services/tmdb-client.ts';
import { mapToMovieSummary, type MovieSummary } from '../types/movie.ts';

const MOVIES_QUERY_LANGUAGE = 'en-US';
const UNSAFE_TMDB_API_KEY = 'b020326deec11f448759da489391789c';

/**
 * Fetches the first page of popular movies leveraging TanStack Query caching.
 */
export const usePopularMovies = () => {
  const query = useQuery({
    ...moviePopularListOptions({
      client: tmdbClient,
      query: {
        // @ts-expect-error Temporary workaround until "api_key" is automatically added to the generated types.
        api_key: UNSAFE_TMDB_API_KEY,
        language: MOVIES_QUERY_LANGUAGE,
        page: 1,
      },
    }),
    select: (response): ReadonlyArray<MovieSummary> => {
      const results = response?.results ?? [];
      return results
        .filter((movie) => typeof movie.id === 'number')
        .map(mapToMovieSummary);
    },
  });

  return {
    ...query,
    movies: query.data ?? [],
  };
};
