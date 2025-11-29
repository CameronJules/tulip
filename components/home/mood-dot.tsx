import { View, StyleSheet } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { MoodType } from '@/lib/models/types';

export type MoodDotProps = {
  hasEntry: boolean;
  mood: MoodType | null;
  size?: number;
  variant?: 'activity' | 'mood';
};

export function MoodDot({ hasEntry, mood, size = 16, variant = 'mood' }: MoodDotProps) {
  const colorScheme = useColorScheme() ?? 'light';

  const getMoodColor = (): string => {
    // Activity variant: purple for active days, gray for inactive
    if (variant === 'activity') {
      return hasEntry ? '#6F56FF' : '#333333';
    }

    // Mood variant: show mood-based colors
    if (!hasEntry) {
      return Colors[colorScheme].activityDotEmpty;
    }

    if (mood === 'red') {
      return Colors[colorScheme].moodRed;
    }

    if (mood === 'yellow') {
      return Colors[colorScheme].moodYellow;
    }

    if (mood === 'green') {
      return Colors[colorScheme].moodGreen;
    }

    // Entry exists but no mood assigned yet
    return Colors[colorScheme].activityDot;
  };

  return (
    <View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getMoodColor(),
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    // Size and border radius are set dynamically via props
  },
});
