import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { initializeDatabase } from '@/lib/database/db';
import { ensureCorpusDirectory } from '@/lib/storage/corpus';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

/**
 * Database context for managing database initialization state
 */

interface DatabaseContextType {
  isReady: boolean;
  error: string | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
  isReady: false,
  error: null,
});

export function useDatabase() {
  return useContext(DatabaseContext);
}

interface DatabaseProviderProps {
  children: React.ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function initialize() {
      try {
        console.log('Initializing database...');

        // Initialize database with schema
        await initializeDatabase();

        // Ensure corpus directory exists
        await ensureCorpusDirectory();

        console.log('Database initialization complete');
        setIsReady(true);
      } catch (err) {
        console.error('Database initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Database initialization failed');
      }
    }

    initialize();
  }, []);

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText type="title" style={styles.errorTitle}>
          Database Error
        </ThemedText>
        <ThemedText style={styles.errorText}>{error}</ThemedText>
        <ThemedText style={styles.errorHint}>
          Please restart the app. If the problem persists, try reinstalling.
        </ThemedText>
      </ThemedView>
    );
  }

  if (!isReady) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
        <ThemedText style={styles.loadingText}>Initializing Tulip...</ThemedText>
      </ThemedView>
    );
  }

  return (
    <DatabaseContext.Provider value={{ isReady, error }}>
      {children}
    </DatabaseContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorTitle: {
    marginBottom: 16,
    color: '#ff4444',
  },
  errorText: {
    marginBottom: 8,
    textAlign: 'center',
  },
  errorHint: {
    marginTop: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
});
