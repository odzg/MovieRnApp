# Movie Explorer – Candidate Exercise

This repository hosts a React Native (CLI) application that signs users in with
Google, fetches popular movies from TMDb via the auto-generated Hey API
client, and lets users curate a favorites list persisted locally with
`react-native-mmkv`. The exercise emphasises strong typing, predictable data
flows with TanStack Query, and a clean Tamagui-based UI.

## Getting Started

### 1. Install dependencies

```sh
pnpm install
```

### 2. Provide your TMDb access token

The generated client authenticates every request with a v4 access token. Supply
the token through one of the following before starting Metro:

- Set an environment variable that Metro can inline:

  ```sh
  TMDB_ACCESS_TOKEN="YOUR_TOKEN" pnpm start
  ```

- Alternatively, define the token on `globalThis` before the app renders. The
  simplest approach while iterating in the simulator is to add the following to
  `index.js` above `AppRegistry.registerComponent`:

  ```ts
  // eslint-disable-next-line no-undef
  globalThis.TMDB_ACCESS_TOKEN = 'YOUR_TOKEN';
  ```

### 3. Run the native target

With Metro running, launch the platform of your choice:

```sh
pnpm android
pnpm ios
```

## Architecture Overview

The codebase opts for feature-driven organisation with strictly kebab-cased
paths. The table below highlights the main directories and their purpose.

| Path                   | Purpose                                                              |
| ---------------------- | -------------------------------------------------------------------- |
| `src/app.tsx`          | Application entry point, wiring providers and navigation.            |
| `src/config/`          | Runtime configuration helpers (TanStack Query, Tamagui, TMDb token). |
| `src/features/auth/`   | Authentication context, mock Google Sign-In facade, login screen.    |
| `src/features/movies/` | Movie UI, hooks, and local favorites manager.                        |
| `src/hooks/`           | Reusable hooks, e.g. the MMKV subscription helper.                   |
| `src/navigation/`      | Centralised route typing for React Navigation.                       |
| `src/providers/`       | Composition of top-level providers.                                  |
| `src/services/`        | Pre-configured TMDb client instance.                                 |
| `src/storage/`         | MMKV configuration and JSON helpers.                                 |
| `src/utils/`           | Tiny utilities (e.g. runtime assertions).                            |
| `generated/tmdb/`      | Hey API OpenAPI output (React Query bindings + Zod).                 |

### Navigation

- Authenticated users land inside a two-tab bottom navigator (`Home`,
  `Favorites`).
- The login screen renders outside React Navigation to keep unauthenticated UI
  simple while still allowing a full navigation tree post sign-in.

### Data fetching

- TMDb calls use the generated TanStack Query helpers (e.g.
  `moviePopularListOptions`).
- A shared `QueryClient` (see `src/config/query-client.ts`) configures sensible
  defaults: one-minute staleness, retry rules, and background refetches.

### Local persistence

- `react-native-mmkv` stores both the authenticated user and their favorites.
- `useMMKVJSON` subscribes to storage changes via `useSyncExternalStore`, so the
  React tree does not rely on `useEffect` for synchronisation.
- Favorite keys are namespaced per user (`favorites:<userId>`). When a user
  signs out the favorites remain safely isolated but no longer accessible.

### UI layer

- Tamagui components provide styling primitives (`Card`, `Stack`, `Button`).
- The UI deliberately leans on memoisation (`memo` + `useMemo`) to avoid
  unnecessary subtree updates—for instance, `MovieCard` only re-renders when its
  props change.
- Pull-to-refresh uses React Query’s `refetch` API to keep server state
  consistent with the cache.

## Authentication Notes

Google Sign-In is currently mocked via `useGoogleSignInMock` to keep the flow
testable without introducing new dependencies (per the exercise brief). The
mock returns a deterministic user after a short delay, and the rest of the app
is agnostic to whether the credentials are real.

To switch to the real SDK later:

1. Add `@react-native-google-signin/google-signin` to the project.
2. Replace the mock hook in `src/features/auth/services/google-sign-in.ts` with
   the actual native calls.
3. The surrounding context API (`signInWithGoogle`, `signOut`) remains the same,
   so no other callers need to change.

## Error Handling

- Network failures (e.g. airplane mode) are surfaced with a friendly message on
  the Home screen and a retry action.
- TanStack Query’s retry strategy is conservative: automatic retries happen for
  flaky connections but not for logical HTTP errors.

## Verification

- `pnpm typecheck` – strict TypeScript compilation (with generated files marked
  `@ts-nocheck`).
- `pnpm format` – Prettier using the existing config.

## Potential Enhancements

1. **Real Google Sign-In** – Integrate the official SDK and wire profile data
   from Google to replace the placeholder avatar.
2. **Offline caching** – Persist server responses to disk (React Query’s
   hydration APIs) so the Movies list can load even without connectivity.
3. **More TMDb endpoints** – Extend the generated client usage with search,
   pagination, or movie detail screens.
4. **Unit tests** – Add React Testing Library coverage for the authentication
   context and favorites hook, exercising the MMKV integration.

## File Naming Rationale

All files use kebab-case to avoid git case-sensitivity pitfalls and to keep the
layout predictable on case-insensitive file systems. Directories follow the same
convention, and feature-specific folders live under `src/features` so related
UI, hooks, and helpers remain co-located.

## Credits

- [React Navigation](https://reactnavigation.org/) for the bottom tab navigator.
- [Tamagui](https://tamagui.dev/) for the design system primitives.
- [TanStack Query](https://tanstack.com/query/latest) plus
  [Hey API](https://heyapi.dev/openapi-ts/get-started) for the generated TMDb
  client.
