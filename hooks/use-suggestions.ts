import { useState, useCallback, useRef } from 'react';
import { generateSuggestions } from '@/lib/ai/suggestions';
import ModelManager from '@/lib/ai/model-manager';
import type { SuggestionsData } from '@/lib/models/types';
import { ThinkTagFilter } from '@/lib/utils/token-filter';

export function useSuggestions() {
  const [suggestions, setSuggestions] = useState<SuggestionsData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDownloadingModel, setIsDownloadingModel] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const filterRef = useRef<ThinkTagFilter>(new ThinkTagFilter());

  const generate = useCallback(async () => {
    try {
      setError(null);
      setSuggestions(null);
      setStreamingText('');
      setIsAnalyzing(true);

      // Reset filter for new generation
      filterRef.current.reset();

      // Check if model is downloaded
      const isDownloaded = await ModelManager.getInstance().checkIfDownloaded();

      if (!isDownloaded) {
        setIsDownloadingModel(true);
        await ModelManager.getInstance().downloadModel((progress) => {
          setDownloadProgress(progress);
        });
        setIsDownloadingModel(false);
      }

      setIsGenerating(true);

      const result = await generateSuggestions(
        (token) => {
          // Detect cached response (single large token)
          const isCachedResponse = token.length > 100;

          if (isCachedResponse) {
            // Full text filtering
            const filtered = filterRef.current.processFullText(token);
            setStreamingText(filtered);
            setIsAnalyzing(false);
          } else {
            // Stream filtering - remove think tags in real-time
            const filteredToken = filterRef.current.processToken(token);

            if (filteredToken) {
              setIsAnalyzing(false);
              setStreamingText(prev => prev + filteredToken);
            }
          }
        }
      );

      setSuggestions(result);
      setStreamingText(''); // Clear streaming text when we have final result

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsGenerating(false);
      setIsAnalyzing(false);
    }
  }, []);

  return {
    suggestions,
    isGenerating,
    isAnalyzing,
    isDownloadingModel,
    downloadProgress,
    error,
    streamingText,
    generate,
  };
}
