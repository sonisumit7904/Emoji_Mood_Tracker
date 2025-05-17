export type MoodType = 'veryhappy' | 'happy' | 'neutral' | 'sad' | 'verysad';

export interface MoodData {
  emoji: string;
  color: string;
  label: string;
  value: MoodType;
}

export interface MoodEntry {
  date: string; // ISO format date string (YYYY-MM-DD)
  mood: MoodType;
}

export interface MoodEntries {
  [date: string]: MoodType; // Using date string as key
}