import { MoodData, MoodType } from '../types/types';

export const MOODS: MoodData[] = [
  {
    emoji: '😊',
    color: '#60A5FA', // Updated to match tailwind config
    label: 'Very Happy',
    value: 'veryhappy'
  },
  {
    emoji: '🙂',
    color: '#34D399', // Updated to match tailwind config
    label: 'Happy',
    value: 'happy'
  },
  {
    emoji: '😐',
    color: '#FACC15', // Updated to match tailwind config
    label: 'Neutral',
    value: 'neutral'
  },
  {
    emoji: '😟',
    color: '#FB923C', // Updated to match tailwind config
    label: 'Sad',
    value: 'sad'
  },
  {
    emoji: '😭',
    color: '#F87171', // Updated to match tailwind config
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