import { format, subDays } from 'date-fns';
import { getDatabase } from '../database/db';
import { writeCorpusFile, deleteCorpusFile } from '../storage/corpus';
import { invalidateAllAICaches } from '../storage/async-storage';
import type { JournalEntry, JournalFormData, ActivityDay } from './types';

/**
 * CRUD operations for journal entries
 */

/**
 * Create a new journal entry
 */
export async function createJournalEntry(data: JournalFormData): Promise<JournalEntry> {
  try {
    const db = await getDatabase();
    const now = new Date().toISOString();

    // Insert into database
    const result = await db.runAsync(
      `INSERT INTO journal_entries (date, mood, content, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?)`,
      [data.date, data.mood, data.content, now, now]
    );

    // Write to corpus file
    await writeCorpusFile(data.date, data.content);

    // Invalidate AI caches
    await invalidateAllAICaches();

    // Return the created entry
    return {
      id: result.lastInsertRowId,
      date: data.date,
      mood: data.mood,
      content: data.content,
      createdAt: now,
      updatedAt: now,
    };
  } catch (error) {
    console.error('Failed to create journal entry:', error);
    throw new Error('Failed to create journal entry');
  }
}

/**
 * Update an existing journal entry
 */
export async function updateJournalEntry(
  date: string,
  data: Partial<JournalFormData>
): Promise<JournalEntry> {
  try {
    const db = await getDatabase();
    const now = new Date().toISOString();

    // Get existing entry
    const existing = await getJournalEntry(date);
    if (!existing) {
      throw new Error(`Journal entry not found for date: ${date}`);
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: (string | null)[] = [];

    if (data.mood !== undefined) {
      updates.push('mood = ?');
      values.push(data.mood);
    }

    if (data.content !== undefined) {
      updates.push('content = ?');
      values.push(data.content);
    }

    updates.push('updated_at = ?');
    values.push(now);

    // Add date for WHERE clause
    values.push(date);

    await db.runAsync(
      `UPDATE journal_entries SET ${updates.join(', ')} WHERE date = ?`,
      values
    );

    // Update corpus file if content changed
    if (data.content !== undefined) {
      await writeCorpusFile(date, data.content);
    }

    // Invalidate AI caches
    await invalidateAllAICaches();

    // Return updated entry
    return {
      ...existing,
      mood: data.mood !== undefined ? data.mood : existing.mood,
      content: data.content !== undefined ? data.content : existing.content,
      updatedAt: now,
    };
  } catch (error) {
    console.error('Failed to update journal entry:', error);
    throw error;
  }
}

/**
 * Get a single journal entry by date
 */
export async function getJournalEntry(date: string): Promise<JournalEntry | null> {
  try {
    const db = await getDatabase();

    const result = await db.getFirstAsync<JournalEntry>(
      `SELECT id, date, mood, content, created_at as createdAt, updated_at as updatedAt
       FROM journal_entries
       WHERE date = ?`,
      [date]
    );

    return result || null;
  } catch (error) {
    console.error('Failed to get journal entry:', error);
    return null;
  }
}

/**
 * Get journal entries for a date range
 */
export async function getJournalEntriesByDateRange(
  startDate: string,
  endDate: string
): Promise<JournalEntry[]> {
  try {
    const db = await getDatabase();

    const results = await db.getAllAsync<JournalEntry>(
      `SELECT id, date, mood, content, created_at as createdAt, updated_at as updatedAt
       FROM journal_entries
       WHERE date >= ? AND date <= ?
       ORDER BY date DESC`,
      [startDate, endDate]
    );

    return results;
  } catch (error) {
    console.error('Failed to get journal entries by date range:', error);
    return [];
  }
}

/**
 * Get last N days of journal entries
 */
export async function getLastNDaysEntries(n: number): Promise<JournalEntry[]> {
  try {
    const db = await getDatabase();

    const results = await db.getAllAsync<JournalEntry>(
      `SELECT id, date, mood, content, created_at as createdAt, updated_at as updatedAt
       FROM journal_entries
       ORDER BY date DESC
       LIMIT ?`,
      [n]
    );

    return results;
  } catch (error) {
    console.error('Failed to get last N days entries:', error);
    return [];
  }
}

/**
 * Get all activity days (for activity tracker)
 */
export async function getAllActivityDays(limit = 30): Promise<ActivityDay[]> {
  try {
    const db = await getDatabase();

    const results = await db.getAllAsync<{
      date: string;
      mood: string | null;
    }>(
      `SELECT date, mood
       FROM journal_entries
       ORDER BY date DESC
       LIMIT ?`,
      [limit]
    );

    return results.map((row) => ({
      date: row.date,
      hasEntry: true,
      mood: row.mood as ActivityDay['mood'],
    }));
  } catch (error) {
    console.error('Failed to get activity days:', error);
    return [];
  }
}

/**
 * Get activity days for last N days (includes days without entries)
 */
export async function getActivityDaysForLastNDays(n: number): Promise<ActivityDay[]> {
  try {
    const today = new Date();
    const activityDays: ActivityDay[] = [];

    // Get existing entries
    const entries = await getLastNDaysEntries(n);
    const entriesByDate = new Map(entries.map((e) => [e.date, e]));

    // Generate all dates for last N days
    for (let i = 0; i < n; i++) {
      const date = format(subDays(today, i), 'yyyy-MM-dd');
      const entry = entriesByDate.get(date);

      activityDays.push({
        date,
        hasEntry: !!entry,
        mood: entry?.mood || null,
      });
    }

    return activityDays;
  } catch (error) {
    console.error('Failed to get activity days for last N days:', error);
    return [];
  }
}

/**
 * Delete a journal entry
 */
export async function deleteJournalEntry(date: string): Promise<void> {
  try {
    const db = await getDatabase();

    // Delete from database
    await db.runAsync(`DELETE FROM journal_entries WHERE date = ?`, [date]);

    // Delete corpus file
    await deleteCorpusFile(date);

    // Invalidate AI caches
    await invalidateAllAICaches();

    console.log('Journal entry deleted:', date);
  } catch (error) {
    console.error('Failed to delete journal entry:', error);
    throw new Error('Failed to delete journal entry');
  }
}

/**
 * Get total count of journal entries
 */
export async function getJournalEntryCount(): Promise<number> {
  try {
    const db = await getDatabase();

    const result = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM journal_entries`
    );

    return result?.count || 0;
  } catch (error) {
    console.error('Failed to get journal entry count:', error);
    return 0;
  }
}
