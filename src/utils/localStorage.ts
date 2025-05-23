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
export const saveMoodEntry = (
  date: string, 
  mood: MoodType, 
  journal?: string,
  tags?: string[],
  intensity?: number, // Added intensity
  photoUrl?: string // Task 3.3: Added photoUrl
): void => {
  const entries = getMoodEntries();
  entries[date] = { mood, journal, tags, intensity, photoUrl }; // Added intensity and photoUrl
  saveMoodEntries(entries);
};

/**
 * Get a mood entry for a specific date
 */
export const getMoodEntry = (date: string): { mood: MoodType; journal?: string; tags?: string[]; intensity?: number; photoUrl?: string } | undefined => { // Added intensity and photoUrl to return type
  const entries = getMoodEntries();
  return entries[date];
}


// Custom Tags Storage
const CUSTOM_TAGS_KEY = 'emojiMoodTrackerCustomTags';

export const saveCustomTags = (tags: { id: string, name: string }[]): void => {
  localStorage.setItem(CUSTOM_TAGS_KEY, JSON.stringify(tags));
};

export const getCustomTags = (): { id: string, name: string }[] => {
  const tagsJson = localStorage.getItem(CUSTOM_TAGS_KEY);
  return tagsJson ? JSON.parse(tagsJson) : [];
};