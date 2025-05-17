import React from 'react';
import { MoodEntries, MoodType } from '../types/types';
import { getMoodData } from '../utils/moodUtils';
import { formatDateToString, getDaysInMonth } from '../utils/dateUtils';

interface YearInPixelsProps {
  year: number;
  moodEntries: MoodEntries;
  onDayClick?: (date: string) => void;
}

const MOOD_COLOR_MAP: Record<MoodType, string> = {
  happy: 'bg-yellow-300',
  sad: 'bg-blue-300',
  angry: 'bg-red-300',
  neutral: 'bg-green-300',
  excited: 'bg-pink-300',
  stressed: 'bg-gray-400', // Added for consistency with target image
};

const getMoodPixelColor = (mood?: MoodType): string => {
  if (!mood) return 'bg-gray-100'; // Empty day color
  return MOOD_COLOR_MAP[mood] || 'bg-gray-100';
};


const YearInPixels: React.FC<YearInPixelsProps> = ({ year, moodEntries, onDayClick }) => {
  const monthInitials = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const daysInYear = Array.from({ length: 31 }, (_, i) => i + 1); // Max days in a month for rows

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg w-full">
      <h3 className="text-2xl font-semibold text-slate-700 mb-6 text-center font-serif">
        {year} in Pixels
      </h3>
      <div className="flex justify-center">
        <div className="grid grid-flow-col auto-cols-max gap-px">
          {/* Day Numbers Column */}
          <div className="flex flex-col">
            <div className="h-6 w-8 border-b border-r border-slate-200"></div> {/* Empty corner */}
            {daysInYear.map(dayNum => (
              <div 
                key={`day-num-${dayNum}`} 
                className="h-6 w-8 flex items-center justify-center text-xs text-slate-500 border-r border-b border-slate-200"
              >
                {dayNum}
              </div>
            ))}
          </div>

          {/* Month Columns */}
          {monthInitials.map((initial, monthIndex) => {
            const daysInCurrentMonth = getDaysInMonth(year, monthIndex);
            return (
              <div key={`month-col-${initial}`} className="flex flex-col">
                {/* Month Initial Header */}
                <div className="h-6 w-6 flex items-center justify-center text-xs font-medium text-slate-600 border-b border-r border-slate-200">
                  {initial}
                </div>
                {/* Day Cells for the Month */}
                {daysInYear.map(dayNum => {
                  if (dayNum > daysInCurrentMonth) {
                    return (
                      <div
                        key={`empty-${monthIndex}-${dayNum}`}
                        className="h-6 w-6 border-r border-b border-slate-200 bg-slate-50" // Lighter for non-existent days
                      />
                    );
                  }
                  const dateObj = new Date(year, monthIndex, dayNum);
                  const dateString = formatDateToString(dateObj);
                  const entry = moodEntries[dateString];
                  const mood = entry?.mood;
                  const moodColorClass = getMoodPixelColor(mood);
                  const moodData = mood ? getMoodData(mood) : null;

                  return (
                    <div
                      key={dateString}
                      title={`${dateString}${moodData ? ` - ${moodData.label}` : ''}`}
                      className={`h-6 w-6 border-r border-b border-slate-200 cursor-pointer transition-transform hover:scale-110 ${moodColorClass}`}
                      onClick={() => onDayClick && onDayClick(dateString)}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-6 text-center">
        Click on a day to view or log your mood.
      </p>
    </div>
  );
};

export default YearInPixels;
