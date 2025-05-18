import React from 'react';
import { MoodEntry } from '../types/types';
import { getMoodData } from '../utils/moodUtils';
import { formatDateToReadable } from '../utils/dateUtils'; // Assuming you have this utility

interface MoodHistoryCardProps {
  entry: MoodEntry;
  onClick: (dateString: string) => void;
}

const MoodHistoryCard: React.FC<MoodHistoryCardProps> = ({ entry, onClick }) => {
  const moodData = getMoodData(entry.mood);

  return (
    <div 
      className="bg-white shadow-lg rounded-xl p-6 mb-6 cursor-pointer hover:shadow-xl transition-shadow duration-300 ease-in-out"
      onClick={() => onClick(entry.date)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(entry.date); }}
      aria-label={`View mood entry for ${formatDateToReadable(entry.date)}`}
    >
      <div className="flex items-center mb-4">
        <span className="text-5xl mr-4">{moodData.emoji}</span>
        <div>
          <h3 className="text-2xl font-semibold text-text-primary">{moodData.label}</h3>
          <p className="text-text-secondary text-lg">{formatDateToReadable(entry.date)}</p>
        </div>
      </div>
      {entry.journal && (
        <div className="mb-4">
          <h4 className="text-md font-semibold text-text-primary mb-1">Journal:</h4>
          <p className="text-text-secondary bg-gray-50 p-3 rounded-md whitespace-pre-wrap">{entry.journal}</p>
        </div>
      )}
      {entry.tags && entry.tags.length > 0 && (
        <div className="mb-4">
          <h4 className="text-md font-semibold text-text-primary mb-1">Tags:</h4>
          <div className="flex flex-wrap gap-2">
            {entry.tags.map(tag => (
              <span key={tag} className="bg-accent/20 text-accent-dark px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
      {entry.intensity && (
        <div>
          <h4 className="text-md font-semibold text-text-primary mb-1">Intensity:</h4>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${entry.intensity * 10}%` }}
              title={`Intensity: ${entry.intensity}/10`}
            ></div>
          </div>
        </div>
      )}
      {entry.photoUrl && ( // Task 3.3: Display photo if available
        <div className="mt-4">
          <h4 className="text-md font-semibold text-text-primary mb-2">Photo:</h4>
          <img src={entry.photoUrl} alt="User uploaded content" className="rounded-lg max-w-full h-auto shadow-md" />
        </div>
      )}
    </div>
  );
};

export default MoodHistoryCard;
