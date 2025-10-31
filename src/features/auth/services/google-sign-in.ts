/**
 * @fileoverview Temporary Google Sign-In glue code.
 *
 * The real implementation will rely on `@react-native-google-signin/google-signin`.
 * Because the dependency is not yet part of the project the functions below
 * simulate the behaviour so the rest of the app can be developed and tested.
 */
import { useState } from 'react';
import { Alert } from 'react-native';
import type { AuthenticatedUser } from '../types/auth-types.ts';

interface UseGoogleSignInMockParams {
  onAuthenticated: (user: AuthenticatedUser) => void;
  onSignedOut: () => void;
}

/**
 * Hook returning mock implementations for the Google Sign-In commands. Once the
 * actual SDK is added the logic in here can be replaced with the native calls
 * while keeping the Auth context API identical.
 */
export const useGoogleSignInMock = ({
  onAuthenticated,
  onSignedOut,
}: UseGoogleSignInMockParams) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const signIn = async () => {
    if (isAuthenticating) {
      return;
    }

    setIsAuthenticating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const user: AuthenticatedUser = {
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
        email: 'candidate@example.com',
        fullName: 'Movie Buff',
        id: 'mock-google-user',
      };
      onAuthenticated(user);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Sign-in failed', error.message);
      } else {
        Alert.alert('Sign-in failed', 'An unexpected error occurred.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const signOut = async () => {
    if (isAuthenticating) {
      return;
    }

    setIsAuthenticating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      onSignedOut();
    } finally {
      setIsAuthenticating(false);
    }
  };

  return {
    isAuthenticating,
    signIn,
    signOut,
  };
};
