/**
 * @fileoverview Application entry point.
 */
import {
  createStaticNavigation,
  DarkTheme,
  DefaultTheme,
  type StaticParamList,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Star } from '@tamagui/lucide-icons';
import { StatusBar, type ColorSchemeName, useColorScheme } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { AppProviders } from './providers/app-providers.tsx';
import { LoginScreen } from './features/auth/screens/login-screen.tsx';
import { useAuth } from './features/auth/auth-context.tsx';
import { FavoritesScreen } from './features/movies/screens/favorites-screen.tsx';
import { HomeScreen } from './features/movies/screens/home-screen.tsx';

interface AppContentProps {
  colorScheme: ColorSchemeName;
}

interface RootStackParamList extends StaticParamList<typeof AppTabs> {}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

enableScreens(true);

const AppTabs = createBottomTabNavigator({
  initialRouteName: 'Home',
  screenOptions: {
    headerShown: false,
    tabBarActiveTintColor: '#ff6b6b',
    tabBarLabelStyle: {
      fontSize: 14,
      paddingVertical: 4,
    },
  },
  screens: {
    Home: {
      options: {
        title: 'Movies',
        tabBarIcon: Home,
      },
      screen: HomeScreen,
    },
    Favorites: {
      options: {
        title: 'My Favorites',
        tabBarIcon: Star,
      },
      screen: FavoritesScreen,
    },
  },
});

const Navigation = createStaticNavigation(AppTabs);

const AppContent = ({ colorScheme }: AppContentProps) => {
  const { currentUser } = useAuth();
  const navigationTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  if (!currentUser) {
    return <LoginScreen />;
  }

  return <Navigation theme={navigationTheme} />;
};

export default function App() {
  const colorScheme = useColorScheme();
  const defaultTheme = colorScheme === 'dark' ? 'dark' : 'light';

  return (
    <AppProviders defaultTheme={defaultTheme}>
      <StatusBar
        barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'}
      />
      <AppContent colorScheme={colorScheme} />
    </AppProviders>
  );
}
