import { createContext, use, type Dispatch, type SetStateAction } from 'react';

export interface AuthContext {
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = AuthContext.Provider;

export const useAuth = () => {
  const auth = use(AuthContext);

  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return auth;
};
