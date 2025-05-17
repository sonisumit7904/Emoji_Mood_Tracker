import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import EmojiSelector from './components/EmojiSelector';
import MoodLegend from './components/MoodLegend';
import Notification from './components/Notification';
import { MoodEntries, MoodType } from './types/types';
import { getTodayString } from './utils/dateUtils';
import { getMoodEntries, saveMoodEntry } from './utils/localStorage';

function App() {
  // State for the current date
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  
  // State for mood entries
  const [moodEntries, setMoodEntries] = useState<MoodEntries>({});
  
  // State for today's mood
  const todayString = getTodayString();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  
  // Notification state
  const [notification, setNotification] = useState<string | null>(null);
  
  // Load mood entries from localStorage on component mount
  useEffect(() => {
    const entries = getMoodEntries();
    setMoodEntries(entries);
    setSelectedMood(entries[todayString] || null);
  }, [todayString]);
  
  // Handle mood selection
  const handleSelectMood = (mood: MoodType) => {
    // Save the mood entry
    saveMoodEntry(todayString, mood);
    
    // Update state
    setSelectedMood(mood);
    setMoodEntries(prev => ({
      ...prev,
      [todayString]: mood
    }));
    
    // Show notification
    setNotification('Mood saved for today!');
  };
  
  // Handle month change
  const handleChangeMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(prev => prev - 1);
      } else {
        setCurrentMonth(prev => prev - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(prev => prev + 1);
      } else {
        setCurrentMonth(prev => prev + 1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-12 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Emoji Mood Tracker</h1>
        <p className="text-gray-600">Track your daily mood with emojis</p>
      </header>
      
      <main className="w-full max-w-md flex flex-col items-center">
        <EmojiSelector 
          selectedMood={selectedMood} 
          onSelectMood={handleSelectMood} 
        />
        
        <Calendar 
          moodEntries={moodEntries}
          currentMonth={currentMonth}
          currentYear={currentYear}
          onChangeMonth={handleChangeMonth}
        />
        
        <MoodLegend />
      </main>
      
      <footer className="mt-auto py-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Emoji Mood Tracker
      </footer>
      
      <Notification message={notification} />
    </div>
  );
}

export default App;