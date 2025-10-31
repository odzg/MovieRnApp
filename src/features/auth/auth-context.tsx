/**
 * @fileoverview Authentication context exposing login state and commands.
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { getJSON, removeValue, setJSON } from '../../storage/mmkv.ts';
import { useGoogleSignInMock } from './services/google-sign-in.ts';
import type {
  AuthContextValue,
  AuthenticatedUser,
} from './types/auth-types.ts';

const AUTH_STORAGE_KEY = 'auth:user';

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider keeps track of the currently authenticated user and persists the
 * information across launches. The mock Google Sign-In implementation can be
 * replaced transparently once the native SDK is wired.
 */
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(() =>
    getJSON<AuthenticatedUser | null>(AUTH_STORAGE_KEY, null),
  );

  const persistUser = useCallback((user: AuthenticatedUser | null) => {
    if (user) {
      setJSON(AUTH_STORAGE_KEY, user);
    } else {
      removeValue(AUTH_STORAGE_KEY);
    }
    setCurrentUser(user);
  }, []);

  const { isAuthenticating, signIn, signOut } = useGoogleSignInMock({
    onAuthenticated: persistUser,
    onSignedOut: () => persistUser(null),
  });

  const contextValue = useMemo<AuthContextValue>(
    () => ({
      currentUser,
      isAuthenticating,
      signInWithGoogle: signIn,
      signOut,
    }),
    [currentUser, isAuthenticating, signIn, signOut],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

/**
 * Accessor for the authentication context. Consumers must be wrapped inside the
 * `AuthProvider`.
 */
export const useAuth = (): AuthContextValue => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return value;
};
