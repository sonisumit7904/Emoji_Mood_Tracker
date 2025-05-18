import React from 'react';
import { MoodType } from '../types/types';
import { getMoodData } from '../utils/moodUtils';

interface CalendarDayProps {
  day: number;
  dateString: string;
  mood: MoodType | null;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  onSelect: (dateString: string) => void;
  hasJournal?: boolean; 
}

const CalendarDay: React.FC<CalendarDayProps> = ({ 
  day, 
  dateString,
  mood, 
  isCurrentMonth, 
  isToday,
  isSelected,
  onSelect,
  hasJournal
}) => {
  const getMoodStyle = () => {
    if (!mood || !isCurrentMonth) return {};
    
    const moodData = getMoodData(mood);
    return {
      backgroundColor: moodData.color,
      color: '#ffffff', // Changed to white for better contrast on colored backgrounds
      transform: 'scale(0.95)',
    };
  };

  const dayClasses = `
    flex items-center justify-center
    w-10 h-10 rounded-full
    transition-all duration-300
    ${isCurrentMonth ? 'text-text-primary' : 'text-gray-400'}
    ${isToday ? 'ring-2 ring-primary font-bold' : ''} // Use primary color for today's ring
    ${isSelected ? 'ring-2 ring-accent ring-offset-1' : ''} // Use accent color for selected day ring
    ${mood && isCurrentMonth ? 'font-medium' : ''}
    ${isCurrentMonth ? 'cursor-pointer hover:bg-gray-100' : ''}
    relative 
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
            className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" // Use accent color for journal indicator
            title="Has journal entry"
          ></span>
        )}
      </div>
    </div>
  );
};

export default CalendarDay;