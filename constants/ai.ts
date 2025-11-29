import { STORAGE_KEYS } from './storage';

export const AI_CONFIG = {
  MODEL_NAME: 'qwen3-0.6',
  CONTEXT_SIZE: 2048,
  MAX_TOKENS: 2000, // Increased from 512 to accommodate thinking blocks + full insights
  TEMPERATURE: 0.7,
} as const;

export type InsightType =
  | 'themes' // Legacy - maps to rememberPatterns
  | 'moments' // Legacy - maps to emotionalThemes
  | 'problems' // Legacy - maps to unresolvedProblems
  | 'progress' // Legacy - maps to progressTrends
  | 'deprioritized' // Legacy - maps to lettingGo
  | 'rememberPatterns' // NEW - patterns in "What I want to remember tomorrow"
  | 'emotionalThemes' // NEW - emotional themes from "Meaningful moments"
  | 'unresolvedProblems' // NEW - unresolved questions from "What I'm trying to understand"
  | 'progressTrends' // NEW - progress trends from "What went well"
  | 'lettingGo'; // NEW - letting go patterns from "What wasn't important"

export const INSIGHT_TYPE_TO_CACHE_KEY: Record<InsightType, string> = {
  // Legacy keys (keep for backwards compatibility)
  themes: STORAGE_KEYS.INSIGHT_THEMES_CACHE,
  moments: STORAGE_KEYS.INSIGHT_MOMENTS_CACHE,
  problems: STORAGE_KEYS.INSIGHT_PROBLEMS_CACHE,
  progress: STORAGE_KEYS.INSIGHT_PROGRESS_CACHE,
  deprioritized: STORAGE_KEYS.INSIGHT_DEPRIORITIZED_CACHE,

  // New monthly insight keys
  rememberPatterns: STORAGE_KEYS.INSIGHT_REMEMBER_PATTERNS_CACHE,
  emotionalThemes: STORAGE_KEYS.INSIGHT_EMOTIONAL_THEMES_CACHE,
  unresolvedProblems: STORAGE_KEYS.INSIGHT_UNRESOLVED_PROBLEMS_CACHE,
  progressTrends: STORAGE_KEYS.INSIGHT_PROGRESS_TRENDS_CACHE,
  lettingGo: STORAGE_KEYS.INSIGHT_LETTING_GO_CACHE,
};

export const AI_ERROR_MESSAGES = {
  NO_ENTRIES: 'No journal entries found. Start journaling to receive insights!',
  MODEL_NOT_READY: 'AI model is not ready. Please wait for download to complete.',
  GENERATION_FAILED: 'Failed to generate insight. Please try again.',
} as const;
