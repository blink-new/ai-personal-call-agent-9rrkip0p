import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { ChevronLeft, ChevronRight, User, Phone, MapPin, Settings, Check } from 'lucide-react-native';
import { router } from 'expo-router';
import { blink } from '@/lib/blink';

interface OnboardingData {
  name: string;
  emergencyContact: string;
  phone: string;
  address: string;
  pizzaPlace: string;
  doctor: string;
  preferredTime: string;
}

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    emergencyContact: '',
    phone: '',
    address: '',
    pizzaPlace: '',
    doctor: '',
    preferredTime: 'morning',
  });

  const steps = [
    {
      title: 'Personal Information',
      subtitle: 'Tell us about yourself',
      icon: User,
      fields: [
        { key: 'name', label: 'Full Name', placeholder: 'Enter your full name' },
        { key: 'emergencyContact', label: 'Emergency Contact', placeholder: 'Emergency contact name' },
      ],
    },
    {
      title: 'Contact Details',
      subtitle: 'How can we reach you?',
      icon: Phone,
      fields: [
        { key: 'phone', label: 'Phone Number', placeholder: '+1 (555) 123-4567' },
        { key: 'address', label: 'Address', placeholder: 'Your home address' },
      ],
    },
    {
      title: 'Preferences',
      subtitle: 'Customize your experience',
      icon: Settings,
      fields: [
        { key: 'pizzaPlace', label: 'Favorite Pizza Place', placeholder: 'e.g., Dominos, Pizza Hut' },
        { key: 'doctor', label: 'Doctor/Clinic', placeholder: 'Your primary doctor or clinic' },
      ],
    },
    {
      title: 'All Set!',
      subtitle: 'Your AI assistant is ready',
      icon: Check,
      fields: [],
    },
  ];

  const updateData = (key: keyof OnboardingData, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const validateStep = (step: number): boolean => {
    const currentStepData = steps[step];
    if (!currentStepData.fields.length) return true;

    return currentStepData.fields.every(field => {
      const value = data[field.key as keyof OnboardingData];
      return value && value.trim().length > 0;
    });
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      if (!validateStep(currentStep)) {
        Alert.alert('Missing Information', 'Please fill in all required fields.');
        return;
      }
      setCurrentStep(currentStep + 1);
    } else {
      await handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      const user = await blink.auth.me();
      
      await blink.db.userProfiles.create({
        name: data.name,
        phone: data.phone,
        email: user.email,
        address: data.address,
        preferences: JSON.stringify({
          pizzaPlace: data.pizzaPlace,
          doctor: data.doctor,
          preferredTime: data.preferredTime,
          paymentMethod: 'card',
        }),
        emergencyContact: data.emergencyContact,
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      router.replace('/');
    } catch (error) {
      console.error('Profile creation error:', error);
      Alert.alert('Error', 'Failed to save your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    if (currentStep === steps.length - 1) {
      return (
        <Animated.View style={styles.completionContainer} entering={FadeInRight.duration(400)}>
          <View style={styles.completionIcon}>
            <Check size={48} color="#34C759" />
          </View>
          <Text style={styles.completionTitle}>Perfect!</Text>
          <Text style={styles.completionText}>
            Your AI assistant now knows your preferences and can make calls on your behalf.
          </Text>
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Your Profile:</Text>
            <Text style={styles.summaryItem}>• Name: {data.name}</Text>
            <Text style={styles.summaryItem}>• Phone: {data.phone}</Text>
            <Text style={styles.summaryItem}>• Pizza Place: {data.pizzaPlace}</Text>
            <Text style={styles.summaryItem}>• Doctor: {data.doctor}</Text>
          </View>
        </Animated.View>
      );
    }

    return (
      <Animated.View style={styles.stepContent} entering={FadeInRight.duration(400)}>
        {step.fields.map((field, index) => (
          <View key={field.key} style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{field.label}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={field.placeholder}
              value={data[field.key as keyof OnboardingData]}
              onChangeText={(value) => updateData(field.key as keyof OnboardingData, value)}
              autoCapitalize={field.key === 'name' ? 'words' : 'none'}
              keyboardType={field.key === 'phone' ? 'phone-pad' : 'default'}
            />
          </View>
        ))}
        
        {currentStep === 2 && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Preferred Call Time</Text>
            <View style={styles.timeOptions}>
              {['morning', 'afternoon', 'evening'].map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeOption,
                    data.preferredTime === time && styles.timeOptionSelected,
                  ]}
                  onPress={() => updateData('preferredTime', time)}
                >
                  <Text
                    style={[
                      styles.timeOptionText,
                      data.preferredTime === time && styles.timeOptionTextSelected,
                    ]}
                  >
                    {time.charAt(0).toUpperCase() + time.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          disabled={currentStep === 0}
        >
          <ChevronLeft size={24} color={currentStep === 0 ? '#C7C7CC' : '#007AFF'} />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index <= currentStep && styles.progressDotActive,
              ]}
            />
          ))}
        </View>
        
        <View style={styles.stepCounter}>
          <Text style={styles.stepCounterText}>{currentStep + 1}/{steps.length}</Text>
        </View>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.stepHeader}>
          <View style={styles.stepIcon}>
            {React.createElement(steps[currentStep].icon, { size: 32, color: '#007AFF' })}
          </View>
          <Text style={styles.stepTitle}>{steps[currentStep].title}</Text>
          <Text style={styles.stepSubtitle}>{steps[currentStep].subtitle}</Text>
        </View>

        {renderStepContent()}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !validateStep(currentStep) && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={isLoading || !validateStep(currentStep)}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <>
              <Text style={styles.nextButtonText}>
                {currentStep === steps.length - 1 ? 'Get Started' : 'Continue'}
              </Text>
              {currentStep < steps.length - 1 && <ChevronRight size={20} color="#FFFFFF" />}
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E5EA',
  },
  progressDotActive: {
    backgroundColor: '#007AFF',
  },
  stepCounter: {
    width: 44,
    alignItems: 'center',
  },
  stepCounterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepHeader: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  stepIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  stepContent: {
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  timeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  timeOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    alignItems: 'center',
  },
  timeOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  timeOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  timeOptionTextSelected: {
    color: '#FFFFFF',
  },
  completionContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  completionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  completionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  completionText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  summaryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  summaryItem: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  nextButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginRight: 8,
  },
});