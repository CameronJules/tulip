import * as SQLite from 'expo-sqlite';
import { SCHEMA_STATEMENTS } from './schema';
import { DATABASE_NAME } from '@/constants/storage';

let dbInstance: SQLite.SQLiteDatabase | null = null;

/**
 * Get or create database instance
 */
export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = await SQLite.openDatabaseAsync(DATABASE_NAME);
    return dbInstance;
  } catch (error) {
    console.error('Failed to open database:', error);
    throw new Error('Database initialization failed');
  }
}

/**
 * Initialize database with schema
 */
export async function initializeDatabase(): Promise<void> {
  try {
    const db = await getDatabase();

    // Run all schema creation statements
    for (const statement of SCHEMA_STATEMENTS) {
      await db.execAsync(statement);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

/**
 * Close database connection
 */
export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    await dbInstance.closeAsync();
    dbInstance = null;
  }
}

/**
 * Reset database (for development/testing)
 */
export async function resetDatabase(): Promise<void> {
  try {
    const db = await getDatabase();

    await db.execAsync(`
      DROP TABLE IF EXISTS journal_entries;
      DROP TABLE IF EXISTS app_settings;
      DROP INDEX IF EXISTS idx_journal_date;
    `);

    await initializeDatabase();
    console.log('Database reset successfully');
  } catch (error) {
    console.error('Database reset error:', error);
    throw error;
  }
}
