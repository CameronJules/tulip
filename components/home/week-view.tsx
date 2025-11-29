import { View, ScrollView, StyleSheet, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useMemo, useRef, useState, useEffect } from 'react';
import { format, subDays } from 'date-fns';

import { WeekHeader } from './week-header';
import { DayItem } from './day-item';
import { getTodayString, getWeekNumber } from '@/lib/utils/date-helpers';
import type { JournalEntry } from '@/lib/models/types';

export type WeekViewProps = {
  weekEntries: JournalEntry[];
};

export function WeekView({ weekEntries }: WeekViewProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [visibleWeekNumber, setVisibleWeekNumber] = useState<number>(0);
  const [itemHeight, setItemHeight] = useState<number>(0);

  // Generate 30 days instead of 7
  const thirtyDays = useMemo(() => {
    const days: Array<{ date: string; entry: JournalEntry | null; isToday: boolean; weekNumber: number }> = [];
    const today = new Date();
    const entriesByDate = new Map(weekEntries.map((e) => [e.date, e]));

    // Generate last 30 days (29 days ago to today)
    for (let i = 29; i >= 0; i--) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      const weekNumber = getWeekNumber(date);
      days.push({
        date,
        entry: entriesByDate.get(date) || null,
        isToday: i === 0,
        weekNumber,
      });
    }

    return days;
  }, [weekEntries]);

  // Initialize visible week to current week
  useEffect(() => {
    const today = getTodayString();
    setVisibleWeekNumber(getWeekNumber(today));
  }, []);

  // Scroll to bottom on mount (show most recent entries)
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: false });
    }, 100);
  }, []);

  // Track scroll position to update visible week
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!itemHeight) return;

    const scrollY = event.nativeEvent.contentOffset.y;
    const itemIndex = Math.floor(scrollY / itemHeight);

    // Get week number of the item at top of viewport
    if (thirtyDays[itemIndex]) {
      const newWeekNumber = thirtyDays[itemIndex].weekNumber;
      if (newWeekNumber !== visibleWeekNumber) {
        setVisibleWeekNumber(newWeekNumber);
      }
    }
  };

  // Calculate entry count for visible week
  const visibleWeekEntryCount = useMemo(() => {
    return thirtyDays.filter(
      day => day.weekNumber === visibleWeekNumber && day.entry !== null
    ).length;
  }, [thirtyDays, visibleWeekNumber]);

  return (
    <View style={styles.container}>
      <WeekHeader
        entryCount={visibleWeekEntryCount}
        weekNumber={visibleWeekNumber}
      />
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {thirtyDays.map((day, index) => (
          <DayItem
            key={day.date}
            date={day.date}
            entry={day.entry}
            isToday={day.isToday}
            onLayout={index === 0 ? (event) => {
              // Measure first item to calculate total item height (including margins)
              const height = event.nativeEvent.layout.height;
              setItemHeight(height);
            } : undefined}
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
