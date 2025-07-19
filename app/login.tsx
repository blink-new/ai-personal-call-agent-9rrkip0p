import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Phone, Shield, Clock, Zap, Users, Lock } from 'lucide-react-native';
import { router } from 'expo-router';
import { blink } from '@/lib/blink';

export default function LoginScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      // Trigger Google Sign-In through Blink
      await blink.auth.login();
      // Navigation will be handled by the auth state change in index.tsx
    } catch (error) {
      console.error('Sign-in error:', error);
      Alert.alert('Sign-In Error', 'Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Phone,
      title: 'Smart Call Handling',
      description: 'AI makes calls on your behalf with natural conversation',
      color: '#007AFF',
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'No more waiting on hold or repeating information',
      color: '#34C759',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get real-time updates and call outcomes',
      color: '#FF9500',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your personal information is encrypted and protected',
      color: '#5856D6',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <LinearGradient
        colors={['#007AFF', '#5856D6']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View style={styles.header} entering={FadeInUp.duration(800)}>
            <View style={styles.logoContainer}>
              <Phone size={48} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>AI Personal Assistant</Text>
            <Text style={styles.subtitle}>
              Your intelligent call agent that handles appointments, orders, and more
            </Text>
          </Animated.View>

          {/* Features */}
          <Animated.View style={styles.featuresContainer} entering={FadeInDown.duration(600).delay(200)}>
            {features.map((feature, index) => (
              <Animated.View
                key={index}
                style={styles.featureCard}
                entering={FadeInDown.duration(400).delay(400 + index * 100)}
              >
                <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
                  <feature.icon size={24} color={feature.color} />
                </View>
                <View style={styles.featureContent}>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </View>
              </Animated.View>
            ))}
          </Animated.View>

          {/* Sign In Button */}
          <Animated.View style={styles.authContainer} entering={FadeInDown.duration(600).delay(800)}>
            <TouchableOpacity
              style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#007AFF" size="small" />
              ) : (
                <>
                  <Users size={20} color="#007AFF" />
                  <Text style={styles.signInButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Trust Indicators */}
            <View style={styles.trustIndicators}>
              <View style={styles.trustItem}>
                <Lock size={16} color="#FFFFFF80" />
                <Text style={styles.trustText}>SSL Encrypted</Text>
              </View>
              <View style={styles.trustItem}>
                <Shield size={16} color="#FFFFFF80" />
                <Text style={styles.trustText}>GDPR Compliant</Text>
              </View>
            </View>

            <Text style={styles.disclaimer}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    backdropFilter: 'blur(10px)',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 20,
  },
  authContainer: {
    alignItems: 'center',
  },
  signInButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    width: '100%',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 12,
  },
  trustIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 24,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trustText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginLeft: 6,
  },
  disclaimer: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
    lineHeight: 16,
  },
});