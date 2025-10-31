/**
 * @fileoverview Auth-specific type definitions.
 */
export interface AuthenticatedUser {
  /**
   * Unique identifier for the authenticated user. When Google Sign-In is wired
   * this will be the Google user id; for the interim mock flow it derives from
   * the email address.
   */
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export interface AuthContextValue {
  currentUser: AuthenticatedUser | null;
  isAuthenticating: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}
