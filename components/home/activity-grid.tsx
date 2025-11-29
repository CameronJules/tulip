import { View, StyleSheet, useWindowDimensions } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { MoodDot } from './mood-dot';
import type { ActivityDay } from '@/lib/models/types';

export type ActivityGridProps = {
  activityDays: ActivityDay[];
};

const DOTS_PER_ROW = 18;
const TOTAL_DAYS = 90; // 5 rows of 18 (covers 3 months)
const CONTAINER_HORIZONTAL_PADDING = 16;
const CONTAINER_HORIZONTAL_MARGIN = 16;

export function ActivityGrid({ activityDays }: ActivityGridProps) {
  const { width: screenWidth } = useWindowDimensions();

  // Calculate available width for the grid
  const containerWidth = screenWidth - (CONTAINER_HORIZONTAL_MARGIN * 2) - (CONTAINER_HORIZONTAL_PADDING * 2);

  // Calculate dot size to fill the width (with small gaps)
  const DOT_GAP = 4;
  const totalGapWidth = DOT_GAP * (DOTS_PER_ROW - 1);
  const DOT_SIZE = (containerWidth - totalGapWidth) / DOTS_PER_ROW;

  // Sort by date ascending (oldest first) so newest appears in bottom-right
  const sortedDays = [...activityDays]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, TOTAL_DAYS);

  // Fill to 90 dots if we have less (5 rows of 18)
  // Fill from the END so empty dots appear at the beginning (top-left)
  const gridDays = Array(TOTAL_DAYS)
    .fill(null)
    .map((_, i) => {
      const dataIndex = i - (TOTAL_DAYS - sortedDays.length);
      if (dataIndex >= 0 && dataIndex < sortedDays.length) {
        return sortedDays[dataIndex];
      }
      return { date: '', hasEntry: false, mood: null };
    });

  return (
    <View style={styles.container}>
      <ThemedText style={styles.title}>Activity</ThemedText>
      <View style={[styles.grid, { gap: DOT_GAP }]}>
        {gridDays.map((day, index) => (
          <MoodDot key={index} hasEntry={day.hasEntry} mood={day.mood} size={DOT_SIZE} variant="activity" />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: CONTAINER_HORIZONTAL_PADDING,
    marginHorizontal: CONTAINER_HORIZONTAL_MARGIN,
    marginTop: 48,
  },
  title: {
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
