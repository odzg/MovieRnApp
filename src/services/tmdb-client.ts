/**
 * @fileoverview Pre-configured TMDb client used by TanStack Query options.
 */
import { createClient } from '../../generated/tmdb/client/index.ts';

export const tmdbClient = createClient({
  baseUrl: 'https://api.themoviedb.org',
});
