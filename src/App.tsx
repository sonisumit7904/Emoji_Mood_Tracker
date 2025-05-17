import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import EmojiSelector from "./components/EmojiSelector";
import MoodLegend from "./components/MoodLegend";
import Notification from "./components/Notification";
import JournalInput from "./components/JournalInput";
import ActivityTagSelector from "./components/ActivityTagSelector"; // Import new component
import MoodChart from "./components/MoodChart"; // Import the new MoodChart component
import { MoodEntries, MoodType } from "./types/types";
import { getTodayString } from "./utils/dateUtils";
import { getMoodEntries, saveMoodEntry, saveCustomTags, getCustomTags } from "./utils/localStorage";

// Define a simple Tag type for this component
interface Tag {
  id: string;
  name: string;
  isCustom?: boolean;
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
  const [selectedDate, setSelectedDate] = useState<string>(todayString);  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [currentJournal, setCurrentJournal] = useState<string | undefined>(
    undefined
  );

  // State for selected tags
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>(DEFAULT_TAGS); // State for all available tags

  // Notification state
  const [notification, setNotification] = useState<string | null>(null);
  // Load mood entries and custom tags from localStorage on component mount
  useEffect(() => {
    const entries = getMoodEntries();
    setMoodEntries(entries);
    
    // Load saved custom tags
    const savedCustomTags = getCustomTags();
    if (savedCustomTags.length > 0) {
      // Merge default tags with custom tags, avoiding duplicates by ID
      const mergedTags = [...DEFAULT_TAGS];
      savedCustomTags.forEach(customTag => {
        if (!mergedTags.some(tag => tag.id === customTag.id)) {
          mergedTags.push(customTag);
        }
      });
      setAvailableTags(mergedTags);
    }
  }, []);
  // Update selected mood when selected date changes
  useEffect(() => {
    const entries = getMoodEntries();
    setSelectedMood(entries[selectedDate]?.mood || null);
    setCurrentJournal(entries[selectedDate]?.journal);
    setCurrentTags(entries[selectedDate]?.tags || []); // Load tags for selected date
  }, [selectedDate]);
  // Handle mood selection
  const handleSelectMood = (mood: MoodType) => {
    setSelectedMood(mood);
    
    // If there's an existing journal for this date and mood, pre-fill it
    const existingEntry = getMoodEntries()[selectedDate];
    let journalText = undefined;
    let tagList: string[] = [];
    
    if (existingEntry && existingEntry.mood === mood) {
      // If same mood is selected, keep existing journal and tags
      journalText = existingEntry.journal;
      tagList = existingEntry.tags || [];
      setCurrentJournal(journalText);
      setCurrentTags(tagList);
    } else {
      // If mood changes or no existing journal, clear it
      setCurrentJournal(undefined);
      setCurrentTags([]);
    }
    
    // Save mood immediately (with any existing journal and tags or empty ones)
    saveMoodEntry(selectedDate, mood, journalText, tagList);
    setMoodEntries(prev => ({
      ...prev,
      [selectedDate]: { 
        mood: mood, 
        journal: journalText,
        tags: tagList
      }
    }));
    
    // Show notification
    setNotification(`Mood saved for ${selectedDate === todayString ? "today" : selectedDate}!`);
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
        `Journal saved for ${
          selectedDate === todayString ? "today" : selectedDate
        }!`
      );
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
  };  const handleTagSelectionChange = (newSelectedTags: string[]) => {
    setCurrentTags(newSelectedTags);
    
    // Save immediately if a mood is already selected
    if (selectedMood) {
      saveMoodEntry(selectedDate, selectedMood, currentJournal, newSelectedTags);
      setMoodEntries(prev => ({
        ...prev,
        [selectedDate]: { 
          mood: selectedMood, 
          journal: currentJournal,
          tags: newSelectedTags
        }
      }));
      
      // Optional: Show a notification
      setNotification(`Tags updated for ${selectedDate === todayString ? "today" : selectedDate}`);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    // Remove from currentTags if selected
    setCurrentTags(prev => prev.filter(id => id !== tagId));
    
    // Remove from availableTags if it's a custom tag
    const isCustomTag = !DEFAULT_TAGS.some(tag => tag.id === tagId);
    if (isCustomTag) {
      const updatedTags = availableTags.filter(tag => tag.id !== tagId);
      setAvailableTags(updatedTags);
      
      // Update localStorage
      const customTags = updatedTags.filter(
        tag => !DEFAULT_TAGS.some(defaultTag => defaultTag.id === tag.id)
      );
      saveCustomTags(customTags);
    }
  };
    const handleAddCustomTag = (tagName: string) => {
    const newTagId = tagName.toLowerCase().replace(/\s+/g, "-");
    if (!availableTags.find((tag) => tag.id === newTagId)) {
      const newTag: Tag = { id: newTagId, name: tagName, isCustom: true };
      
      // Update state with new tag
      const updatedTags = [...availableTags, newTag];
      setAvailableTags(updatedTags);
      
      // Auto-select new custom tag and save immediately
      const updatedTags2 = [...currentTags, newTagId];
      setCurrentTags(updatedTags2);
      
      // Save immediately if a mood is selected
      if (selectedMood) {
        saveMoodEntry(selectedDate, selectedMood, currentJournal, updatedTags2);
        setMoodEntries(prev => ({
          ...prev,
          [selectedDate]: { 
            mood: selectedMood, 
            journal: currentJournal,
            tags: updatedTags2
          }
        }));
      }
      
      // Save custom tags to localStorage for persistence
      // Filter out default tags to avoid duplication
      const customTags = updatedTags.filter(
        tag => !DEFAULT_TAGS.some(defaultTag => defaultTag.id === tag.id)
      );
      saveCustomTags(customTags);
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
          <div className="flex-none w-1/3 flex flex-col gap-4">            <JournalInput
              key={`journal-${selectedDate}`}
              onSaveJournal={handleSaveJournal}
              initialJournal={currentJournal}
              moodSelected={selectedMood !== null}
            />            <ActivityTagSelector
              key={`tags-${selectedDate}`}
              availableTags={availableTags}
              selectedTags={currentTags}
              onTagSelectionChange={handleTagSelectionChange}
              onAddCustomTag={handleAddCustomTag}
              onRemoveTag={handleRemoveTag}
              moodSelected={selectedMood !== null}
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
        </div>        {/* Add the MoodChart component below the main two-column layout */}
        <MoodChart moodEntries={moodEntries} month={currentMonth} year={currentYear} />
      </main>

      <footer className="mt-auto py-6 text-center text-gray-500 text-sm">
        {new Date().getFullYear()} Emoji Mood Tracker
      </footer>

      <Notification message={notification} />
    </div>
  );
}

export default App;
