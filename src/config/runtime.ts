/**
 * Runtime configuration
 * Timeouts, retries, and other runtime settings
 */

export const runtime = {
  // Timeouts
  defaultTimeout: 30000,
  navigationTimeout: 30000,
  apiTimeout: 10000,
  
  // Retries
  maxRetries: 2,
  
  // Waits
  shortWait: 500,
  mediumWait: 1000,
  longWait: 2000,
  
  // HAR Recording
  harRecordingMode: 'full' as const,
  
  // Auth
  authStoragePath: '.auth/session.json'
} as const;

export type RuntimeConfig = typeof runtime;
