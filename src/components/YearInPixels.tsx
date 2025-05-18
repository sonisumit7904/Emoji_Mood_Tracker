import React from 'react';
import { MoodEntries, MoodType } from '../types/types';
import { getMoodData } from '../utils/moodUtils';
import { formatDateToString, getDaysInMonth } from '../utils/dateUtils';
import MoodLegend from './MoodLegend'; // Import MoodLegend

interface YearInPixelsProps {
  year: number;
  moodEntries: MoodEntries;
  onDayClick?: (date: string) => void;
}

// Updated MOOD_COLOR_MAP to match the colors in the provided image
const MOOD_COLOR_MAP: Record<MoodType, string> = {
  veryhappy: 'bg-blue-400',   // Very Happy: blue
  happy: 'bg-green-400',      // Happy: green
  neutral: 'bg-yellow-400',   // Neutral: yellow
  sad: 'bg-orange-400',       // Sad: orange
  verysad: 'bg-red-400',      // Very Sad: red
};

const getMoodPixelColor = (mood?: MoodType): string => {
  if (!mood) return 'bg-gray-100'; // Empty day color
  return MOOD_COLOR_MAP[mood] || 'bg-gray-100';
};


const YearInPixels: React.FC<YearInPixelsProps> = ({ year, moodEntries, onDayClick }) => {
  const monthInitials = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const daysInYear = Array.from({ length: 31 }, (_, i) => i + 1); // Max days in a month for rows

  // Calculate the left offset for the legend to be positioned to the right of the entire grid
  // Day numbers column width: w-8 (2rem)
  // 12 Month columns width: 12 * w-6 (12 * 1.5rem = 18rem)
  // Gaps: 12 gaps of 1px each (1 after day numbers, 11 between months, plus one after the last month if we consider the full grid block)
  // Desired space between grid and legend: 0.5rem (for "just right")
  const legendLeftOffset = `calc(2rem + (12 * 1.5rem) + (12 * 1px) + 0.5rem)`;

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg w-full">
      <h3 className="text-2xl font-semibold text-slate-700 mb-6 text-center font-serif">
        {year} in Pixels
      </h3>
      <div className="flex justify-center"> {/* Removed relative from here */}
        <div className="relative inline-block"> {/* Added new wrapper for grid and legend */}
          {/* Grid */}
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
                          className="h-6 w-6 border-r border-b border-slate-200 bg-slate-50"
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
          </div>          {/* Legend positioned absolutely relative to the new inline-block wrapper */}
          <div            className="absolute z-10 p-4 bg-white bg-opacity-95 rounded-lg shadow-lg"
            style={{
              top: '0px', // Align with the top of the month headers/grid
              left: legendLeftOffset,
            }}
          >
            <h4 className="text-sm font-bold text-slate-700 mb-2">Legend</h4>
            <MoodLegend horizontal={false} />
          </div>
        </div>
      </div>
      <p className="text-xs text-slate-500 mt-6 text-center">
        Click on a day to view or log your mood.
      </p>
    </div>
  );
};

export default YearInPixels;
