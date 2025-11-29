import * as FileSystem from 'expo-file-system/legacy';
import { CORPUS_DIR } from '@/constants/storage';

/**
 * Corpus file management for Cactus LLM RAG
 * Each journal entry is stored as a .txt file named YYYY-MM-DD.txt
 */

/**
 * Ensure corpus directory exists
 */
export async function ensureCorpusDirectory(): Promise<void> {
  try {
    const dirInfo = await FileSystem.getInfoAsync(CORPUS_DIR);

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(CORPUS_DIR, { intermediates: true });
      console.log('Corpus directory created:', CORPUS_DIR);
    }
  } catch (error) {
    console.error('Failed to create corpus directory:', error);
    throw new Error('Corpus directory initialization failed');
  }
}

/**
 * Write journal entry content to corpus file
 */
export async function writeCorpusFile(date: string, content: string): Promise<void> {
  try {
    await ensureCorpusDirectory();

    const filePath = `${CORPUS_DIR}${date}.txt`;
    await FileSystem.writeAsStringAsync(filePath, content, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    console.log('Corpus file written:', filePath);
  } catch (error) {
    console.error('Failed to write corpus file:', error);
    throw new Error(`Failed to write corpus file for date: ${date}`);
  }
}

/**
 * Read corpus file content
 */
export async function readCorpusFile(date: string): Promise<string | null> {
  try {
    const filePath = `${CORPUS_DIR}${date}.txt`;
    const fileInfo = await FileSystem.getInfoAsync(filePath);

    if (!fileInfo.exists) {
      return null;
    }

    const content = await FileSystem.readAsStringAsync(filePath, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    return content;
  } catch (error) {
    console.error('Failed to read corpus file:', error);
    return null;
  }
}

/**
 * Delete corpus file
 */
export async function deleteCorpusFile(date: string): Promise<void> {
  try {
    const filePath = `${CORPUS_DIR}${date}.txt`;
    const fileInfo = await FileSystem.getInfoAsync(filePath);

    if (fileInfo.exists) {
      await FileSystem.deleteAsync(filePath);
      console.log('Corpus file deleted:', filePath);
    }
  } catch (error) {
    console.error('Failed to delete corpus file:', error);
    // Don't throw - file might not exist
  }
}

/**
 * Get all corpus files
 */
export async function getAllCorpusFiles(): Promise<string[]> {
  try {
    await ensureCorpusDirectory();
    const files = await FileSystem.readDirectoryAsync(CORPUS_DIR);
    return files.filter((file) => file.endsWith('.txt'));
  } catch (error) {
    console.error('Failed to read corpus directory:', error);
    return [];
  }
}

/**
 * Clear all corpus files (for development/testing)
 */
export async function clearCorpusDirectory(): Promise<void> {
  try {
    const files = await getAllCorpusFiles();

    for (const file of files) {
      await FileSystem.deleteAsync(`${CORPUS_DIR}${file}`);
    }

    console.log('Corpus directory cleared');
  } catch (error) {
    console.error('Failed to clear corpus directory:', error);
    throw error;
  }
}
