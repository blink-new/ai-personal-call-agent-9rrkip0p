import { createClient } from '@blinkdotnew/sdk';

export const blink = createClient({
  projectId: 'ai-personal-call-agent-9rrkip0p',
  authRequired: false
});

// Extend the Blink database types
declare module '@blinkdotnew/sdk' {
  interface BlinkDatabase {
    userProfiles: any;
  }
}

// Types for our app
export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  preferences: {
    pizzaPlace: string;
    doctor: string;
    preferredTime: string;
    paymentMethod: string;
  };
  emergencyContact: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CallTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  script: string;
  color: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CallRecord {
  id: string;
  templateId?: string;
  contactName: string;
  contactNumber: string;
  status: 'completed' | 'failed' | 'in_progress';
  outcome: string;
  transcript: string;
  duration: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}