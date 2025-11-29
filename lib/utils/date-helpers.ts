/**
 * Date utility functions for the Tulip journaling app
 * Handles date formatting, comparison, and display logic
 */

import { format, isToday, isPast, parseISO, subDays } from 'date-fns';

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Check if a date string (YYYY-MM-DD) is today
 */
export function isDateToday(dateString: string): boolean {
  return isToday(parseISO(dateString));
}

/**
 * Check if a date string is in the past (excluding today)
 */
export function isDatePast(dateString: string): boolean {
  const date = parseISO(dateString);
  return isPast(date) && !isToday(date);
}

/**
 * Format date for display: "Monday, 24th November 2025"
 */
export function formatDateForDisplay(dateString: string): string {
  const date = parseISO(dateString);
  const dayName = format(date, 'EEEE');
  const day = format(date, 'd');
  const month = format(date, 'MMMM');
  const year = format(date, 'yyyy');

  return `${dayName}, ${getOrdinal(parseInt(day))} ${month} ${year}`;
}

/**
 * Format time for display: "10:30pm"
 */
export function formatTimeForDisplay(isoTimestamp: string): string {
  const date = parseISO(isoTimestamp);
  return format(date, 'h:mma').toLowerCase();
}

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Get week number from date (ISO week)
 */
export function getWeekNumber(dateString: string): number {
  return parseInt(format(parseISO(dateString), 'I'));
}

/**
 * Format journal entry content from form fields
 */
export function formatContent(
  remember: string,
  moments: string,
  understanding: string,
  wins: string,
  drop: string,
  intentions: string
): string {
  const parts: string[] = [];

  if (remember.trim()) {
    parts.push(`REMEMBER: ${remember.trim()}`);
  }

  if (moments.trim()) {
    parts.push(`MOMENTS:\n${moments.trim()}`);
  }

  if (understanding.trim()) {
    parts.push(`UNDERSTANDING:\n${understanding.trim()}`);
  }

  if (wins.trim()) {
    parts.push(`WINS:\n${wins.trim()}`);
  }

  if (drop.trim()) {
    parts.push(`DROP: ${drop.trim()}`);
  }

  if (intentions.trim()) {
    parts.push(`INTENTIONS:\n${intentions.trim()}`);
  }

  return parts.join('\n\n');
}

/**
 * Extract "remember tomorrow" text from journal entry content
 */
export function extractRememberText(content: string): string {
  const match = content.match(/REMEMBER:\s*(.+?)(?:\n\n|$)/s);
  return match ? match[1].trim() : '';
}

/**
 * Extract "meaningful moments" text from journal entry content
 */
export function extractMomentsText(content: string): string {
  const match = content.match(/MOMENTS:\s*(.+?)(?:\n\n|$)/s);
  return match ? match[1].trim() : '';
}

/**
 * Extract "what I'm trying to understand or solve" text from journal entry content
 */
export function extractUnderstandingText(content: string): string {
  const match = content.match(/UNDERSTANDING:\s*(.+?)(?:\n\n|$)/s);
  return match ? match[1].trim() : '';
}

/**
 * Extract "what went well today (small wins)" text from journal entry content
 */
export function extractWinsText(content: string): string {
  const match = content.match(/WINS:\s*(.+?)(?:\n\n|$)/s);
  return match ? match[1].trim() : '';
}

/**
 * Extract "what wasn't important and can be dropped" text from journal entry content
 */
export function extractDropText(content: string): string {
  const match = content.match(/DROP:\s*(.+?)(?:\n\n|$)/s);
  return match ? match[1].trim() : '';
}

/**
 * Extract "intentions for tomorrow" text from journal entry content
 */
export function extractIntentionsText(content: string): string {
  const match = content.match(/INTENTIONS:\s*(.+?)$/s);
  return match ? match[1].trim() : '';
}
