import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { blink } from '@/lib/blink';
import LoginScreen from './login';
import OnboardingScreen from './onboarding';
import MainApp from './main-app';

export default function App() {
  const [authState, setAuthState] = useState<{
    isLoading: boolean;
    isAuthenticated: boolean;
    user: any;
    hasProfile: boolean;
  }>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    hasProfile: false,
  });

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      if (state.isLoading) {
        setAuthState(prev => ({ ...prev, isLoading: true }));
        return;
      }

      if (!state.user) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          hasProfile: false,
        });
        return;
      }

      // Check if user has completed onboarding
      try {
        const profiles = await blink.db.userProfiles.list({
          where: { userId: state.user.id },
          limit: 1,
        });

        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user: state.user,
          hasProfile: profiles.length > 0,
        });
      } catch (error) {
        console.error('Error checking user profile:', error);
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user: state.user,
          hasProfile: false,
        });
      }
    });

    return unsubscribe;
  }, []);

  if (authState.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!authState.isAuthenticated) {
    return <LoginScreen />;
  }

  if (!authState.hasProfile) {
    return <OnboardingScreen />;
  }

  return <MainApp />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
});