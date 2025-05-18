export type MoodType = 'veryhappy' | 'happy' | 'neutral' | 'sad' | 'verysad';

export interface MoodData {
  emoji: string;
  color: string;
  label: string;
  value: MoodType;
}

export interface MoodEntry {
  date: string; 
  mood: MoodType;
  journal?: string; 
  tags?: string[]; 
}

export interface MoodEntries {
  [date: string]: { 
    mood: MoodType; 
    journal?: string; 
    tags?: string[]; 
  };
}