/**
 * @fileoverview Login screen prompting the user to sign in with Google.
 */
import { useMemo } from 'react';
import { Image } from 'react-native';
import { Button, Spinner, Text, YStack } from 'tamagui';
import { useAuth } from '../auth-context.tsx';

const GOOGLE_LOGO =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png';

const GOOGLE_ICON_STYLE = {
  height: 20,
  marginRight: 8,
  width: 20,
} as const;

const SIGN_IN_PRESS_STYLE = {
  opacity: 0.9,
} as const;

export const LoginScreen = () => {
  const { isAuthenticating, signInWithGoogle } = useAuth();

  const signInButtonContent = useMemo(() => {
    if (isAuthenticating) {
      return <Spinner color="$color" />;
    }

    return (
      <>
        <Image
          accessibilityLabel="Google logo"
          source={{ uri: GOOGLE_LOGO }}
          style={GOOGLE_ICON_STYLE}
        />
        <Text fontSize="$4" color="$color12">
          Sign in with Google
        </Text>
      </>
    );
  }, [isAuthenticating]);

  return (
    <YStack
      flex={1}
      alignItems="center"
      justifyContent="center"
      gap="$5"
      padding="$6"
    >
      <Text fontSize="$8" fontWeight="700" textAlign="center">
        Welcome to Movie Explorer
      </Text>
      <Text fontSize="$5" textAlign="center" color="$gray11">
        Sign in with Google to browse popular movies and build your personal
        favorites list.
      </Text>
      <Button
        disabled={isAuthenticating}
        onPress={() => {
          signInWithGoogle().catch(() => undefined);
        }}
        size="$5"
        borderRadius="$10"
        backgroundColor="$color4"
        pressStyle={SIGN_IN_PRESS_STYLE}
      >
        {signInButtonContent}
      </Button>
    </YStack>
  );
};
