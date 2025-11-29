import { View, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedTextInput } from './themed-text-input';

export type JournalFormProps = {
  rememberText: string;
  momentsText: string;
  understandingText: string;
  winsText: string;
  dropText: string;
  intentionsText: string;
  onRememberChange: (text: string) => void;
  onMomentsChange: (text: string) => void;
  onUnderstandingChange: (text: string) => void;
  onWinsChange: (text: string) => void;
  onDropChange: (text: string) => void;
  onIntentionsChange: (text: string) => void;
  isReadOnly: boolean;
};

export function JournalForm({
  rememberText,
  momentsText,
  understandingText,
  winsText,
  dropText,
  intentionsText,
  onRememberChange,
  onMomentsChange,
  onUnderstandingChange,
  onWinsChange,
  onDropChange,
  onIntentionsChange,
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
          multiline
          textAlignVertical="top"
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

      <View style={styles.fieldContainer}>
        <ThemedText style={styles.label}>What I'm trying to understand or solve</ThemedText>
        <ThemedTextInput
          value={understandingText}
          onChangeText={onUnderstandingChange}
          editable={!isReadOnly}
          placeholder="Questions, problems, or challenges..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={[styles.input, styles.multilineInput]}
        />
      </View>

      <View style={styles.fieldContainer}>
        <ThemedText style={styles.label}>What went well today (small wins)</ThemedText>
        <ThemedTextInput
          value={winsText}
          onChangeText={onWinsChange}
          editable={!isReadOnly}
          placeholder="Celebrate your wins..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={[styles.input, styles.multilineInput]}
        />
      </View>

      <View style={styles.fieldContainer}>
        <ThemedText style={styles.label}>What wasn't important and can be dropped</ThemedText>
        <ThemedTextInput
          value={dropText}
          onChangeText={onDropChange}
          editable={!isReadOnly}
          placeholder="What can you let go of..."
          multiline
          textAlignVertical="top"
          style={styles.input}
        />
      </View>

      <View style={styles.fieldContainer}>
        <ThemedText style={styles.label}>Intentions for tomorrow</ThemedText>
        <ThemedTextInput
          value={intentionsText}
          onChangeText={onIntentionsChange}
          editable={!isReadOnly}
          placeholder="What will you focus on..."
          multiline
          numberOfLines={3}
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
    height: 120,
  },
  multilineInput: {
    height: 120,
  },
});
