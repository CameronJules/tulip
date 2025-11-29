import { View, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from './themed-text-input';

export type JournalFormProps = {
  rememberText: string;
  momentsText: string;
  onRememberChange: (text: string) => void;
  onMomentsChange: (text: string) => void;
  isReadOnly: boolean;
};

export function JournalForm({
  rememberText,
  momentsText,
  onRememberChange,
  onMomentsChange,
  isReadOnly,
}: JournalFormProps) {
  return (
    <View style={styles.container}>
      <View style={styles.fieldContainer}>
        <ThemedText style={styles.label}>What I want to remember tomorrow</ThemedText>
        <ThemedTextInput
          value={rememberText}
          onChangeText={onRememberChange}
          editable={!isReadOnly}
          placeholder="Enter what you want to remember..."
          style={styles.input}
        />
      </View>

      <View style={styles.fieldContainer}>
        <ThemedText style={styles.label}>Meaningful moments from today</ThemedText>
        <ThemedTextInput
          value={momentsText}
          onChangeText={onMomentsChange}
          editable={!isReadOnly}
          placeholder="Describe meaningful moments..."
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          style={[styles.input, styles.multilineInput]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  fieldContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 120,
  },
});
