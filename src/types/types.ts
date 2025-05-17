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
  journal?: string; // Optional field for journal/tags
  tags?: string[]; // Optional array of tags
}

export interface MoodEntries {
  [date: string]: { 
    mood: MoodType; 
    journal?: string; 
    tags?: string[]; // Entry can now have mood, journal, and tags
  };
}