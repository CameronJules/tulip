import { View, StyleSheet } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { MoodType } from '@/lib/models/types';

export type MoodDotProps = {
  hasEntry: boolean;
  mood: MoodType | null;
  size?: number;
};

export function MoodDot({ hasEntry, mood, size = 16 }: MoodDotProps) {
  const colorScheme = useColorScheme() ?? 'light';

  const getMoodColor = (): string => {
    if (!hasEntry) {
      return Colors[colorScheme].activityDotEmpty; // Gray
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
    return Colors[colorScheme].activityDot; // Blue
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
