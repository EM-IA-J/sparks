import { useEffect, useState, useRef } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Animated, View, StyleSheet } from 'react-native';
import { useUserStore } from '../src/store/useUserStore';
import { StorageService } from '../src/services/storage';
import { SplashScreen } from '../src/components';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [showSplash, setShowSplash] = useState(true);
  const appFadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Load user from storage on mount
    StorageService.getUser().then((savedUser) => {
      if (savedUser) {
        console.log('Loaded user from storage:', savedUser);
        setUser(savedUser);
      } else {
        console.log('No saved user, will show onboarding');
        // Create a default user for testing if needed
        const defaultUser = {
          id: Math.random().toString(36).substring(7),
          areas: [],
          cadence: 'daily' as const,
          notifWindow: 'morning' as const,
          socialOptIn: false,
          streak: 0,
          createdAt: Date.now(),
          onboardingCompleted: false,
        };
        setUser(defaultUser);
      }
    });
  }, []);

  useEffect(() => {
    // Redirect logic based on onboarding status
    if (!user) {
      console.log('No user yet, waiting...');
      return;
    }

    const inOnboarding = segments[0] === 'onboarding';
    const inTabs = segments[0] === '(tabs)';

    console.log('Current route:', segments, 'onboardingCompleted:', user.onboardingCompleted);

    if (!user.onboardingCompleted && !inOnboarding) {
      console.log('Redirecting to onboarding');
      router.replace('/onboarding');
    } else if (user.onboardingCompleted && (inOnboarding || segments.length === 0)) {
      console.log('Redirecting to tabs');
      router.replace('/(tabs)');
    }
  }, [user, segments]);

  useEffect(() => {
    // Persist user on changes
    if (user && user.onboardingCompleted) {
      console.log('Saving user to storage:', user);
      StorageService.saveUser(user);
    }
  }, [user]);

  const handleSplashFinish = () => {
    // Fade in the app while splash fades out
    Animated.timing(appFadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      setShowSplash(false);
    });
  };

  return (
    <View style={styles.root}>
      {/* Main app content */}
      <Animated.View style={[styles.appContainer, { opacity: appFadeAnim }]}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="settings"
            options={{
              headerShown: true,
              title: 'Settings',
              headerBackTitle: 'Back'
            }}
          />
        </Stack>
      </Animated.View>

      {/* Splash screen overlay */}
      {showSplash && <SplashScreen onFinish={handleSplashFinish} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  appContainer: {
    flex: 1,
  },
});
