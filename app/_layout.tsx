import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

// Initialize the local SQLite database
import { expoDb } from '../db';

import { useColorScheme } from '@/components/useColorScheme';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  const authenticate = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    
    if (!hasHardware || !isEnrolled) {
      setIsAuthenticated(true);
      return;
    }
    
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock PisoTrack',
      fallbackLabel: 'Use Passcode',
    });
    
    if (result.success) {
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const result = await expoDb.getAllAsync('SELECT * FROM user_profile LIMIT 1');
        if (result.length > 0) {
          setIsOnboarded(true);
          authenticate();
        } else {
          setIsOnboarded(false);
        }
      } catch (err) {
        setIsOnboarded(false);
      }
    };
    checkProfile();
  }, []);

  useEffect(() => {
    if (isOnboarded === false) {
      // Small delay to ensure router is ready
      setTimeout(() => {
        router.replace('/onboarding');
      }, 100);
    }
  }, [isOnboarded]);

  if (isOnboarded === null) {
    return <View style={styles.lockContainer} />; // Loading state
  }

  // Only show lock screen if they are onboarded AND not authenticated
  if (isOnboarded === true && !isAuthenticated) {
    return (
      <View style={styles.lockContainer}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.lockText}>PisoTrack is locked</Text>
        <Pressable style={styles.unlockBtn} onPress={authenticate}>
          <Text style={styles.unlockBtnText}>Unlock App</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="add" options={{ presentation: 'modal', headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  lockContainer: {
    flex: 1,
    backgroundColor: '#0F0F1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  lockText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  unlockBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 20,
  },
  unlockBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
