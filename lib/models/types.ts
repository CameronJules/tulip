/**
 * Core data types for the Tulip journaling app
 */

export type MoodType = 'red' | 'yellow' | 'green';

export interface JournalEntry {
  id: number;
  date: string;           // YYYY-MM-DD format
  mood: MoodType | null;
  content: string;
  createdAt: string;      // ISO timestamp
  updatedAt: string;      // ISO timestamp
}

export interface JournalFormData {
  date: string;           // YYYY-MM-DD format
  mood: MoodType | null;
  content: string;
}

export interface ActivityDay {
  date: string;           // YYYY-MM-DD format
  hasEntry: boolean;
  mood: MoodType | null;
}

// Cache types
export interface CacheData<T> {
  timestamp: string;
  data: T;
}

export interface InsightsCache extends CacheData<string> {}
export interface SuggestionsCache extends CacheData<SuggestionsByCategory> {}

export interface SuggestionsByCategory {
  [category: string]: string[];
}

export interface InsightCacheData {
  timestamp: string;        // ISO timestamp of generation
  insightType: string;      // 'themes' | 'moments' | etc.
  entryCount: number;       // Number of entries analyzed
  content: string;          // Generated insight text
  lastEntryDate: string;    // Most recent entry date (YYYY-MM-DD)
}
