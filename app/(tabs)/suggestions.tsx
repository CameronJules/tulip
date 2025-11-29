import { StyleSheet, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useSuggestions } from '@/hooks/use-suggestions';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Fonts } from '@/constants/theme';

export default function SuggestionsScreen() {
  const {
    suggestions,
    isGenerating,
    isAnalyzing,
    isDownloadingModel,
    downloadProgress,
    error,
    generate,
  } = useSuggestions();

  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  // Generate suggestions when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (!suggestions && !isGenerating && !error) {
        generate();
      }
    }, [suggestions, isGenerating, error, generate])
  );

  const toggleItem = (id: string) => {
    setCompletedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const renderSuggestionItem = (suggestion: string, index: number, category: string) => {
    const id = `${category}-${index}`;
    const isCompleted = completedItems.has(id);

    return (
      <TouchableOpacity
        key={id}
        style={styles.suggestionItem}
        onPress={() => toggleItem(id)}
        activeOpacity={0.7}>
        <View style={[styles.checkbox, isCompleted && { backgroundColor: tintColor }]}>
          {isCompleted && (
            <ThemedText style={styles.checkmark}>✓</ThemedText>
          )}
        </View>
        <View style={styles.suggestionContent}>
          <ThemedText style={[styles.suggestionText, isCompleted && styles.completedText]}>
            {suggestion}
          </ThemedText>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSection = (title: string, items: string[], category: string) => {
    if (!items || items.length === 0) return null;

    return (
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        <View style={styles.sectionContent}>
          {items.map((item, index) => renderSuggestionItem(item, index, category))}
        </View>
      </ThemedView>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>Suggestions</ThemedText>
        {suggestions && (
          <ThemedText style={styles.subtitle}>
            Based on {suggestions.entryCount} {suggestions.entryCount === 1 ? 'entry' : 'entries'}
          </ThemedText>
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Loading States */}
        {isDownloadingModel && (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={tintColor} />
            <ThemedText style={styles.loadingText}>
              Downloading AI model... {Math.round(downloadProgress)}%
            </ThemedText>
          </ThemedView>
        )}

        {isAnalyzing && !isDownloadingModel && (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={tintColor} />
            <ThemedText style={styles.loadingText}>
              Analyzing your entries...
            </ThemedText>
          </ThemedView>
        )}

        {isGenerating && !isAnalyzing && !isDownloadingModel && (
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={tintColor} />
            <ThemedText style={styles.loadingText}>
              Generating suggestions...
            </ThemedText>
          </ThemedView>
        )}

        {/* Error State */}
        {error && (
          <ThemedView style={styles.errorContainer}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: tintColor }]}
              onPress={generate}>
              <ThemedText style={styles.retryButtonText}>Try Again</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}

        {/* Suggestions */}
        {suggestions && !isGenerating && !error && (
          <>
            {renderSection(
              'Repeated Friction Points',
              suggestions.repeatedFrictionPoints,
              'friction'
            )}
            {renderSection(
              'Highlight Momentum',
              suggestions.highlightMomentum,
              'momentum'
            )}
            {renderSection(
              'Emerging Opportunities',
              suggestions.emergingOpportunities,
              'opportunities'
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    fontFamily: Fonts.rounded,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.6,
    fontFamily: Fonts.rounded,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: Fonts.rounded,
    marginBottom: 16,
  },
  sectionContent: {
    gap: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#999999',
    marginRight: 12,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: Fonts.sans,
  },
  completedText: {
    opacity: 0.5,
    textDecorationLine: 'line-through',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    opacity: 0.7,
    fontFamily: Fonts.rounded,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    paddingHorizontal: 20,
    fontFamily: Fonts.rounded,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.rounded,
  },
});
