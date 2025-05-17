import React from 'react';
import { MOODS } from '../utils/moodUtils';
import { MoodType } from '../types/types';

interface EmojiSelectorProps {
  selectedMood: MoodType | null;
  onSelectMood: (mood: MoodType) => void;
}

const EmojiSelector: React.FC<EmojiSelectorProps> = ({ selectedMood, onSelectMood }) => {
  return (
    <div className="mb-8 w-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">How are you feeling?</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            onClick={() => onSelectMood(mood.value)}
            className={`
              text-4xl p-3 rounded-full transition-all duration-300 transform hover:scale-110
              ${selectedMood === mood.value ? 'bg-gray-200 scale-110 shadow-md' : 'hover:bg-gray-100'}
            `}
            title={mood.label}
            aria-label={`Select mood: ${mood.label}`}
          >
            <span className="block">{mood.emoji}</span>
            <span className="text-xs mt-1 block text-gray-600">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmojiSelector;