import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { InsightCard } from '@/components/insights/insight-card';
import { useThemeColor } from '@/hooks/use-theme-color';
import { INSIGHT_CATEGORIES } from '@/constants/insights';

export default function InsightsScreen() {
  const backgroundColor = useThemeColor({}, 'background');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor }]}>
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <ThemedView style={styles.header}>
            <ThemedText type="title">Insights</ThemedText>
            <ThemedText style={styles.subtitle}>Patterns from your last 5 days</ThemedText>
          </ThemedView>

          <ThemedView style={styles.cardsContainer}>
            {INSIGHT_CATEGORIES.map((category) => (
              <InsightCard key={category.id} title={category.title} routeName={category.routeName} />
            ))}
          </ThemedView>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 24,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.6,
    fontSize: 14,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});
