/**
 * @fileoverview Internal movie representations derived from TMDb responses.
 */
import type { MoviePopularListResponses } from '../../../../generated/tmdb/types.gen';

type MoviePopularResult = NonNullable<
  MoviePopularListResponses[200]['results']
>[number];

export interface MovieSummary {
  id: number;
  title: string;
  averageRating: number;
  overview: string;
  posterPath?: string;
  releaseDate?: string;
}

/**
 * Maps a raw TMDb movie payload to the lean shape used throughout the UI.
 */
export const mapToMovieSummary = (movie: MoviePopularResult): MovieSummary => {
  const summary: MovieSummary = {
    averageRating: movie.vote_average ?? 0,
    id: movie.id ?? -1,
    overview: movie.overview ?? '',
    title: movie.title ?? movie.original_title ?? 'Untitled',
  };

  if (movie.poster_path) {
    summary.posterPath = movie.poster_path;
  }

  if (movie.release_date) {
    summary.releaseDate = movie.release_date;
  }

  return summary;
};
