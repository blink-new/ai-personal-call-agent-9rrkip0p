import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, Plus, Edit3, Trash2, Phone, MessageCircle, Calendar, ShoppingBag, Stethoscope } from 'lucide-react-native';
import { router } from 'expo-router';

interface Template {
  id: number;
  title: string;
  category: string;
  description: string;
  script: string;
  icon: any;
  color: string;
}

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 1,
      title: 'Pizza Order',
      category: 'Food',
      description: 'Order pizza with your preferences',
      script: 'Hi, I\'d like to place an order for delivery. I\'ll have one large pepperoni pizza and a Caesar salad. My address is [ADDRESS] and phone number is [PHONE].',
      icon: ShoppingBag,
      color: '#FF6B6B'
    },
    {
      id: 2,
      title: 'Doctor Appointment',
      category: 'Healthcare',
      description: 'Check or schedule medical appointments',
      script: 'Hello, I\'m calling to check on my upcoming appointment with Dr. [DOCTOR_NAME]. My name is [NAME] and my date of birth is [DOB].',
      icon: Stethoscope,
      color: '#4ECDC4'
    },
    {
      id: 3,
      title: 'Restaurant Reservation',
      category: 'Dining',
      description: 'Make restaurant reservations',
      script: 'Hi, I\'d like to make a reservation for [PARTY_SIZE] people for [DATE] at [TIME]. My name is [NAME] and my phone number is [PHONE].',
      icon: Calendar,
      color: '#45B7D1'
    },
    {
      id: 4,
      title: 'Customer Service',
      category: 'Support',
      description: 'Handle customer service inquiries',
      script: 'Hello, I\'m calling regarding my account. My name is [NAME] and my account number is [ACCOUNT_NUMBER]. I need help with [ISSUE_DESCRIPTION].',
      icon: MessageCircle,
      color: '#96CEB4'
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    title: '',
    category: '',
    description: '',
    script: '',
  });

  const openEditModal = (template?: Template) => {
    if (template) {
      setEditingTemplate(template);
      setNewTemplate({
        title: template.title,
        category: template.category,
        description: template.description,
        script: template.script,
      });
    } else {
      setEditingTemplate(null);
      setNewTemplate({
        title: '',
        category: '',
        description: '',
        script: '',
      });
    }
    setShowModal(true);
  };

  const saveTemplate = () => {
    if (editingTemplate) {
      // Update existing template
      setTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, ...newTemplate }
          : t
      ));
    } else {
      // Create new template
      const newId = Math.max(...templates.map(t => t.id)) + 1;
      setTemplates(prev => [...prev, {
        id: newId,
        ...newTemplate,
        icon: MessageCircle,
        color: '#007AFF'
      }]);
    }
    setShowModal(false);
  };

  const deleteTemplate = (id: number) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const useTemplate = (template: Template) => {
    // Navigate to call screen with template
    router.push('/call');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <Animated.View style={styles.header} entering={FadeInUp.duration(600)}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Call Templates</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openEditModal()}>
          <Plus size={20} color="#007AFF" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Templates List */}
        <Animated.View entering={FadeInDown.duration(400).delay(200)}>
          <Text style={styles.sectionTitle}>Your Templates</Text>
          <View style={styles.templatesList}>
            {templates.map((template, index) => (
              <Animated.View
                key={template.id}
                entering={FadeInDown.duration(400).delay(400 + index * 100)}
              >
                <View style={[styles.templateCard, { borderLeftColor: template.color }]}>
                  <View style={styles.templateHeader}>
                    <View style={styles.templateInfo}>
                      <View style={[styles.templateIcon, { backgroundColor: template.color + '20' }]}>
                        <template.icon size={20} color={template.color} />
                      </View>
                      <View style={styles.templateDetails}>
                        <Text style={styles.templateTitle}>{template.title}</Text>
                        <Text style={styles.templateCategory}>{template.category}</Text>
                        <Text style={styles.templateDescription}>{template.description}</Text>
                      </View>
                    </View>
                    <View style={styles.templateActions}>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => openEditModal(template)}
                      >
                        <Edit3 size={16} color="#8E8E93" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => deleteTemplate(template.id)}
                      >
                        <Trash2 size={16} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.templateScript}>
                    <Text style={styles.scriptLabel}>Script Preview:</Text>
                    <Text style={styles.scriptText} numberOfLines={2}>
                      {template.script}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={[styles.useButton, { backgroundColor: template.color }]}
                    onPress={() => useTemplate(template)}
                  >
                    <Phone size={16} color="#FFFFFF" />
                    <Text style={styles.useButtonText}>Use Template</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Template Variables Guide */}
        <Animated.View entering={FadeInDown.duration(400).delay(800)}>
          <Text style={styles.sectionTitle}>Template Variables</Text>
          <View style={styles.guideCard}>
            <Text style={styles.guideTitle}>Available Variables:</Text>
            <View style={styles.variablesList}>
              <Text style={styles.variable}>[NAME] - Your full name</Text>
              <Text style={styles.variable}>[PHONE] - Your phone number</Text>
              <Text style={styles.variable}>[ADDRESS] - Your address</Text>
              <Text style={styles.variable}>[EMAIL] - Your email address</Text>
              <Text style={styles.variable}>[DATE] - Current date</Text>
              <Text style={styles.variable}>[TIME] - Current time</Text>
            </View>
            <Text style={styles.guideNote}>
              These variables will be automatically replaced with your personal information when making calls.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Edit/Create Template Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {editingTemplate ? 'Edit Template' : 'New Template'}
            </Text>
            <TouchableOpacity onPress={saveTemplate}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Template Name</Text>
              <TextInput
                style={styles.input}
                value={newTemplate.title}
                onChangeText={(text) => setNewTemplate(prev => ({ ...prev, title: text }))}
                placeholder="Enter template name"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                value={newTemplate.category}
                onChangeText={(text) => setNewTemplate(prev => ({ ...prev, category: text }))}
                placeholder="e.g., Food, Healthcare, Dining"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                value={newTemplate.description}
                onChangeText={(text) => setNewTemplate(prev => ({ ...prev, description: text }))}
                placeholder="Brief description of what this template does"
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Call Script</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={newTemplate.script}
                onChangeText={(text) => setNewTemplate(prev => ({ ...prev, script: text }))}
                placeholder="Enter the script your AI will use. Use [VARIABLES] for personal info."
                multiline
                numberOfLines={6}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  addButton: {
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
  templatesList: {
    gap: 16,
  },
  templateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  templateInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  templateIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  templateDetails: {
    flex: 1,
  },
  templateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  templateCategory: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 4,
  },
  templateDescription: {
    fontSize: 14,
    color: '#8E8E93',
  },
  templateActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateScript: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  scriptLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 4,
  },
  scriptText: {
    fontSize: 14,
    color: '#1C1C1E',
    lineHeight: 18,
  },
  useButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  useButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  guideCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
  },
  variablesList: {
    marginBottom: 16,
  },
  variable: {
    fontSize: 14,
    color: '#007AFF',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  guideNote: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  modalHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalCancel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
});