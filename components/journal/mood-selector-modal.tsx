import { Modal, View, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { MoodColors } from '@/constants/theme';
import type { MoodType } from '@/lib/models/types';

export type MoodSelectorModalProps = {
  visible: boolean;
  onSelect: (mood: MoodType) => void;
  onCancel: () => void;
};

export function MoodSelectorModal({ visible, onSelect, onCancel }: MoodSelectorModalProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');

  const moods: Array<{ mood: MoodType; label: string; color: string }> = [
    { mood: 'red', label: 'Bad', color: MoodColors.red },
    { mood: 'yellow', label: 'Okay', color: MoodColors.yellow },
    { mood: 'green', label: 'Good', color: MoodColors.green },
  ];

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={[styles.modalCard, { backgroundColor }]}>
            <ThemedText style={styles.title}>How was your day?</ThemedText>

            <View style={styles.optionsRow}>
              {moods.map(({ mood, label, color }) => (
                <Pressable
                  key={mood}
                  onPress={() => onSelect(mood)}
                  style={({ pressed }) => [
                    styles.moodButton,
                    { backgroundColor: color },
                    pressed && styles.moodButtonPressed,
                  ]}>
                  <View style={styles.moodButtonContent}>
                    <ThemedText style={styles.moodLabel}>{label}</ThemedText>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 16,
  },
  moodButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  moodButtonContent: {
    alignItems: 'center',
  },
  moodLabel: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
});
