import { View, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/themed-text';
import { MoodDot } from './mood-dot';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatDateForDisplay, formatTimeForDisplay } from '@/lib/utils/date-helpers';
import type { JournalEntry } from '@/lib/models/types';

export type DayItemProps = {
  date: string; // YYYY-MM-DD
  entry: JournalEntry | null;
  isToday: boolean;
};

export function DayItem({ date, entry, isToday }: DayItemProps) {
  const cardBorder = useThemeColor({}, 'cardBorder');
  const cardBorderDashed = useThemeColor({}, 'cardBorderDashed');
  const textColor = useThemeColor({}, 'text');

  const handlePress = () => {
    router.push(`/journal-entry?date=${date}`);
  };

  const displayDate = formatDateForDisplay(date);
  const displayTime = entry ? formatTimeForDisplay(entry.updatedAt) : null;

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
      <View
        style={[
          styles.container,
          {
            borderColor: entry ? cardBorder : cardBorderDashed,
            borderStyle: entry ? 'solid' : 'dashed',
          },
        ]}>
        <View style={styles.content}>
          <View style={styles.textContainer}>
            <ThemedText
              style={[
                styles.dateText,
                !entry && { color: textColor, opacity: 0.4 },
              ]}>
              {displayDate}
            </ThemedText>
            {displayTime && (
              <ThemedText style={styles.timeText}>{displayTime}</ThemedText>
            )}
            {!entry && (
              <ThemedText style={styles.noEntryText}>No Entry</ThemedText>
            )}
          </View>
          {entry && <MoodDot hasEntry={true} mood={entry.mood} size={16} />}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 14,
    opacity: 0.6,
    marginTop: 4,
  },
  noEntryText: {
    fontSize: 14,
    opacity: 0.4,
    marginTop: 4,
  },
});
