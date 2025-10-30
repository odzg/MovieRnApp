import { useNavigation } from '@react-navigation/native';
import { Text, View, Button } from 'tamagui';
import { useAuth } from '../contexts/auth.ts';
import { useEffect } from 'react';

export function LoginScreen() {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (isLoggedIn) {
      navigation.navigate('Home');
    }
  }, [isLoggedIn, navigation]);

  if (isLoggedIn) {
    return null;
  }

  return (
    <View>
      <Text>Please log in.</Text>
      <Button
        onPress={() => {
          setIsLoggedIn(true);
        }}
      >
        Log In
      </Button>
    </View>
  );
}
