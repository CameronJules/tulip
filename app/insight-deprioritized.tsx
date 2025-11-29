import { StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useInsights } from '@/hooks/use-insights';
import DeprioritizedIcon from '@/assets/images/insights/deprioritized.svg';

export default function InsightDeprioritizedScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const {
    insight,
    isGenerating,
    isAnalyzing,
    isDownloadingModel,
    downloadProgress,
    error,
    entryCount,
    generate,
  } = useInsights('deprioritized');

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Things You Deprioritized or Let Go Of',
          headerBackTitle: 'Back',
        }}
      />
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <ScrollView style={styles.scrollView}>
          <ThemedView style={styles.content}>
            {/* Insight Image */}
            <DeprioritizedIcon width={200} height={200} style={styles.insightImage} />

            {/* Download Progress */}
            {isDownloadingModel && (
              <ThemedView style={styles.downloadingContainer}>
                <ActivityIndicator size="large" />
                <ThemedText style={styles.downloadingText}>
                  Downloading AI model: {Math.round(downloadProgress * 100)}%
                </ThemedText>
              </ThemedView>
            )}

            {/* Generating State */}
            {(isAnalyzing || (isGenerating && !insight)) && !isDownloadingModel && (
              <ThemedView style={styles.generatingContainer}>
                <ActivityIndicator size="small" />
                <ThemedText style={styles.generatingText}>
                  Analyzing your entries...
                </ThemedText>
              </ThemedView>
            )}

            {/* Error State */}
            {error && (
              <ThemedView style={styles.errorContainer}>
                <ThemedText style={styles.errorText}>{error}</ThemedText>
                <ThemedText style={styles.retryButton} onPress={generate}>
                  Tap to retry
                </ThemedText>
              </ThemedView>
            )}

            {/* Insight Content */}
            {insight && (
              <>
                <ThemedText style={styles.entryCount}>
                  Based on {entryCount} {entryCount === 1 ? 'day' : 'days'} of entries
                </ThemedText>
                <ThemedText style={styles.insightText}>{insight}</ThemedText>
              </>
            )}
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  content: { flex: 1, padding: 16 },
  insightImage: { width: 200, height: 200, alignSelf: 'center', marginBottom: 24 },
  downloadingContainer: { alignItems: 'center', marginTop: 48 },
  downloadingText: { marginTop: 16, fontSize: 14, opacity: 0.7 },
  generatingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  generatingText: { marginLeft: 8, fontSize: 14, opacity: 0.7 },
  entryCount: { fontSize: 12, opacity: 0.6, marginBottom: 16, fontStyle: 'italic' },
  insightText: { fontSize: 16, lineHeight: 24 },
  errorContainer: { marginTop: 48, alignItems: 'center' },
  errorText: { color: '#FF6B6B', textAlign: 'center', marginBottom: 8 },
  retryButton: { marginTop: 16, color: '#6F56FF', textDecorationLine: 'underline' },
});
