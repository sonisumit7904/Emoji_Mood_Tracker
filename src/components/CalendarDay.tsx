import React from 'react';
import { MoodType } from '../types/types';
import { getMoodData } from '../utils/moodUtils';

interface CalendarDayProps {
  day: number;
  month: number;
  year: number;
  mood: MoodType | null;
  isCurrentMonth: boolean;
  isToday: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ 
  day, 
  month, 
  year, 
  mood, 
  isCurrentMonth, 
  isToday 
}) => {
  // Get the style based on the mood
  const getMoodStyle = () => {
    if (!mood || !isCurrentMonth) return {};
    
    const moodData = getMoodData(mood);
    return {
      backgroundColor: moodData.color,
      color: '#1f2937', // text-gray-800
      transform: 'scale(0.95)',
    };
  };

  const dayClasses = `
    flex items-center justify-center
    w-10 h-10 rounded-full
    transition-all duration-300
    ${isCurrentMonth ? 'text-gray-800' : 'text-gray-400'}
    ${isToday ? 'ring-2 ring-blue-500 font-bold' : ''}
    ${mood && isCurrentMonth ? 'font-medium' : ''}
  `;

  return (
    <div className="flex items-center justify-center p-1">
      <div 
        className={dayClasses}
        style={getMoodStyle()}
      >
        {day}
      </div>
    </div>
  );
};

export default CalendarDay;