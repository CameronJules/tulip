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
  // Legacy insight cache keys
  INSIGHT_THEMES_CACHE: 'insight_themes_cache',
  INSIGHT_MOMENTS_CACHE: 'insight_moments_cache',
  INSIGHT_PROBLEMS_CACHE: 'insight_problems_cache',
  INSIGHT_PROGRESS_CACHE: 'insight_progress_cache',
  INSIGHT_DEPRIORITIZED_CACHE: 'insight_deprioritized_cache',
  // New monthly insight cache keys
  INSIGHT_REMEMBER_PATTERNS_CACHE: 'insight_remember_patterns_cache',
  INSIGHT_EMOTIONAL_THEMES_CACHE: 'insight_emotional_themes_cache',
  INSIGHT_UNRESOLVED_PROBLEMS_CACHE: 'insight_unresolved_problems_cache',
  INSIGHT_PROGRESS_TRENDS_CACHE: 'insight_progress_trends_cache',
  INSIGHT_LETTING_GO_CACHE: 'insight_letting_go_cache',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  THEME_PREFERENCE: 'theme_preference',
} as const;

// Database constants
export const DATABASE_VERSION = 1;
