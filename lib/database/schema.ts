/**
 * Database schema definitions for Tulip app
 */

export const JOURNAL_ENTRIES_TABLE = `
  CREATE TABLE IF NOT EXISTS journal_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    mood TEXT CHECK(mood IN ('red', 'yellow', 'green')),
    content TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;

export const JOURNAL_ENTRIES_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_journal_date
  ON journal_entries(date DESC);
`;

export const APP_SETTINGS_TABLE = `
  CREATE TABLE IF NOT EXISTS app_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;

/**
 * All schema creation statements
 */
export const SCHEMA_STATEMENTS = [
  JOURNAL_ENTRIES_TABLE,
  JOURNAL_ENTRIES_INDEX,
  APP_SETTINGS_TABLE,
];
