import React from 'react';
import { MOODS } from '../utils/moodUtils';

const MoodLegend: React.FC = () => {
  return (
    <div className="mt-8">
      <div className="flex flex-wrap justify-center gap-3">
        {MOODS.map((mood) => (
          <div key={mood.value} className="flex items-center">
            <div 
              className="w-4 h-4 rounded-full mr-1" 
              style={{ backgroundColor: mood.color }}
            ></div>
            <span className="text-sm text-gray-600">{mood.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodLegend;