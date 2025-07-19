import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { Phone, PhoneOff, Mic, MicOff, Volume2, ArrowLeft, Send, Bot } from 'lucide-react-native';
import { router } from 'expo-router';
import { blink } from '../lib/blink';

interface Message {
  speaker: 'AI' | 'Restaurant' | 'User';
  text: string;
  time: string;
  isStreaming?: boolean;
}

export default function Call() {
  const [isCallActive, setIsCallActive] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState('Connecting...');
  const [transcript, setTranscript] = useState<Message[]>([
    { speaker: 'AI', text: 'Hello, I\'d like to place an order for delivery please.', time: '00:05' },
    { speaker: 'Restaurant', text: 'Sure! What would you like to order today?', time: '00:08' },
    { speaker: 'AI', text: 'I\'d like one large pepperoni pizza and a Caesar salad.', time: '00:12' },
  ]);
  const [testMode, setTestMode] = useState(false);
  const [testInput, setTestInput] = useState('');
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [currentStreamingText, setCurrentStreamingText] = useState('');

  // Pulse animation for active call
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    if (isCallActive) {
      pulseScale.value = withRepeat(withTiming(1.1, { duration: 1000 }), -1, true);
      pulseOpacity.value = withRepeat(withTiming(0.7, { duration: 1000 }), -1, true);
    }
  }, [isCallActive]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (isCallActive) {
        setCallDuration(prev => prev + 1);
      }
    }, 1000);

    // Simulate call progression
    const statusTimer = setTimeout(() => {
      setCallStatus('Connected - Tony\'s Pizza');
    }, 2000);

    return () => {
      clearInterval(timer);
      clearTimeout(statusTimer);
    };
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const endCall = () => {
    setIsCallActive(false);
    router.back();
  };

  const generateAIResponse = async (userMessage: string) => {
    setIsAIResponding(true);
    setCurrentStreamingText('');
    
    const currentTime = formatDuration(callDuration);
    
    // Add user message to transcript
    const userMsg: Message = {
      speaker: 'Restaurant',
      text: userMessage,
      time: currentTime,
    };
    
    setTranscript(prev => [...prev, userMsg]);
    
    // Add streaming AI response placeholder
    const aiMsg: Message = {
      speaker: 'AI',
      text: '',
      time: currentTime,
      isStreaming: true,
    };
    
    setTranscript(prev => [...prev, aiMsg]);
    
    try {
      // Use Blink AI with streaming for real-time response
      await blink.ai.streamText(
        {
          prompt: `You are an AI assistant making a phone call on behalf of your user. You are currently talking to a restaurant to place a pizza order. 
          
          Context: You are ordering for your user who wants a large pepperoni pizza and Caesar salad for delivery.
          
          Restaurant just said: "${userMessage}"
          
          Respond naturally and conversationally as if you're on a phone call. Keep responses concise and natural.`,
          model: 'gpt-4o-mini',
          maxTokens: 150
        },
        (chunk) => {
          setCurrentStreamingText(prev => prev + chunk);
          
          // Update the streaming message in transcript
          setTranscript(prev => 
            prev.map((msg, index) => 
              index === prev.length - 1 && msg.isStreaming
                ? { ...msg, text: prev + chunk }
                : msg
            )
          );
        }
      );
      
      // Mark streaming as complete
      setTranscript(prev => 
        prev.map((msg, index) => 
          index === prev.length - 1 && msg.isStreaming
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
      
    } catch (error) {
      console.error('AI Response Error:', error);
      
      // Fallback response
      const fallbackResponse = "I understand. Could you please confirm the total and delivery time?";
      setTranscript(prev => 
        prev.map((msg, index) => 
          index === prev.length - 1 && msg.isStreaming
            ? { ...msg, text: fallbackResponse, isStreaming: false }
            : msg
        )
      );
    }
    
    setIsAIResponding(false);
    setCurrentStreamingText('');
  };

  const sendTestMessage = async () => {
    if (!testInput.trim()) return;
    
    await generateAIResponse(testInput);
    setTestInput('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInUp.duration(600)}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.callStatus}>{callStatus}</Text>
          <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.testButton, testMode && styles.testButtonActive]} 
          onPress={() => setTestMode(!testMode)}
        >
          <Bot size={20} color={testMode ? "#007AFF" : "#FFFFFF"} />
        </TouchableOpacity>
      </Animated.View>

      {/* Call Avatar */}
      <Animated.View style={styles.avatarSection} entering={FadeInDown.duration(600).delay(200)}>
        <Animated.View style={[styles.avatarContainer, animatedPulseStyle]}>
          <View style={styles.avatar}>
            <Phone size={48} color="#FFFFFF" />
          </View>
        </Animated.View>
        <Text style={styles.contactName}>Tony's Pizza</Text>
        <Text style={styles.contactNumber}>(555) 123-PIZZA</Text>
      </Animated.View>

      {/* Live Transcript */}
      <Animated.View style={styles.transcriptSection} entering={FadeInDown.duration(600).delay(400)}>
        <Text style={styles.transcriptTitle}>Live Conversation</Text>
        <ScrollView style={styles.transcriptContainer} showsVerticalScrollIndicator={false}>
          {transcript.map((message, index) => (
            <Animated.View
              key={index}
              style={[
                styles.transcriptMessage,
                message.speaker === 'AI' ? styles.aiMessage : styles.otherMessage
              ]}
              entering={FadeInDown.duration(400).delay(600 + index * 200)}
            >
              <View style={styles.messageHeader}>
                <Text style={styles.speaker}>{message.speaker}</Text>
                <Text style={styles.messageTime}>{message.time}</Text>
              </View>
              <Text style={styles.messageText}>
                {message.text}
                {message.isStreaming && (
                  <Text style={styles.cursor}>|</Text>
                )}
              </Text>
            </Animated.View>
          ))}
          
          {/* Typing indicator */}
          {isAIResponding && (
            <Animated.View style={styles.typingIndicator} entering={FadeInDown.duration(400)}>
              <Text style={styles.typingText}>AI is thinking...</Text>
              <View style={styles.typingDots}>
                <View style={[styles.dot, styles.dot1]} />
                <View style={[styles.dot, styles.dot2]} />
                <View style={[styles.dot, styles.dot3]} />
              </View>
            </Animated.View>
          )}
        </ScrollView>
        
        {/* Test Interface */}
        {testMode && (
          <Animated.View style={styles.testInterface} entering={FadeInDown.duration(400)}>
            <Text style={styles.testTitle}>🧪 AI Test Mode</Text>
            <Text style={styles.testSubtitle}>Simulate restaurant responses to test AI</Text>
            <View style={styles.testInputContainer}>
              <TextInput
                style={styles.testInput}
                value={testInput}
                onChangeText={setTestInput}
                placeholder="Type restaurant response..."
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                multiline
                maxLength={200}
              />
              <TouchableOpacity 
                style={[styles.sendButton, (!testInput.trim() || isAIResponding) && styles.sendButtonDisabled]}
                onPress={sendTestMessage}
                disabled={!testInput.trim() || isAIResponding}
              >
                <Send size={20} color={(!testInput.trim() || isAIResponding) ? "rgba(255, 255, 255, 0.3)" : "#FFFFFF"} />
              </TouchableOpacity>
            </View>
          </Animated.View>
        )}
      </Animated.View>

      {/* Call Controls */}
      <Animated.View style={styles.controlsSection} entering={FadeInDown.duration(600).delay(800)}>
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, styles.muteButton]}
            onPress={() => setIsMuted(!isMuted)}
          >
            {isMuted ? <MicOff size={24} color="#FFFFFF" /> : <Mic size={24} color="#FFFFFF" />}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton}>
            <Volume2 size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.controlButton, styles.endCallButton]}
            onPress={endCall}
          >
            <PhoneOff size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.controlsHint}>
          Your AI is handling this call automatically
        </Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    alignItems: 'center',
  },
  callStatus: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  callDuration: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  testButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  testButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  contactName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  contactNumber: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  transcriptSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  transcriptTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  transcriptContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
  },
  transcriptMessage: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
  },
  aiMessage: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    alignSelf: 'flex-end',
    maxWidth: '80%',
  },
  otherMessage: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  speaker: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  messageTime: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  messageText: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    borderRadius: 12,
    alignSelf: 'flex-end',
    maxWidth: '60%',
  },
  typingText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: 8,
  },
  typingDots: {
    flexDirection: 'row',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 1,
  },
  dot1: {
    opacity: 0.4,
  },
  dot2: {
    opacity: 0.7,
  },
  dot3: {
    opacity: 1,
  },
  controlsSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  controlButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  muteButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  endCallButton: {
    backgroundColor: '#FF3B30',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  controlsHint: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  cursor: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  testInterface: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 122, 255, 0.3)',
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  testSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 12,
  },
  testInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  testInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 14,
    maxHeight: 80,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});