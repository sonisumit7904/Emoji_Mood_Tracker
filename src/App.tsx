import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import EmojiSelector from "./components/EmojiSelector";
import MoodLegend from "./components/MoodLegend";
import Notification from "./components/Notification";
import JournalInput from "./components/JournalInput"; // Import JournalInput
import { MoodEntries, MoodType } from "./types/types";
import { getTodayString } from "./utils/dateUtils";
import { getMoodEntries, saveMoodEntry } from "./utils/localStorage";

function App() {
  // State for the current date
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());

  // State for mood entries
  const [moodEntries, setMoodEntries] = useState<MoodEntries>({});

  // State for selected date for mood logging
  const todayString = getTodayString();
  const [selectedDate, setSelectedDate] = useState<string>(todayString);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [showJournalInput, setShowJournalInput] = useState(false); // State to control journal input visibility
  const [currentJournal, setCurrentJournal] = useState<string | undefined>(undefined);

  // Notification state
  const [notification, setNotification] = useState<string | null>(null);

  // Load mood entries from localStorage on component mount
  useEffect(() => {
    const entries = getMoodEntries();
    setMoodEntries(entries);
  }, []);

  // Update selected mood when selected date changes
  useEffect(() => {
    const entries = getMoodEntries();
    setSelectedMood(entries[selectedDate]?.mood || null);
    setCurrentJournal(entries[selectedDate]?.journal);
    // Hide journal input when date changes, unless a mood is already selected for the new date
    setShowJournalInput(!!entries[selectedDate]?.mood);
  }, [selectedDate]);

  // Handle mood selection
  const handleSelectMood = (mood: MoodType) => {
    setSelectedMood(mood);
    // Don't save immediately, show journal input first
    setShowJournalInput(true);
    // If there's an existing journal for this date and mood, pre-fill it
    const existingEntry = getMoodEntries()[selectedDate];
    if (existingEntry && existingEntry.mood === mood) {
      setCurrentJournal(existingEntry.journal);
    } else {
      // If mood changes or no existing journal, clear it
      setCurrentJournal(undefined);
    }
  };

  // Handle saving journal entry
  const handleSaveJournal = (journal: string) => {
    if (selectedMood) {
      saveMoodEntry(selectedDate, selectedMood, journal);
      setMoodEntries((prev) => ({
        ...prev,
        [selectedDate]: { mood: selectedMood, journal },
      }));
      setNotification(
        `Mood and journal saved for ${selectedDate === todayString ? "today" : selectedDate}!`
      );
      setShowJournalInput(false); // Hide after saving
    }
  };

  // Handle date selection
  const handleDateSelect = (dateString: string) => {
    setSelectedDate(dateString);
  };

  // Handle month change
  const handleChangeMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear((prev) => prev - 1);
      } else {
        setCurrentMonth((prev) => prev - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear((prev) => prev + 1);
      } else {
        setCurrentMonth((prev) => prev + 1);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-12 px-4">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Emoji Mood Tracker
        </h1>
        <p className="text-gray-600">Track your daily mood with emojis</p>
      </header>

      <main className="w-full max-w-md flex flex-col items-center">
        <EmojiSelector
          selectedMood={selectedMood}
          onSelectMood={handleSelectMood}
        />

        {showJournalInput && selectedMood && (
          <JournalInput
            key={selectedDate} // Add key to re-render when date changes
            onSaveJournal={handleSaveJournal}
            initialJournal={currentJournal}
          />
        )}

        <div className="mb-4 text-center mt-4"> {/* Added mt-4 for spacing */}
          <h3 className="text-lg font-medium text-gray-800">
            Logging mood for:{" "}
            <span className="font-bold">
              {selectedDate === todayString ? "Today" : selectedDate}
            </span>
          </h3>
        </div>

        <Calendar
          moodEntries={moodEntries}
          currentMonth={currentMonth}
          currentYear={currentYear}
          onChangeMonth={handleChangeMonth}
          onDateSelect={handleDateSelect}
          selectedDate={selectedDate}
        />

        <MoodLegend />
      </main>

      <footer className="mt-auto py-6 text-center text-gray-500 text-sm">
        {new Date().getFullYear()} Emoji Mood Tracker
      </footer>

      <Notification message={notification} />
    </div>
  );
}

export default App;
