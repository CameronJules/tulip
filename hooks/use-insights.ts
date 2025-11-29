import { useState, useCallback, useEffect } from 'react';
import { generateInsight } from '@/lib/ai/insights';
import ModelManager from '@/lib/ai/model-manager';
import type { InsightType } from '@/constants/ai';

export function useInsights(type: InsightType) {
  const [insight, setInsight] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadingModel, setIsDownloadingModel] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [entryCount, setEntryCount] = useState(0);

  const generate = useCallback(async () => {
    try {
      setError(null);
      setInsight('');

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
          setInsight(prev => prev + token);
        }
      );

      setEntryCount(result.entryCount);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsGenerating(false);
    }
  }, [type]);

  return {
    insight,
    isGenerating,
    isDownloadingModel,
    downloadProgress,
    error,
    entryCount,
    generate,
  };
}
