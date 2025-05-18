import React, { useState, useEffect } from 'react';
import { MOODS } from '../utils/moodUtils';
import { MoodType } from '../types/types';

interface EmojiSelectorProps {
  selectedMood: MoodType | null;
  onSelectMood: (mood: MoodType, intensity?: number) => void; // Updated to include intensity
  initialIntensity?: number; // Added for initial intensity
}

const EmojiSelector: React.FC<EmojiSelectorProps> = ({ selectedMood, onSelectMood, initialIntensity }) => {
  const [intensity, setIntensity] = useState<number>(initialIntensity || 5);

  useEffect(() => {
    if (initialIntensity !== undefined) {
      setIntensity(initialIntensity);
    }
  }, [initialIntensity]);

  const handleMoodSelect = (mood: MoodType) => {
    onSelectMood(mood, intensity);
  };

  const handleIntensityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newIntensity = parseInt(event.target.value, 10);
    setIntensity(newIntensity);
    if (selectedMood) {
      onSelectMood(selectedMood, newIntensity);
    }
  };
  return (
    <div className="mb-8 w-full">
      <h2 className="text-2xl font-semibold mb-6 text-text-primary text-center">How are you feeling?</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 justify-items-center">
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleMoodSelect(mood.value)}
            className={`
              flex flex-col items-center justify-center
              p-4 rounded-xl
              transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary
              w-24 h-24 sm:w-28 sm:h-28
              border-2 border-transparent
              ${selectedMood === mood.value ? 'bg-accent/20 scale-110 shadow-lg border-accent' : 'bg-white hover:bg-gray-100 shadow-md hover:shadow-lg'}
            `}
            title={mood.label}
            aria-label={`Select mood: ${mood.label}`}
          >
            <span className="block text-3xl sm:text-4xl mb-1">{mood.emoji}</span>
            <span className="text-xs sm:text-sm font-medium block text-text-secondary">{mood.label}</span>
          </button>
        ))}
      </div>
      {selectedMood && (
        <div className="mt-8 w-full max-w-sm mx-auto"> {/* Increased top margin and max-width */}
          <label htmlFor="moodIntensity" className="block text-md font-medium text-text-primary mb-2 text-center"> {/* Increased font size and margin */}
            Intensity: <span className="font-bold">{intensity}</span>
          </label>
          <input
            type="range"
            id="moodIntensity"
            name="moodIntensity"
            min="1"
            max="10"
            value={intensity}
            onChange={handleIntensityChange}
            className="w-full h-3 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-primary" /* Styled slider thumb with accent color */
          />
          <div className="flex justify-between text-sm text-text-secondary mt-2"> {/* Increased top margin */}
            <span>Less Intense</span>
            <span>More Intense</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmojiSelector;