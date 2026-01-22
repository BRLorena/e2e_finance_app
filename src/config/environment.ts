/**
 * Environment configuration
 * Centralized handling of environment variables
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const env = {
  // Groq API Configuration
  groqApiKey: process.env.GROQ_API_KEY || '',
  
  // HAR Analysis Configuration
  harAnalysisEnabled: process.env.HAR_ANALYSIS_ENABLED === 'true' || true,
  harResponseTimeThreshold: parseInt(process.env.HAR_RESPONSE_TIME_THRESHOLD || '2000'),
  harPayloadSizeThreshold: parseInt(process.env.HAR_PAYLOAD_SIZE_THRESHOLD || '1000000'),
  harAiEnabled: process.env.HAR_AI_ENABLED === 'true' || true,
  harAiModel: process.env.HAR_AI_MODEL || 'llama-3.3-70b-versatile',
  harAiLanguage: process.env.HAR_AI_LANGUAGE || 'id',
  
  // Application Configuration
  baseUrl: process.env.BASE_URL || 'https://finance-app-five-rosy.vercel.app',
  
  // CI/CD Configuration
  isCI: !!process.env.CI,
  nodeVersion: process.version
} as const;

// Validation: throw error if critical env vars are missing
export function validateEnv() {
  if (!env.groqApiKey && env.harAiEnabled) {
    console.warn('GROQ_API_KEY is not set. AI features will be disabled.');
  }
}

export type EnvironmentConfig = typeof env;
