# Movie Explorer (React Native)

Movie Explorer is a React Native CLI app that signs users in with a mocked Google flow, fetches popular titles from TMDb, and lets them curate a local favourites list. It is written in TypeScript, uses Tamagui for theming, leverages TanStack Query for data fetching, and persists lightweight state with `react-native-mmkv`.

If you are new to React Native, this guide walks you through every dependency you need and the exact commands to run the project locally.

## What is inside

- React Native 0.82.1 with the community CLI
- TypeScript 5.9 for static typing
- React Navigation tabs for screen structure
- Tamagui UI primitives with automatic light/dark themes
- TanStack Query 5 for caching, retries, and request deduplication
- Hey API generated TMDb client code under `generated/tmdb`
- MMKV storage helpers for persisting auth state and favourites

## Prerequisites

Install the tooling in the order below so Metro, Android, and iOS builds work on the first try.

### All platforms

- **Node.js 24.11.0** – required by the `engines` field. Recommended install:
  ```sh
  nvm install 24.11.0
  nvm use 24.11.0
  ```
  Volta, fnm, or asdf work too; just ensure `node -v` prints `v24.11.0`.
- **pnpm 10.20.0** – enabled through Corepack (bundled with Node 16+):
  ```sh
  corepack enable
  corepack prepare pnpm@10.20.0 --activate
  ```
- **Java Development Kit 17 (Temurin or Zulu)** – required by Android builds and the React Native CLI. Confirm with `java -version`.
- **Git** – for version control and dependency patches.
- **Watchman (optional, macOS)** – improves Metro performance: `brew install watchman`.

### Android setup (macOS, Windows, Linux)

1. Install **Android Studio (Hedgehog or newer)** and, during setup, select:
   - Android SDK Platform 34
   - Android SDK Build-Tools 34.0.0
   - Android Virtual Device (e.g. Pixel 6 emulator)
2. Set the environment variables in your shell profile (adjust path if you moved the SDK):
   ```sh
   export ANDROID_HOME="$HOME/Library/Android/sdk" # macOS
   export ANDROID_HOME="$HOME/Android/Sdk"         # Linux
   export ANDROID_HOME="%LOCALAPPDATA%\\Android\\Sdk" # Windows PowerShell
   export PATH="$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$PATH"
   ```
3. Accept all Android SDK licences:
   ```sh
   yes | "$ANDROID_HOME/tools/bin/sdkmanager" --licenses
   ```

### iOS setup (macOS only)

- **macOS 13.6+** on Apple Silicon or Intel
- **Xcode 16.x** with the Command Line Tools (install via Xcode preferences)
- **Ruby 2.6.10 or newer** – matches the `Gemfile` requirement. macOS 13 ships with a compatible version; `brew install ruby` if needed.
- **Bundler** to install CocoaPods consistently:
  ```sh
  gem install bundler
  ```
- CocoaPods 1.13+ gets installed by `bundle install` (next section).

## Getting started

1. **Clone and enter the project**

   ```sh
   git clone https://github.com/your-org/movie-rn-app.git
   cd movie-rn-app
   ```

   (Skip if the repo is already on your machine.)

2. **Point your shell at the required Node version**

   ```sh
   nvm use 24.11.0
   ```

3. **Install JavaScript dependencies with pnpm**

   ```sh
   pnpm install
   ```

4. **Install native iOS pods (macOS only)**

   ```sh
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

5. **Start the Metro bundler**

   ```sh
   pnpm start
   ```

   Metro runs on port 8081 and must stay open while you use the app.

6. **Launch a native target in a second terminal**
   - Android: `pnpm android` (ensure an emulator or device is connected)
   - iOS (macOS): `pnpm ios` (opens the default simulator)

The first run downloads native dependencies and can take a few minutes. Subsequent runs are much faster.

## Configuring the TMDb API key

The project ships with a temporary TMDb API key that lets you explore the UI immediately. For your own account:

1. Create a TMDb v3 API key in your TMDb dashboard.
2. Open `src/features/movies/hooks/use-popular-movies.ts`.
3. Replace the `UNSAFE_TMDB_API_KEY` value with your key.

For production apps you should load the key from secure native storage or a server rather than committing it to source control.

## Project structure

| Path                   | Description                                                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `src/app.tsx`          | Entry point; wires providers, theming, and the bottom tab navigation (`Home`, `Favorites`).                       |
| `src/config/`          | Shared runtime configuration (TanStack Query client, Tamagui theme).                                              |
| `src/features/auth/`   | Authentication context, mock Google sign-in service, and login screen.                                            |
| `src/features/movies/` | Movie list UI, React Query hooks, and favourites handling. Subfolders hold components, screens, hooks, and types. |
| `src/providers/`       | `AppProviders` composes Safe Area, React Query, Auth, and Tamagui providers.                                      |
| `src/services/`        | Preconfigured TMDb API client.                                                                                    |
| `src/storage/`         | MMKV helpers to persist JSON payloads.                                                                            |
| `src/assets/`          | Static assets bundled with the app.                                                                               |
| `generated/tmdb/`      | Auto-generated API bindings from `@hey-api/openapi-ts` (do not edit manually).                                    |

## Common commands

```sh
pnpm start        # Start Metro without launching a device
pnpm android      # Build and run the Android app
pnpm ios          # Build and run the iOS app (macOS)
pnpm lint         # Run ESLint with the React Native config
pnpm format       # Format the codebase with Prettier
pnpm typecheck    # Run strict TypeScript checks
pnpm check-spelling # Run the cspell dictionary check
```

## Troubleshooting tips

- **Metro cannot find a device** – open Android Studio’s Device Manager or Xcode’s Simulator before running `pnpm android`/`pnpm ios`.
- **`npx react-native doctor` flags issues** – run it to diagnose missing SDK components; fix any ❌ items before retrying your build.
- **Stuck builds on Android** – confirm `JAVA_HOME` points to JDK 17 and that no older JDK version appears first in `PATH`.
- **Pods fail to install** – upgrade Ruby (`brew install ruby`), re-run `bundle install`, then retry `bundle exec pod install`.
- **Stale Metro cache** – stop Metro and run `pnpm start --reset-cache`.

## Next steps

- Swap the mock Google sign-in service for the real native SDK.
- Extend the generated TMDb client to support search or movie detail screens.
- Add automated tests (React Testing Library or Detox) to cover auth and favourites flows.
