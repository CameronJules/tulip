import { View, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { getWeekNumber } from '@/lib/utils/date-helpers';

export type WeekHeaderProps = {
  entryCount: number;
  currentWeekDate: string; // YYYY-MM-DD format
};

export function WeekHeader({ entryCount, currentWeekDate }: WeekHeaderProps) {
  const weekNumber = getWeekNumber(currentWeekDate);

  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>
        {entryCount} {entryCount === 1 ? 'Entry' : 'Entries'} on week {weekNumber}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  text: {
    fontSize: 14,
    opacity: 0.6,
  },
});
