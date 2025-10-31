/**
 * @fileoverview Configures the shared TanStack Query client used across the app.
 */
import { QueryClient } from '@tanstack/react-query';

/**
 * The QueryClient is shared application-wide to guarantee consistent caching and
 * request deduplication. Query defaults are tailored for read-heavy scenarios,
 * enabling background refreshes while avoiding unnecessary network chatter.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 10, // 10 minutes
      networkMode: 'always',
      refetchOnMount: false,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (
          error instanceof Error &&
          /network request failed/i.test(error.message)
        ) {
          return failureCount < 3;
        }
        return failureCount < 2;
      },
      staleTime: 1000 * 60, // 1 minute
      throwOnError: false,
    },
  },
});
