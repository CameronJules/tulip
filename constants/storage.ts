import * as FileSystem from 'expo-file-system/legacy';

/**
 * Storage paths and keys for the Tulip app
 */

// File system paths
export const CORPUS_DIR = `${FileSystem.documentDirectory}corpus/`;
export const DATABASE_NAME = 'tulip.db';

// AsyncStorage keys
export const STORAGE_KEYS = {
  INSIGHTS_CACHE: 'insights_cache',
  SUGGESTIONS_CACHE: 'suggestions_cache',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  THEME_PREFERENCE: 'theme_preference',
} as const;

// Database constants
export const DATABASE_VERSION = 1;
