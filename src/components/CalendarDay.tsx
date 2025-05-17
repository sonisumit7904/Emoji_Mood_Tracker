import React from 'react';
import { MoodType } from '../types/types';
import { getMoodData } from '../utils/moodUtils';

interface CalendarDayProps {
  day: number;
  month: number;
  year: number;
  dateString: string;
  mood: MoodType | null;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  onSelect: (dateString: string) => void;
  hasJournal?: boolean; // Add hasJournal prop
}

const CalendarDay: React.FC<CalendarDayProps> = ({ 
  day, 
  month, // Used in props but not directly in component
  year, // Used in props but not directly in component
  dateString,
  mood, 
  isCurrentMonth, 
  isToday,
  isSelected,
  onSelect,
  hasJournal
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
    ${isSelected ? 'ring-2 ring-green-500 ring-offset-1' : ''}
    ${mood && isCurrentMonth ? 'font-medium' : ''}
    ${isCurrentMonth ? 'cursor-pointer hover:bg-gray-100' : ''}
    relative // Add relative positioning for the icon
  `;

  const handleClick = () => {
    if (isCurrentMonth) {
      onSelect(dateString);
    }
  };

  return (
    <div className="flex items-center justify-center p-1">
      <div 
        className={dayClasses}
        style={getMoodStyle()}
        onClick={handleClick}
        title={isSelected ? `Selected: ${dateString}` : dateString}
      >
        {day}
        {hasJournal && isCurrentMonth && (
          <span 
            className="absolute top-1 right-1 w-2 h-2 bg-sky-500 rounded-full"
            title="Has journal entry"
          ></span>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;