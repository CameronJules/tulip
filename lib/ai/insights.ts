import { getLastNDaysEntries } from '@/lib/models/journal-entry';
import { getCache, saveCache } from '@/lib/storage/async-storage';
import { INSIGHT_PROMPTS } from './prompts';
import ModelManager from './model-manager';
import { AI_CONFIG, AI_ERROR_MESSAGES, INSIGHT_TYPE_TO_CACHE_KEY, type InsightType } from '@/constants/ai';
import type { InsightCacheData } from '@/lib/models/types';
import { format } from 'date-fns';

async function getCachedInsight(type: InsightType): Promise<InsightCacheData | null> {
  const cacheKey = INSIGHT_TYPE_TO_CACHE_KEY[type];
  const cache = await getCache<InsightCacheData>(cacheKey);
  return cache?.data || null;
}

export async function generateInsight(
  type: InsightType,
  onToken?: (token: string) => void
): Promise<InsightCacheData> {
  // 1. Check cache first
  const cached = await getCachedInsight(type);
  if (cached) {
    // Return cached result immediately (call onToken with full text if needed)
    if (onToken) {
      onToken(cached.content);
    }
    return cached;
  }

  // 2. Get last 5 days of entries
  const entries = await getLastNDaysEntries(5);

  if (entries.length === 0) {
    throw new Error(AI_ERROR_MESSAGES.NO_ENTRIES);
  }

  try {
    // 3. Get or create Cactus instance
    const cactusLM = await ModelManager.getInstance().getOrCreateInstance();

    // 4. Generate with streaming
    const prompt = INSIGHT_PROMPTS[type];
    const result = await cactusLM.complete({
      messages: [
        { role: 'system', content: prompt.systemMessage },
        { role: 'user', content: prompt.userPrompt(entries.length) }
      ],
      onToken,
      options: {
        temperature: AI_CONFIG.TEMPERATURE,
        maxTokens: AI_CONFIG.MAX_TOKENS,
      }
    });

    // 5. Cache the result
    const cacheData: InsightCacheData = {
      timestamp: new Date().toISOString(),
      insightType: type,
      entryCount: entries.length,
      content: result.response,
      lastEntryDate: entries[0]?.date || format(new Date(), 'yyyy-MM-dd'),
    };

    await saveCache(INSIGHT_TYPE_TO_CACHE_KEY[type], cacheData);

    return cacheData;

  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not initialized')) {
        throw new Error(AI_ERROR_MESSAGES.MODEL_NOT_READY);
      }
      throw new Error(`${AI_ERROR_MESSAGES.GENERATION_FAILED}: ${error.message}`);
    }
    throw error;
  }
}
