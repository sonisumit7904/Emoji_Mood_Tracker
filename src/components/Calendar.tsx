import React, { useMemo } from 'react';
import CalendarDay from './CalendarDay';
import { MoodEntries } from '../types/types';
import { 
  getDaysInMonth, 
  getFirstDayOfMonth, 
  getMonthNames,
  getDayNames,
  formatDateToString,
  isToday as isTodayHelper
} from '../utils/dateUtils';

interface CalendarProps {
  moodEntries: MoodEntries;
  currentMonth: number;
  currentYear: number;
  onChangeMonth: (direction: 'prev' | 'next') => void;
  onDateSelect: (dateString: string) => void;
  selectedDate: string;
}

const Calendar: React.FC<CalendarProps> = ({ 
  moodEntries, 
  currentMonth, 
  currentYear, 
  onChangeMonth,
  onDateSelect,
  selectedDate
}) => {
  const monthName = getMonthNames()[currentMonth];
  const dayNames = getDayNames();
  
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    
    // Get days from previous month to fill the first week
    const daysFromPrevMonth = firstDayOfMonth;
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
    
    const days = [];
    
    // Add days from previous month
    for (let i = 0; i < daysFromPrevMonth; i++) {
      const day = daysInPrevMonth - daysFromPrevMonth + i + 1;
      const date = new Date(prevMonthYear, prevMonth, day);
      const dateString = formatDateToString(date);
      
      days.push({
        day,
        month: prevMonth,
        year: prevMonthYear,
        isCurrentMonth: false,
        isToday: isTodayHelper(date),
        mood: moodEntries[dateString]?.mood || null, // Changed this line
        hasJournal: !!moodEntries[dateString]?.journal // Check for journal
      });
    }
    
    // Add days from current month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = formatDateToString(date);
      
      days.push({
        day,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        isToday: isTodayHelper(date),
        mood: moodEntries[dateString]?.mood || null, // Changed this line
        hasJournal: !!moodEntries[dateString]?.journal // Check for journal
      });
    }
    
    // Add days from next month to fill the last week
    const totalDays = days.length;
    const remainingDays = 42 - totalDays; // Always show 6 weeks (42 days)
    
    const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(nextMonthYear, nextMonth, day);
      const dateString = formatDateToString(date);
      
      days.push({
        day,
        month: nextMonth,
        year: nextMonthYear,
        isCurrentMonth: false,
        isToday: isTodayHelper(date),
        mood: moodEntries[dateString]?.mood || null, // Changed this line
        hasJournal: !!moodEntries[dateString]?.journal // Check for journal
      });
    }
    
    return days;
  }, [currentMonth, currentYear, moodEntries]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <button 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => onChangeMonth('prev')}
          aria-label="Previous month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="text-xl font-semibold text-text-primary">
          {monthName} {currentYear}
        </h2>
        <button 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={() => onChangeMonth('next')}
          aria-label="Next month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-text-secondary">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          const dateObj = new Date(day.year, day.month, day.day);
          const dateString = formatDateToString(dateObj);
          const isSelected = dateString === selectedDate;
          
          return (
            <CalendarDay
              key={index}
              day={day.day}
              dateString={dateString}
              mood={day.mood}
              hasJournal={day.hasJournal} // Pass hasJournal prop
              isCurrentMonth={day.isCurrentMonth}
              isToday={day.isToday}
              isSelected={isSelected}
              onSelect={onDateSelect}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;