import { useState, useEffect, useCallback } from 'react';
import { StyleSheet, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { useFocusEffect } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { ActivityGrid } from '@/components/home/activity-grid';
import { WeekView } from '@/components/home/week-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getActivityDaysForLastNDays, getLastNDaysEntries } from '@/lib/models/journal-entry';
import type { ActivityDay, JournalEntry } from '@/lib/models/types';

export default function HomeScreen() {
  const [activityDays, setActivityDays] = useState<ActivityDay[]>([]);
  const [weekEntries, setWeekEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backgroundColor = useThemeColor({}, 'background');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [activity, entries] = await Promise.all([
        getActivityDaysForLastNDays(90),
        getLastNDaysEntries(30),
      ]);

      setActivityDays(activity);
      setWeekEntries(entries);
    } catch (err) {
      console.error('Failed to load home data:', err);
      setError('Failed to load journal data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" />
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <ThemedView style={styles.centerContainer}>
          <ThemedText type="subtitle">Failed to load data</ThemedText>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <ThemedText type="link" onPress={loadData} style={styles.retryButton}>
            Retry
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <ThemedView style={styles.container}>
        <ActivityGrid activityDays={activityDays} />
        <WeekView weekEntries={weekEntries} />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    opacity: 0.6,
  },
  retryButton: {
    marginTop: 8,
  },
});
