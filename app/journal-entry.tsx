import { useState, useEffect } from 'react';
import { StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';

import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { JournalForm } from '@/components/journal/journal-form';
import { MoodSelectorModal } from '@/components/journal/mood-selector-modal';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  getTodayString,
  formatDateForDisplay,
  isDatePast,
  formatContent,
  extractRememberText,
  extractMomentsText,
} from '@/lib/utils/date-helpers';
import {
  getJournalEntry,
  createJournalEntry,
  updateJournalEntry,
} from '@/lib/models/journal-entry';
import type { JournalEntry, MoodType } from '@/lib/models/types';

export default function JournalEntryScreen() {
  const params = useLocalSearchParams();
  const dateParam = params.date as string;

  const [entryDate, setEntryDate] = useState(dateParam || getTodayString());
  const [rememberText, setRememberText] = useState('');
  const [momentsText, setMomentsText] = useState('');
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [existingEntry, setExistingEntry] = useState<JournalEntry | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  // Load existing entry on mount
  useEffect(() => {
    async function loadEntry() {
      setIsLoading(true);
      const date = dateParam || getTodayString();
      setEntryDate(date);
      setIsReadOnly(isDatePast(date));

      try {
        const entry = await getJournalEntry(date);
        if (entry) {
          setExistingEntry(entry);
          setRememberText(extractRememberText(entry.content));
          setMomentsText(extractMomentsText(entry.content));
        }
      } catch (err) {
        console.error('Failed to load entry:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadEntry();
  }, [dateParam]);

  function validateForm(): string | null {
    if (!rememberText.trim() && !momentsText.trim()) {
      return 'Please enter at least one field before saving';
    }
    return null;
  }

  function handleSavePress() {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    // Show mood selector modal
    setShowMoodModal(true);
  }

  async function handleMoodSelect(mood: MoodType) {
    setShowMoodModal(false);
    setIsSaving(true);

    try {
      const content = formatContent(rememberText, momentsText);
      const formData = {
        date: entryDate,
        mood,
        content,
      };

      if (existingEntry) {
        await updateJournalEntry(entryDate, formData);
      } else {
        await createJournalEntry(formData);
      }

      router.back();
    } catch (err) {
      console.error('Failed to save entry:', err);
      alert('Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  }

  function handleMoodCancel() {
    setShowMoodModal(false);
  }

  const displayDate = formatDateForDisplay(entryDate);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" />
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: displayDate,
          headerBackTitle: 'Back',
        }}
      />
      <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <ThemedView style={styles.content}>
            <JournalForm
              rememberText={rememberText}
              momentsText={momentsText}
              onRememberChange={setRememberText}
              onMomentsChange={setMomentsText}
              isReadOnly={isReadOnly}
            />

            {!isReadOnly && (
              <Pressable
                onPress={handleSavePress}
                disabled={isSaving}
                style={({ pressed }) => [
                  styles.saveButton,
                  pressed && styles.saveButtonPressed,
                  isSaving && styles.saveButtonDisabled,
                ]}>
                <ThemedText style={styles.saveButtonText}>
                  {isSaving ? 'Saving...' : 'Save Journal Entry'}
                </ThemedText>
              </Pressable>
            )}
          </ThemedView>
        </ScrollView>

        <MoodSelectorModal
          visible={showMoodModal}
          onSelect={handleMoodSelect}
          onCancel={handleMoodCancel}
        />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
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
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  saveButton: {
    backgroundColor: '#000',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonPressed: {
    opacity: 0.8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
