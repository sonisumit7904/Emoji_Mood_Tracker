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
  intensity?: number; // Added for mood intensity
  photoUrl?: string; // Task 3.3: Optional photo URL
}

export interface MoodEntries {
  [date: string]: { 
    mood: MoodType; 
    journal?: string; 
    tags?: string[]; 
    intensity?: number; // Added for mood intensity
    photoUrl?: string; // Task 3.3: Optional photo URL
  };
}