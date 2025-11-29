import { useState, useCallback, useRef } from 'react';
import { generateInsight } from '@/lib/ai/insights';
import ModelManager from '@/lib/ai/model-manager';
import type { InsightType } from '@/constants/ai';
import { ThinkTagFilter } from '@/lib/utils/token-filter';

export function useInsights(type: InsightType) {
  const [insight, setInsight] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDownloadingModel, setIsDownloadingModel] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [entryCount, setEntryCount] = useState(0);
  const filterRef = useRef<ThinkTagFilter>(new ThinkTagFilter());

  const generate = useCallback(async () => {
    try {
      setError(null);
      setInsight('');
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

      const result = await generateInsight(
        type,
        (token) => {
          // Detect cached response (single large token)
          const isCachedResponse = token.length > 100;

          if (isCachedResponse) {
            // Full text filtering
            const filtered = filterRef.current.processFullText(token);
            setInsight(filtered);
            setIsAnalyzing(false);
          } else {
            // Stream filtering
            const filteredToken = filterRef.current.processToken(token);

            if (filteredToken) {
              setIsAnalyzing(false);
              setInsight(prev => prev + filteredToken);
            }
          }
        }
      );

      setEntryCount(result.entryCount);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsGenerating(false);
      setIsAnalyzing(false);
    }
  }, [type]);

  return {
    insight,
    isGenerating,
    isAnalyzing,
    isDownloadingModel,
    downloadProgress,
    error,
    entryCount,
    generate,
  };
}
