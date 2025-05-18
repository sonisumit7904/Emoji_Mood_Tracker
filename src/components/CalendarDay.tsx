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
    // Task 4.1: Ensure mood colors from the palette are used.
    // The moodData.color should already be from the defined palette in moodUtils.ts
    return {
      backgroundColor: moodData.color,
      color: '#FFFFFF', // Ensure high contrast for text on colored background
    };
  };

  const dayClasses = `
    flex items-center justify-center
    w-10 h-10 md:w-12 md:h-12 rounded-lg /* Slightly larger and less rounded for a modern feel */
    transition-all duration-200 ease-in-out /* Smoother transition */
    ${isCurrentMonth ? 'text-text-primary' : 'text-gray-300 dark:text-gray-600'} /* Adjusted non-current month color */
    ${isToday ? 'ring-2 ring-primary ring-offset-1 dark:ring-offset-background' : ''} 
    ${isSelected ? 'ring-2 ring-accent dark:ring-accent ring-offset-1 dark:ring-offset-background shadow-lg' : ''}
    ${mood && isCurrentMonth ? 'font-semibold' : 'font-normal'} /* Ensure font weight changes appropriately */
    ${isCurrentMonth ? 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700' : 'cursor-default'}
    relative 
  `;

  const handleClick = () => {
    if (isCurrentMonth) {
      onSelect(dateString);
    }
  };

  return (
    <div className="flex items-center justify-center p-0.5"> {/* Reduced padding around each day cell */}
      <div 
        className={dayClasses}
        style={getMoodStyle()}
        onClick={handleClick}
        role="button" // Added role for accessibility
        tabIndex={isCurrentMonth ? 0 : -1} // Make only current month days focusable
        onKeyDown={(e) => { if (isCurrentMonth && (e.key === 'Enter' || e.key === ' ')) handleClick(); }} // Keyboard accessibility
        title={mood ? `\${moodData.label} - \${dateString}` : dateString} // More descriptive title
      >
        {day}
        {hasJournal && isCurrentMonth && (
          <span 
            className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full shadow-sm"
            title="Has journal entry"
          ></span>
        )}
        {/* Task 4.2: Indication for multiple entries (conceptual) - if data supported it
        {hasMultipleEntries && isCurrentMonth && (
          <span 
            className="absolute bottom-1 right-1 w-2 h-2 bg-blue-500 rounded-full"
            title="Multiple entries"
          ></span>
        )}
        */}
      </div>
    </div>
  );
};

export default CalendarDay;