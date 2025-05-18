import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import EmojiSelector from "./components/EmojiSelector";
import MoodLegend from "./components/MoodLegend";
import Notification from "./components/Notification";
import JournalInput from "./components/JournalInput";
import ActivityTagSelector from "./components/ActivityTagSelector";
import MoodChart from "./components/MoodChart";
import YearInPixels from './components/YearInPixels';
import { MoodEntries, MoodType } from "./types/types";
import { getTodayString, formatDateToString } from "./utils/dateUtils";
import { getMoodEntries, saveMoodEntry, saveCustomTags, getCustomTags } from "./utils/localStorage";

interface Tag {
  id: string;
  name: string;
  isCustom?: boolean;
}

const DEFAULT_TAGS: Tag[] = [
  { id: "work", name: "Work" },
  { id: "friends", name: "Friends" },
  { id: "exercise", name: "Exercise" },
  { id: "relax", name: "Relax" },
  { id: "family", name: "Family" },
  { id: "hobby", name: "Hobby" },
];

function App() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());

  const [moodEntries, setMoodEntries] = useState<MoodEntries>({});

  const todayString = getTodayString();
  const [selectedDate, setSelectedDate] = useState<string>(todayString);  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [currentJournal, setCurrentJournal] = useState<string | undefined>(
    undefined
  );

  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>(DEFAULT_TAGS);
  const [notification, setNotification] = useState<string | null>(null);
  const [showYearInPixels, setShowYearInPixels] = useState(false);
  const [showMonthChart, setShowMonthChart] = useState(false);

  useEffect(() => {
    const entries = getMoodEntries();
    setMoodEntries(entries);
    
    const savedCustomTags = getCustomTags();
    if (savedCustomTags.length > 0) {
      const mergedTags = [...DEFAULT_TAGS];
      savedCustomTags.forEach(customTag => {
        if (!mergedTags.some(tag => tag.id === customTag.id)) {
          mergedTags.push(customTag);
        }
      });
      setAvailableTags(mergedTags);
    }
  }, []);
  useEffect(() => {
    const entry = moodEntries[selectedDate];
    setSelectedMood(entry?.mood || null);
    setCurrentJournal(entry?.journal || "");
    setCurrentTags(entry?.tags || []);
  }, [selectedDate, moodEntries]);

  const handleSelectMood = (mood: MoodType) => {
    setMoodEntries(prevMoodEntries => {
      const newMoodEntries = { ...prevMoodEntries }; 
      const journalToSave = newMoodEntries[selectedDate]?.journal || currentJournal || "";
      const tagsToSave = newMoodEntries[selectedDate]?.tags || currentTags || [];

      newMoodEntries[selectedDate] = {
        mood: mood,
        journal: journalToSave,
        tags: tagsToSave,
      };
      saveMoodEntry(selectedDate, mood, journalToSave, tagsToSave); 
      return newMoodEntries; 
    });

    setSelectedMood(mood);
    setNotification(
      `Mood saved for ${selectedDate === todayString ? "today" : selectedDate}!`
    );
  };

  const handleSaveJournal = (journal: string) => {
    setCurrentJournal(journal);
    if (selectedMood) {
      setMoodEntries(prevMoodEntries => {
        const newMoodEntries = { ...prevMoodEntries }; 
        newMoodEntries[selectedDate] = {
          ...(newMoodEntries[selectedDate] || {}),
          mood: selectedMood, 
          journal: journal,
          tags: newMoodEntries[selectedDate]?.tags || currentTags || [], 
        };
        saveMoodEntry(selectedDate, selectedMood, journal, newMoodEntries[selectedDate]?.tags || currentTags || []);
        return newMoodEntries; 
      });
      setNotification(
        `Journal saved for ${selectedDate === todayString ? "today" : selectedDate
        }!`
      );
    } else {
    }
  };

  const handleDateSelect = (dateString: string) => {
    setSelectedDate(dateString);
  };

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
        const newMoodEntries = { ...prevMoodEntries }; 
        newMoodEntries[selectedDate] = {
          ...(newMoodEntries[selectedDate] || {}),
          mood: selectedMood, 
          journal: newMoodEntries[selectedDate]?.journal || currentJournal || "", 
          tags: newSelectedTags,
        };
        saveMoodEntry(selectedDate, selectedMood, newMoodEntries[selectedDate]?.journal || currentJournal || "", newSelectedTags);
        return newMoodEntries; 
      });
      setNotification(
        `Tags updated for ${selectedDate === todayString ? "today" : selectedDate
        }`
      );
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setCurrentTags(prev => prev.filter(id => id !== tagId));
    
    const isCustomTag = !DEFAULT_TAGS.some(tag => tag.id === tagId);
    if (isCustomTag) {
      const updatedTags = availableTags.filter(tag => tag.id !== tagId);
      setAvailableTags(updatedTags);
      
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
          const newMoodEntries = { ...prevMoodEntries }; 
          newMoodEntries[selectedDate] = {
            ...(newMoodEntries[selectedDate] || {}),
            mood: selectedMood, 
            journal: newMoodEntries[selectedDate]?.journal || currentJournal || "", 
            tags: newSelectedTags,
          };
          saveMoodEntry(selectedDate, selectedMood, newMoodEntries[selectedDate]?.journal || currentJournal || "", newSelectedTags);
          return newMoodEntries; 
        });
      }
      const customTags = updatedAvailableTags.filter(
        tag => !DEFAULT_TAGS.some(defaultTag => defaultTag.id === tag.id)
      );
      saveCustomTags(customTags);
    }
  };

  const handleDayClickFromYearView = (dateString: string) => {
    const dateObject = new Date(dateString); 

    setSelectedDate(formatDateToString(dateObject)); 
    setCurrentMonth(dateObject.getMonth());
    setCurrentYear(dateObject.getFullYear());
    setShowYearInPixels(false); 
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
          <div className="flex flex-wrap gap-3 mb-4">
            <button 
              onClick={() => {
                setShowYearInPixels(false);
                setShowMonthChart(false);
              }}
              className={`px-4 py-2 font-semibold rounded-md shadow-sm transition-colors ${
                !showYearInPixels && !showMonthChart 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Calendar View
            </button>
            <button 
              onClick={() => {
                setShowYearInPixels(true);
                setShowMonthChart(false);
              }}
              className={`px-4 py-2 font-semibold rounded-md shadow-sm transition-colors ${
                showYearInPixels 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Year in Pixels
            </button>
            <button 
              onClick={() => {
                setShowYearInPixels(false);
                setShowMonthChart(true);
              }}
              className={`px-4 py-2 font-semibold rounded-md shadow-sm transition-colors ${
                showMonthChart 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Month Chart
            </button>
          </div>
          {showYearInPixels ? (
            <div className="p-6 bg-white shadow-lg rounded-lg mt-6 w-full">
              <div className="overflow-x-auto">
                <YearInPixels year={currentYear} moodEntries={moodEntries} onDayClick={handleDayClickFromYearView} />
              </div>
            </div>
          ) : showMonthChart ? (
            <div className="p-6 bg-white shadow-lg rounded-lg mt-6 w-full">
              <h3 className="text-2xl font-semibold text-slate-700 mb-6 text-center">
                {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear} Mood Chart
              </h3>
              <div className="h-[500px]">
                <MoodChart 
                  key={`mood-chart-${currentMonth}-${currentYear}`} 
                  moodEntries={moodEntries} 
                  month={currentMonth} 
                  year={currentYear} 
                />
              </div>
              <div className="mt-6 flex justify-center">
                <MoodLegend horizontal={true} />
              </div>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => handleChangeMonth('prev')}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                >
                  ← Previous Month
                </button>
                <button
                  onClick={() => handleChangeMonth('next')}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                >
                  Next Month →
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-6">
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
                  />
                  <div className="mt-6">
                    <MoodLegend horizontal={true} />
                  </div>
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
