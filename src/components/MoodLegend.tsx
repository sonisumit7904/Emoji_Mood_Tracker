import React from 'react';
import { MOODS } from '../utils/moodUtils';

interface MoodLegendProps {
  horizontal?: boolean; // Add prop to control layout direction
}

const MoodLegend: React.FC<MoodLegendProps> = ({ horizontal = false }) => {
  return (
    <div className=""> 
      <div className={`flex ${horizontal ? 'flex-row flex-wrap justify-center' : 'flex-col'} gap-3 items-start ${horizontal ? '' : 'min-w-[120px]'}`}>
        {MOODS.map((mood) => (
          <div key={mood.value} className="flex items-center">
            <div 
              className="w-6 h-6 rounded-md mr-3 shadow-sm" 
              style={{ backgroundColor: mood.color }}
            ></div>
            <span className="text-sm font-medium text-slate-700">{mood.label}</span>
            {horizontal && <div className="mr-5"></div>} {/* Add extra spacing between items when horizontal */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodLegend;