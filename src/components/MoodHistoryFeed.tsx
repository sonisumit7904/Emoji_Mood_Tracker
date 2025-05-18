import React from 'react';
import { MoodEntries } from '../types/types';
import { getMoodData } from '../utils/moodUtils';
import MoodHistoryCard from './MoodHistoryCard'; // Task 3.2
import { MoodEntry as MoodEntryType } from '../types/types'; // Renamed to avoid conflict

interface MoodHistoryFeedProps {
  moodEntries: MoodEntries;
  onEntryClick: (dateString: string) => void; // For navigating back to the calendar view
}

const MoodHistoryFeed: React.FC<MoodHistoryFeedProps> = ({ moodEntries, onEntryClick }) => {
  // Convert moodEntries object to an array and sort by date descending
  const sortedEntries: MoodEntryType[] = Object.entries(moodEntries)
    .map(([date, entryData]) => ({ date, ...entryData } as MoodEntryType))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (sortedEntries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-text-secondary">No mood history yet.</p>
        <p className="text-text-secondary">Start logging your moods to see them here!</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-text-primary mb-8 text-center">Mood History</h2>
      {sortedEntries.map((entry) => (
        <MoodHistoryCard key={entry.date} entry={entry} onClick={onEntryClick} />
      ))}
    </div>
  );
};

export default MoodHistoryFeed;
