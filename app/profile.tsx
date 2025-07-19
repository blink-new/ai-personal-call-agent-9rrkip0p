import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, User, Phone, MapPin, CreditCard, Save } from 'lucide-react-native';
import { router } from 'expo-router';

export default function Profile() {
  const [profile, setProfile] = useState({
    name: 'John Doe',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@email.com',
    address: '123 Main St, New York, NY 10001',
    preferences: {
      pizzaPlace: 'Tony\'s Pizza',
      doctor: 'Dr. Smith - (555) 987-6543',
      preferredTime: 'Weekday afternoons',
      paymentMethod: 'Credit Card ending in 4567',
    },
    emergencyContact: 'Jane Doe - (555) 111-2222',
  });

  const updateProfile = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const updatePreference = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value }
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInUp.duration(600)}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Profile</Text>
        <TouchableOpacity style={styles.saveButton}>
          <Save size={20} color="#007AFF" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Basic Information */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          <View style={styles.section}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={profile.name}
                onChangeText={(value) => updateProfile('name', value)}
                placeholder="Enter your full name"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={profile.phone}
                onChangeText={(value) => updateProfile('phone', value)}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                value={profile.email}
                onChangeText={(value) => updateProfile('email', value)}
                placeholder="Enter your email"
                keyboardType="email-address"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Home Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={profile.address}
                onChangeText={(value) => updateProfile('address', value)}
                placeholder="Enter your address"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </Animated.View>

        {/* Preferences */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)}>
          <Text style={styles.sectionTitle}>Call Preferences</Text>
          <View style={styles.section}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Favorite Pizza Place</Text>
              <TextInput
                style={styles.input}
                value={profile.preferences.pizzaPlace}
                onChangeText={(value) => updatePreference('pizzaPlace', value)}
                placeholder="Your go-to pizza restaurant"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Primary Doctor</Text>
              <TextInput
                style={styles.input}
                value={profile.preferences.doctor}
                onChangeText={(value) => updatePreference('doctor', value)}
                placeholder="Doctor name and phone"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Preferred Call Times</Text>
              <TextInput
                style={styles.input}
                value={profile.preferences.preferredTime}
                onChangeText={(value) => updatePreference('preferredTime', value)}
                placeholder="When you prefer calls to be made"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Payment Method</Text>
              <TextInput
                style={styles.input}
                value={profile.preferences.paymentMethod}
                onChangeText={(value) => updatePreference('paymentMethod', value)}
                placeholder="Default payment method"
              />
            </View>
          </View>
        </Animated.View>

        {/* Emergency Contact */}
        <Animated.View entering={FadeInDown.duration(400).delay(600)}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <View style={styles.section}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Emergency Contact</Text>
              <TextInput
                style={styles.input}
                value={profile.emergencyContact}
                onChangeText={(value) => updateProfile('emergencyContact', value)}
                placeholder="Name and phone number"
              />
            </View>
          </View>
        </Animated.View>

        {/* AI Instructions */}
        <Animated.View entering={FadeInDown.duration(400).delay(800)}>
          <Text style={styles.sectionTitle}>AI Instructions</Text>
          <View style={styles.section}>
            <View style={styles.instructionCard}>
              <Text style={styles.instructionTitle}>How your AI will use this information:</Text>
              <Text style={styles.instructionText}>
                • Your name and contact info for identification{'\n'}
                • Address for delivery and appointment scheduling{'\n'}
                • Preferences to make calls more natural and efficient{'\n'}
                • Emergency contact for urgent situations{'\n'}
                • Payment info for seamless transactions
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Save Button */}
        <Animated.View style={styles.saveSection} entering={FadeInDown.duration(400).delay(1000)}>
          <TouchableOpacity style={styles.saveButtonLarge}>
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  saveButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 24,
    marginBottom: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  instructionCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  saveSection: {
    marginTop: 32,
    marginBottom: 32,
  },
  saveButtonLarge: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});