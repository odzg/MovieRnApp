/**
 * @fileoverview Aggregates all top-level providers to keep App.tsx lean.
 */
import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TamaguiProvider } from 'tamagui';
import { queryClient } from '../config/query-client.ts';
import { tamaguiConfig } from '../config/tamagui.ts';
import { AuthProvider } from '../features/auth/auth-context.tsx';

interface AppProvidersProps {
  children: ReactNode;
  defaultTheme: string;
}

export const AppProviders = ({ children, defaultTheme }: AppProvidersProps) => {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TamaguiProvider config={tamaguiConfig} defaultTheme={defaultTheme}>
            {children}
          </TamaguiProvider>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
};
