import {
  createStaticNavigation,
  type StaticParamList,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { defaultConfig } from '@tamagui/config/v4';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createTamagui, TamaguiProvider, View } from 'tamagui';
import { useState } from 'react';
import { HomeScreen } from './screens/home.tsx';
import { LoginScreen } from './screens/login.tsx';
import { FavoritesScreen } from './screens/favorites.tsx';
import { AuthProvider } from './contexts/auth.ts';

const config = createTamagui(defaultConfig);

const RootStack = createBottomTabNavigator({
  initialRouteName: 'Login',
  screens: {
    Favorites: FavoritesScreen,
    Home: HomeScreen,
    Login: LoginScreen,
  },
});

type RootStackParamList = StaticParamList<typeof RootStack>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <SafeAreaProvider>
      <AuthProvider value={{ isLoggedIn, setIsLoggedIn }}>
        <TamaguiProvider config={config}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <View style={styles.container}>
            <Navigation />
          </View>
        </TamaguiProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
