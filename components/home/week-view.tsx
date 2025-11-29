import { View, ScrollView, StyleSheet } from 'react-native';
import { useMemo } from 'react';
import { format, subDays } from 'date-fns';

import { WeekHeader } from './week-header';
import { DayItem } from './day-item';
import { getTodayString, isDateToday } from '@/lib/utils/date-helpers';
import type { JournalEntry } from '@/lib/models/types';

export type WeekViewProps = {
  weekEntries: JournalEntry[];
};

export function WeekView({ weekEntries }: WeekViewProps) {
  // Generate 7 day objects (including days without entries)
  const weekDays = useMemo(() => {
    const days: Array<{ date: string; entry: JournalEntry | null; isToday: boolean }> = [];
    const today = new Date();
    const entriesByDate = new Map(weekEntries.map((e) => [e.date, e]));

    // Generate last 7 days (6 days ago to today)
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      days.push({
        date,
        entry: entriesByDate.get(date) || null,
        isToday: i === 0,
      });
    }

    return days;
  }, [weekEntries]);

  const entryCount = weekEntries.length;
  const currentWeekDate = getTodayString();

  return (
    <View style={styles.container}>
      <WeekHeader entryCount={entryCount} currentWeekDate={currentWeekDate} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {weekDays.map((day) => (
          <DayItem
            key={day.date}
            date={day.date}
            entry={day.entry}
            isToday={day.isToday}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});
