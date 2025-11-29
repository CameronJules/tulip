import { getLastNDaysEntries } from '@/lib/models/journal-entry';
import { getCache, saveCache } from '@/lib/storage/async-storage';
import { SUGGESTIONS_PROMPT } from './suggestions-prompts';
import ModelManager from './model-manager';
import { AI_CONFIG, AI_ERROR_MESSAGES } from '@/constants/ai';
import { STORAGE_KEYS } from '@/constants/storage';
import type { SuggestionsData } from '@/lib/models/types';
import { format } from 'date-fns';

async function getCachedSuggestions(): Promise<SuggestionsData | null> {
  const cache = await getCache<SuggestionsData>(STORAGE_KEYS.SUGGESTIONS_CACHE);
  return cache?.data || null;
}

export async function generateSuggestions(
  onToken?: (token: string) => void
): Promise<SuggestionsData> {
  // 1. Check cache first
  const cached = await getCachedSuggestions();
  if (cached) {
    // Return cached result immediately
    if (onToken) {
      onToken(JSON.stringify(cached, null, 2));
    }
    return cached;
  }

  // 2. Get last 3 days of entries
  const entries = await getLastNDaysEntries(3);

  if (entries.length === 0) {
    throw new Error(AI_ERROR_MESSAGES.NO_ENTRIES);
  }

  try {
    // 3. Get or create Cactus instance
    const cactusLM = await ModelManager.getInstance().getOrCreateInstance();

    // 4. Calculate date range for RAG
    const dates = entries.map(e => e.date).sort();
    const startDate = dates[0]; // Oldest date
    const endDate = dates[dates.length - 1]; // Newest date

    // 5. Generate with streaming
    let fullResponse = '';
    const result = await cactusLM.complete({
      messages: [
        { role: 'system', content: SUGGESTIONS_PROMPT.systemMessage },
        { role: 'user', content: SUGGESTIONS_PROMPT.userPrompt(entries.length, startDate, endDate) }
      ],
      onToken: (token) => {
        fullResponse += token;
        if (onToken) {
          onToken(token);
        }
      },
      options: {
        temperature: AI_CONFIG.TEMPERATURE,
        maxTokens: AI_CONFIG.MAX_TOKENS,
      }
    });

    // 6. Parse JSON response
    let parsedSuggestions;
    try {
      // Clean the response - remove think tags, markdown code blocks, etc.
      let cleanedResponse = result.response.trim();

      // Remove <think>...</think> tags and their content
      cleanedResponse = cleanedResponse.replace(/<think>[\s\S]*?<\/think>/g, '');

      // Remove any remaining think tags
      cleanedResponse = cleanedResponse.replace(/<\/?think>/g, '');

      // Remove ```json and ``` if present
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\n/, '').replace(/\n```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\n/, '').replace(/\n```$/, '');
      }

      // Trim again after cleaning
      cleanedResponse = cleanedResponse.trim();

      parsedSuggestions = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Failed to parse suggestions JSON:', result.response);
      throw new Error('Failed to parse AI response as JSON. Please try again.');
    }

    // 7. Validate structure
    if (!parsedSuggestions.repeatedFrictionPoints ||
        !parsedSuggestions.highlightMomentum ||
        !parsedSuggestions.emergingOpportunities) {
      throw new Error('Invalid suggestions format returned by AI');
    }

    // 8. Create cache data
    const cacheData: SuggestionsData = {
      repeatedFrictionPoints: parsedSuggestions.repeatedFrictionPoints,
      highlightMomentum: parsedSuggestions.highlightMomentum,
      emergingOpportunities: parsedSuggestions.emergingOpportunities,
      timestamp: new Date().toISOString(),
      entryCount: entries.length,
      lastEntryDate: entries[0]?.date || format(new Date(), 'yyyy-MM-dd'),
    };

    await saveCache(STORAGE_KEYS.SUGGESTIONS_CACHE, cacheData);

    return cacheData;

  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not initialized')) {
        throw new Error(AI_ERROR_MESSAGES.MODEL_NOT_READY);
      }
      if (error.message.includes('parse')) {
        throw error; // Re-throw parse errors as-is
      }
      throw new Error(`${AI_ERROR_MESSAGES.GENERATION_FAILED}: ${error.message}`);
    }
    throw error;
  }
}
