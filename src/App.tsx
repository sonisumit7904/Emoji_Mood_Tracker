import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import EmojiSelector from "./components/EmojiSelector";
import MoodLegend from "./components/MoodLegend";
import Notification from "./components/Notification";
import JournalInput from "./components/JournalInput";
import ActivityTagSelector from "./components/ActivityTagSelector"; // Import new component
import { MoodEntries, MoodType } from "./types/types";
import { getTodayString } from "./utils/dateUtils";
import { getMoodEntries, saveMoodEntry } from "./utils/localStorage";

// Define a simple Tag type for this component
interface Tag {
  id: string;
  name: string;
}

// Default tags
const DEFAULT_TAGS: Tag[] = [
  { id: "work", name: "Work" },
  { id: "friends", name: "Friends" },
  { id: "exercise", name: "Exercise" },
  { id: "relax", name: "Relax" },
  { id: "family", name: "Family" },
  { id: "hobby", name: "Hobby" },
];

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
  const [currentJournal, setCurrentJournal] = useState<string | undefined>(
    undefined
  );

  // State for selected tags
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>(DEFAULT_TAGS); // State for all available tags

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
    setCurrentTags(entries[selectedDate]?.tags || []); // Load tags for selected date
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
      setCurrentTags(existingEntry.tags || []); // Pre-fill tags
    } else {
      // If mood changes or no existing journal, clear it
      setCurrentJournal(undefined);
      setCurrentTags([]); // Clear tags if mood changes or no entry
    }
  };

  // Handle saving journal entry
  const handleSaveJournal = (journal: string) => {
    if (selectedMood) {
      saveMoodEntry(selectedDate, selectedMood, journal, currentTags); // Pass tags to saveMoodEntry
      setMoodEntries((prev) => ({
        ...prev,
        [selectedDate]: { mood: selectedMood, journal, tags: currentTags }, // Save tags in state
      }));
      setNotification(
        `Mood, journal, and tags saved for ${
          selectedDate === todayString ? "today" : selectedDate
        }!`
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

  const handleTagSelectionChange = (newSelectedTags: string[]) => {
    setCurrentTags(newSelectedTags);
  };

  const handleAddCustomTag = (tagName: string) => {
    const newTagId = tagName.toLowerCase().replace(/\s+/g, "-");
    if (!availableTags.find((tag) => tag.id === newTagId)) {
      const newTag: Tag = { id: newTagId, name: tagName };
      setAvailableTags((prevTags) => [...prevTags, newTag]);
      setCurrentTags((prevTags) => [...prevTags, newTagId]); // Auto-select new custom tag
      // Note: You might want to persist custom tags to localStorage separately
      // if you want them to be available across sessions beyond the current one.
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

      <main className="w-full max-w-4xl flex flex-col items-center">
        <EmojiSelector
          selectedMood={selectedMood}
          onSelectMood={handleSelectMood}
        />

        {/* Two-column layout container - always rendered */}
        <div className="flex flex-row items-start mt-4 w-full gap-4">
          {/* Left Column: Journal and Tags - NOW ALWAYS VISIBLE */}
          <div className="flex-none w-1/3 flex flex-col gap-4">
            <JournalInput
              key={`journal-${selectedDate}`}
              onSaveJournal={handleSaveJournal}
              initialJournal={currentJournal}
            />
            <ActivityTagSelector
              key={`tags-${selectedDate}`}
              availableTags={availableTags}
              selectedTags={currentTags}
              onTagSelectionChange={handleTagSelectionChange}
              onAddCustomTag={handleAddCustomTag}
            />
          </div>

          {/* Right Column: Calendar and related info - always rendered */}
          <div className="flex-grow">
            <div className="mb-4 text-center mt-4">
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
          </div>
        </div>
      </main>

      <footer className="mt-auto py-6 text-center text-gray-500 text-sm">
        {new Date().getFullYear()} Emoji Mood Tracker
      </footer>

      <Notification message={notification} />
    </div>
  );
}

export default App;
