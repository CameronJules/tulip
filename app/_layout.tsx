import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { DatabaseProvider } from '@/hooks/use-database';
import ModelManager from '@/lib/ai/model-manager';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Download model in background on app launch
  useEffect(() => {
    ModelManager.getInstance().downloadModel((progress) => {
      console.log(`Model download: ${Math.round(progress * 100)}%`);
    }).catch(error => {
      console.error('Model download failed:', error);
    });
  }, []);

  return (
    <DatabaseProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen
            name="journal-entry"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: '',
            }}
          />
          <Stack.Screen
            name="insight-themes"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: '',
            }}
          />
          <Stack.Screen
            name="insight-moments"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: '',
            }}
          />
          <Stack.Screen
            name="insight-problems"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: '',
            }}
          />
          <Stack.Screen
            name="insight-progress"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: '',
            }}
          />
          <Stack.Screen
            name="insight-deprioritized"
            options={{
              presentation: 'modal',
              headerShown: true,
              title: '',
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </DatabaseProvider>
  );
}
