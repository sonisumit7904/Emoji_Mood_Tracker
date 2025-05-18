import { MoodData, MoodType } from '../types/types';

export const MOODS: MoodData[] = [
  {
    emoji: '😊',
    color: '#60a5fa',
    label: 'Very Happy',
    value: 'veryhappy'
  },
  {
    emoji: '🙂',
    color: '#34d399',
    label: 'Happy',
    value: 'happy'
  },
  {
    emoji: '😐',
    color: '#facc15',
    label: 'Neutral',
    value: 'neutral'
  },
  {
    emoji: '😟',
    color: '#fb923c',
    label: 'Sad',
    value: 'sad'
  },
  {
    emoji: '😭',
    color: '#f87171',
    label: 'Very Sad',
    value: 'verysad'
  }
];

export const getMoodData = (mood: MoodType): MoodData => {
  return MOODS.find(m => m.value === mood) || MOODS[2]; 
};

export const getMoodScore = (mood: MoodType): number => {
  switch (mood) {
    case 'veryhappy': return 5;
    case 'happy': return 4;
    case 'neutral': return 3;
    case 'sad': return 2;
    case 'verysad': return 1;
    default: return 0; 
  }
};

export const getMoodDataByScore = (score: number): MoodData | undefined => {
  switch (score) {
    case 5: return MOODS[0]; 
    case 4: return MOODS[1]; 
    case 3: return MOODS[2]; 
    case 2: return MOODS[3]; 
    case 1: return MOODS[4]; 
    default: return undefined;
  }
};