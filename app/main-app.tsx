import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Phone, User, Clock, Settings, MessageCircle, Calendar } from 'lucide-react-native';
import { router } from 'expo-router';

export default function MainApp() {
  const [isCallActive, setIsCallActive] = useState(false);

  const quickActions = [
    { id: 1, title: 'Order Pizza', subtitle: 'Call your favorite restaurant', icon: Phone, color: '#FF6B6B' },
    { id: 2, title: 'Check Appointment', subtitle: 'Verify upcoming meetings', icon: Calendar, color: '#4ECDC4' },
    { id: 3, title: 'Make Reservation', subtitle: 'Book a table or service', icon: Clock, color: '#45B7D1' },
    { id: 4, title: 'Customer Service', subtitle: 'Handle support calls', icon: MessageCircle, color: '#96CEB4' },
  ];

  const recentCalls = [
    { id: 1, title: 'Pizza Palace', status: 'Completed', time: '2 hours ago', outcome: 'Order placed successfully' },
    { id: 2, title: 'Dr. Smith Office', status: 'Completed', time: '1 day ago', outcome: 'Appointment confirmed' },
    { id: 3, title: 'Hotel Booking', status: 'Failed', time: '2 days ago', outcome: 'Line was busy' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInUp.duration(600)}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Good morning!</Text>
            <Text style={styles.subtitle}>Ready to make calls for you</Text>
          </View>
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
            <User size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* AI Assistant Status */}
        <Animated.View style={styles.statusCard} entering={FadeInDown.duration(400).delay(200)}>
          <View style={styles.statusIndicator}>
            <View style={[styles.statusDot, { backgroundColor: isCallActive ? '#FF6B6B' : '#34C759' }]} />
            <Text style={styles.statusText}>
              {isCallActive ? 'Currently on call...' : 'AI Assistant Ready'}
            </Text>
          </View>
          <Text style={styles.statusSubtext}>
            {isCallActive ? 'Handling your request' : 'Tap any action below to start'}
          </Text>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.duration(400).delay(400)}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <Animated.View
                key={action.id}
                entering={FadeInDown.duration(400).delay(600 + index * 100)}
              >
                <TouchableOpacity
                  style={[styles.actionCard, { borderLeftColor: action.color }]}
                  onPress={() => {
                    setIsCallActive(true);
                    router.push('/call');
                  }}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.color + '20' }]}>
                    <action.icon size={24} color={action.color} />
                  </View>
                  <View style={styles.actionContent}>
                    <Text style={styles.actionTitle}>{action.title}</Text>
                    <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Recent Calls */}
        <Animated.View entering={FadeInDown.duration(400).delay(800)}>
          <Text style={styles.sectionTitle}>Recent Calls</Text>
          <View style={styles.callsList}>
            {recentCalls.map((call, index) => (
              <Animated.View
                key={call.id}
                style={styles.callItem}
                entering={FadeInDown.duration(400).delay(1000 + index * 100)}
              >
                <View style={styles.callInfo}>
                  <Text style={styles.callTitle}>{call.title}</Text>
                  <Text style={styles.callOutcome}>{call.outcome}</Text>
                  <Text style={styles.callTime}>{call.time}</Text>
                </View>
                <View style={[
                  styles.callStatus,
                  { backgroundColor: call.status === 'Completed' ? '#34C759' : '#FF6B6B' }
                ]}>
                  <Text style={styles.callStatusText}>{call.status}</Text>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Bottom Actions */}
        <Animated.View style={styles.bottomActions} entering={FadeInDown.duration(400).delay(1200)}>
          <TouchableOpacity style={styles.bottomButton} onPress={() => router.push('/templates')}>
            <MessageCircle size={20} color="#007AFF" />
            <Text style={styles.bottomButtonText}>Templates</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bottomButton}>
            <Clock size={20} color="#007AFF" />
            <Text style={styles.bottomButtonText}>Call History</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 2,
  },
  profileButton: {
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
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  statusSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 32,
    marginBottom: 16,
  },
  actionsGrid: {
    gap: 12,
  },
  actionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  callsList: {
    gap: 12,
  },
  callItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  callInfo: {
    flex: 1,
  },
  callTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  callOutcome: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  callTime: {
    fontSize: 12,
    color: '#C7C7CC',
  },
  callStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  callStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 32,
    marginBottom: 32,
  },
  bottomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bottomButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 8,
  },
});