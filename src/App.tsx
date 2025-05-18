import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import EmojiSelector from "./components/EmojiSelector";
import MoodLegend from "./components/MoodLegend";
import Notification from "./components/Notification";
import JournalInput from "./components/JournalInput";
import ActivityTagSelector from "./components/ActivityTagSelector"; // Import new component
import MoodChart from "./components/MoodChart"; // Import the new MoodChart component
import YearInPixels from './components/YearInPixels';
import { MoodEntries, MoodType } from "./types/types";
import { getTodayString, formatDateToString } from "./utils/dateUtils";
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
  const [showYearInPixels, setShowYearInPixels] = useState(false); // Revert to false

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
    const entry = moodEntries[selectedDate];
    setSelectedMood(entry?.mood || null);
    setCurrentJournal(entry?.journal || "");
    setCurrentTags(entry?.tags || []);
    // setNotification(''); // Clear notification when date changes
  }, [selectedDate, moodEntries]); // Added moodEntries to dependency array

  // Handle mood selection
  const handleSelectMood = (mood: MoodType) => {
    setMoodEntries(prevMoodEntries => {
      const newMoodEntries = { ...prevMoodEntries }; // Create a new object
      const journalToSave = newMoodEntries[selectedDate]?.journal || currentJournal || "";
      const tagsToSave = newMoodEntries[selectedDate]?.tags || currentTags || [];

      newMoodEntries[selectedDate] = {
        mood: mood,
        journal: journalToSave,
        tags: tagsToSave,
      };
      saveMoodEntry(selectedDate, mood, journalToSave, tagsToSave); // Save to localStorage
      return newMoodEntries; // Return the new object
    });

    setSelectedMood(mood);
    setNotification(
      `Mood saved for ${selectedDate === todayString ? "today" : selectedDate}!`
    );
  };

  // Handle saving journal entry
  const handleSaveJournal = (journal: string) => {
    setCurrentJournal(journal);
    if (selectedMood) {
      setMoodEntries(prevMoodEntries => {
        const newMoodEntries = { ...prevMoodEntries }; // Create a new object
        newMoodEntries[selectedDate] = {
          ...(newMoodEntries[selectedDate] || {}),
          mood: selectedMood, // Ensure mood is present
          journal: journal,
          tags: newMoodEntries[selectedDate]?.tags || currentTags || [], // Preserve existing tags
        };
        saveMoodEntry(selectedDate, selectedMood, journal, newMoodEntries[selectedDate]?.tags || currentTags || []);
        return newMoodEntries; // Return the new object
      });
      setNotification(
        `Journal saved for ${selectedDate === todayString ? "today" : selectedDate
        }!`
      );
    } else {
      // If no mood is selected, just update the currentJournal state
      // The journal will be saved when a mood is eventually selected.
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
    if (selectedMood) {
      setMoodEntries(prevMoodEntries => {
        const newMoodEntries = { ...prevMoodEntries }; // Create a new object
        newMoodEntries[selectedDate] = {
          ...(newMoodEntries[selectedDate] || {}),
          mood: selectedMood, // Ensure mood is present
          journal: newMoodEntries[selectedDate]?.journal || currentJournal || "", // Preserve existing journal
          tags: newSelectedTags,
        };
        saveMoodEntry(selectedDate, selectedMood, newMoodEntries[selectedDate]?.journal || currentJournal || "", newSelectedTags);
        return newMoodEntries; // Return the new object
      });
      setNotification(
        `Tags updated for ${selectedDate === todayString ? "today" : selectedDate
        }`
      );
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
      const updatedAvailableTags = [...availableTags, newTag];
      setAvailableTags(updatedAvailableTags);

      const newSelectedTags = [...currentTags, newTagId];
      setCurrentTags(newSelectedTags);

      if (selectedMood) {
        setMoodEntries(prevMoodEntries => {
          const newMoodEntries = { ...prevMoodEntries }; // Create a new object
          newMoodEntries[selectedDate] = {
            ...(newMoodEntries[selectedDate] || {}),
            mood: selectedMood, // Ensure mood is present
            journal: newMoodEntries[selectedDate]?.journal || currentJournal || "", // Preserve existing journal
            tags: newSelectedTags,
          };
          saveMoodEntry(selectedDate, selectedMood, newMoodEntries[selectedDate]?.journal || currentJournal || "", newSelectedTags);
          return newMoodEntries; // Return the new object
        });
      }
      const customTags = updatedAvailableTags.filter(
        tag => !DEFAULT_TAGS.some(defaultTag => defaultTag.id === tag.id)
      );
      saveCustomTags(customTags);
    }
  };

  const handleDayClickFromYearView = (dateString: string) => {
    const dateObject = new Date(dateString); // dateString is "YYYY-MM-DD"
    // Ensure correct parsing, especially if timezone issues arise with new Date(string)
    // For "YYYY-MM-DD", it's generally safer to parse manually or use a library,
    // but new Date() often works for this specific format.
    // If issues persist, consider:
    // const [year, month, day] = dateString.split('-').map(Number);
    // const dateObject = new Date(year, month - 1, day);

    setSelectedDate(formatDateToString(dateObject)); // Convert Date object back to "YYYY-MM-DD" string
    setCurrentMonth(dateObject.getMonth());
    setCurrentYear(dateObject.getFullYear());
    setShowYearInPixels(false); // Switch back to calendar view
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 flex flex-col items-center font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Emoji Mood Tracker
        </h1>
        <p className="text-slate-600">Track your daily mood with emojis</p>
      </header>

      <main className="w-full max-w-5xl flex flex-col items-center">
        <EmojiSelector
          selectedMood={selectedMood}
          onSelectMood={handleSelectMood}
        />

        <div className="w-full max-w-5xl mx-auto mt-6">
          <button 
            onClick={() => setShowYearInPixels(!showYearInPixels)}
            className="mb-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md shadow-sm transition-colors w-full md:w-auto"
          >
            {showYearInPixels ? 'Show Calendar View' : 'Show Year in Pixels'}
          </button>

          {showYearInPixels ? (
            <div className="p-6 bg-white shadow-lg rounded-lg mt-6 w-full">
              {/* Removed MoodLegend from here */}
              <div className="overflow-x-auto"> {/* YearInPixels container */}
                <YearInPixels year={currentYear} moodEntries={moodEntries} onDayClick={handleDayClickFromYearView} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-6">
              {/* Left Column: Journal and Tags */}
              <div className="md:col-span-1 flex flex-col gap-6">
                <div className="p-6 bg-white shadow-lg rounded-lg">
                  <JournalInput
                    key={`journal-${selectedDate}`}
                    onSaveJournal={handleSaveJournal}
                    initialJournal={currentJournal}
                    moodSelected={selectedMood !== null}
                  />
                </div>
                <div className="p-6 bg-white shadow-lg rounded-lg">
                  <ActivityTagSelector
                    key={`tags-${selectedDate}`}
                    availableTags={availableTags}
                    selectedTags={currentTags}
                    onTagSelectionChange={handleTagSelectionChange}
                    onAddCustomTag={handleAddCustomTag}
                    onRemoveTag={handleRemoveTag}
                    moodSelected={selectedMood !== null}
                  />
                </div>
              </div>

              {/* Right Column: Calendar, Legend, and Chart */}
              <div className="md:col-span-2 flex flex-col gap-6">
                <div className="p-6 bg-white shadow-lg rounded-lg">
                  <div className="mb-4 text-center">
                    <h3 className="text-lg font-medium text-slate-700">
                      Logging mood for:{" "}
                      <span className="font-bold text-slate-900">
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
                  />                  <div className="mt-6">
                    <MoodLegend horizontal={true} />
                  </div>
                </div>
                <div className="p-6 bg-white shadow-lg rounded-lg">
                  <MoodChart moodEntries={moodEntries} month={currentMonth} year={currentYear} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto py-6 text-center text-slate-500 text-sm">
        {new Date().getFullYear()} Emoji Mood Tracker
      </footer>

      <Notification message={notification} />
    </div>
  );
}

export default App;
