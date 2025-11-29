import { STORAGE_KEYS } from './storage';

export const AI_CONFIG = {
  MODEL_NAME: 'qwen3-0.6',
  CONTEXT_SIZE: 2048,
  MAX_TOKENS: 512,
  TEMPERATURE: 0.7,
} as const;

export type InsightType = 'themes' | 'moments' | 'problems' | 'progress' | 'deprioritized';

export const INSIGHT_TYPE_TO_CACHE_KEY: Record<InsightType, string> = {
  themes: STORAGE_KEYS.INSIGHT_THEMES_CACHE,
  moments: STORAGE_KEYS.INSIGHT_MOMENTS_CACHE,
  problems: STORAGE_KEYS.INSIGHT_PROBLEMS_CACHE,
  progress: STORAGE_KEYS.INSIGHT_PROGRESS_CACHE,
  deprioritized: STORAGE_KEYS.INSIGHT_DEPRIORITIZED_CACHE,
};

export const AI_ERROR_MESSAGES = {
  NO_ENTRIES: 'No journal entries found. Start journaling to receive insights!',
  MODEL_NOT_READY: 'AI model is not ready. Please wait for download to complete.',
  GENERATION_FAILED: 'Failed to generate insight. Please try again.',
} as const;
