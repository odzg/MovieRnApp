import { defineConfig } from '@hey-api/openapi-ts';

const TMDB_API_URL = 'https://developer.themoviedb.org/openapi/tmdb-api.json';

export default defineConfig({
  input: TMDB_API_URL,
  output: 'generated/tmdb',
  plugins: ['@tanstack/react-query', 'zod'],
});
