import { View, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';

export type InsightCardProps = {
  title: string;
  routeName: string;
};

export function InsightCard({ title, routeName }: InsightCardProps) {
  const cardBorder = useThemeColor({}, 'cardBorder');
  const backgroundColor = useThemeColor({}, 'background');

  const handlePress = () => {
    router.push(`/${routeName}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor,
          borderColor: cardBorder,
          opacity: pressed ? 0.7 : 1,
        },
      ]}>
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
        </View>

        <View style={styles.imageContainer}>
          {/* Placeholder for tulip PNG - to be provided later */}
          <View style={styles.imagePlaceholder} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  imageContainer: {
    width: 60,
    height: 60,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(111, 86, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(111, 86, 255, 0.3)',
    borderStyle: 'dashed',
  },
});
