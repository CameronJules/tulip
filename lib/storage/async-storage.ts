import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/storage';
import type { CacheData } from '@/lib/models/types';

/**
 * AsyncStorage wrapper with type-safe methods
 */

/**
 * Save cache data
 */
export async function saveCache<T>(key: string, data: T): Promise<void> {
  try {
    const cacheData: CacheData<T> = {
      timestamp: new Date().toISOString(),
      data,
    };

    await AsyncStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Failed to save cache:', error);
    throw error;
  }
}

/**
 * Get cache data
 */
export async function getCache<T>(key: string): Promise<CacheData<T> | null> {
  try {
    const item = await AsyncStorage.getItem(key);

    if (!item) {
      return null;
    }

    return JSON.parse(item) as CacheData<T>;
  } catch (error) {
    console.error('Failed to get cache:', error);
    return null;
  }
}

/**
 * Invalidate cache by key
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to invalidate cache:', error);
  }
}

/**
 * Invalidate all AI caches (insights and suggestions)
 */
export async function invalidateAllAICaches(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.INSIGHTS_CACHE,
      STORAGE_KEYS.SUGGESTIONS_CACHE,
    ]);

    console.log('All AI caches invalidated');
  } catch (error) {
    console.error('Failed to invalidate AI caches:', error);
  }
}

/**
 * Save app setting
 */
export async function saveSetting(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.error('Failed to save setting:', error);
    throw error;
  }
}

/**
 * Get app setting
 */
export async function getSetting(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.error('Failed to get setting:', error);
    return null;
  }
}

/**
 * Clear all AsyncStorage (for development/testing)
 */
export async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared');
  } catch (error) {
    console.error('Failed to clear AsyncStorage:', error);
    throw error;
  }
}
