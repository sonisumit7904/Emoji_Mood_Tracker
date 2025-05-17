import { MoodData, MoodType } from '../types/types';

export const MOODS: MoodData[] = [
  {
    emoji: '😊',
    color: '#4ade80', // green-400
    label: 'Very Happy',
    value: 'veryhappy'
  },
  {
    emoji: '🙂',
    color: '#a3e635', // lime-400
    label: 'Happy',
    value: 'happy'
  },
  {
    emoji: '😐',
    color: '#facc15', // yellow-400
    label: 'Neutral',
    value: 'neutral'
  },
  {
    emoji: '😟',
    color: '#fb923c', // orange-400
    label: 'Sad',
    value: 'sad'
  },
  {
    emoji: '😭',
    color: '#f87171', // red-400
    label: 'Very Sad',
    value: 'verysad'
  }
];

export const getMoodData = (mood: MoodType): MoodData => {
  return MOODS.find(m => m.value === mood) || MOODS[2]; // Default to neutral if not found
};