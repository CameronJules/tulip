import { View, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';

export type WeekHeaderProps = {
  entryCount: number;
  weekNumber: number;
};

export function WeekHeader({ entryCount, weekNumber }: WeekHeaderProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.text}>
        Entries for week {weekNumber}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'left',
  },
});
