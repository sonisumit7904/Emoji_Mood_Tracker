import { MoodEntries, MoodType } from '../types/types';

const STORAGE_KEY = 'emoji-mood-tracker';

/**
 * Save mood entries to localStorage
 */
export const saveMoodEntries = (entries: MoodEntries): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving mood entries to localStorage:', error);
  }
};

/**
 * Get mood entries from localStorage
 */
export const getMoodEntries = (): MoodEntries => {
  try {
    const entries = localStorage.getItem(STORAGE_KEY);
    return entries ? JSON.parse(entries) : {};
  } catch (error) {
    console.error('Error reading mood entries from localStorage:', error);
    return {};
  }
};

/**
 * Save a mood entry for a specific date
 */
export const saveMoodEntry = (date: string, mood: MoodType, journal?: string): void => {
  const entries = getMoodEntries();
  entries[date] = { mood, journal };
  saveMoodEntries(entries);
};

/**
 * Get a mood entry for a specific date
 */
export const getMoodEntry = (date: string): { mood: MoodType; journal?: string } | null => {
  const entries = getMoodEntries();
  return entries[date] || null;
};