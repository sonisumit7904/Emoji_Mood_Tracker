import React, { useState, useEffect } from "react";
import Calendar from "./components/Calendar";
import EmojiSelector from "./components/EmojiSelector";
import MoodLegend from "./components/MoodLegend";
import Notification from "./components/Notification";
import JournalInput from "./components/JournalInput";
import ActivityTagSelector from "./components/ActivityTagSelector";
import MoodChart from "./components/MoodChart";
import YearInPixels from './components/YearInPixels';
import MoodHistoryFeed from './components/MoodHistoryFeed'; // Task 3.2
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
  const [selectedDate, setSelectedDate] = useState<string>(todayString);
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [currentJournal, setCurrentJournal] = useState<string | undefined>(
    undefined
  );
  const [currentIntensity, setCurrentIntensity] = useState<number | undefined>(undefined); // Added

  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>(DEFAULT_TAGS);
  const [notification, setNotification] = useState<string | null>(null);
  const [showYearInPixels, setShowYearInPixels] = useState(false);
  const [showMonthChart, setShowMonthChart] = useState(false);
  const [showMoodHistory, setShowMoodHistory] = useState(false); // Task 3.2: State for history feed
  // const [customMoods, setCustomMoods] = useState<MoodData[]>([]); // Task 2.3 - Commented out, ensure MoodData is imported if used
  // const [showCustomMoodModal, setShowCustomMoodModal] = useState(false); // Task 2.3 - Commented out

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
    // Load custom moods - Task 2.3
    // const savedCustomMoods = getCustomMoods(); // Assuming a getCustomMoods function in localStorage.ts
    // setCustomMoods(savedCustomMoods);
  }, []);
  useEffect(() => {
    const entry = moodEntries[selectedDate];
    setSelectedMood(entry?.mood || null);
    setCurrentJournal(entry?.journal || "");
    setCurrentTags(entry?.tags || []);
    setCurrentIntensity(entry?.intensity); // Added: Load intensity
  }, [selectedDate, moodEntries]);

  const handleSelectMood = (mood: MoodType, intensity?: number) => {
    // If intensity is not explicitly passed with this selection,
    // and the mood selected is the same as the already selected mood,
    // then retain the currentIntensity. Otherwise, use the new intensity or default.
    const intensityToSave = intensity !== undefined ? intensity : (mood === selectedMood ? currentIntensity : 5);


    setMoodEntries(prevMoodEntries => {
      const newMoodEntries = { ...prevMoodEntries };
      const entryToUpdate = newMoodEntries[selectedDate] || {};
      newMoodEntries[selectedDate] = {
        ...entryToUpdate,
        mood: mood,
        journal: entryToUpdate.journal || currentJournal || '',
        tags: entryToUpdate.tags || currentTags || [],
        intensity: intensityToSave,
        // Task 3.3: Simulate adding a photo URL for demonstration
        // In a real app, this would come from user input
        photoUrl: mood === 'happy' && selectedDate.endsWith('01') ? 'https://picsum.photos/seed/picsum/200/300' : entryToUpdate.photoUrl,
      };
      saveMoodEntry(
        selectedDate,
        mood,
        newMoodEntries[selectedDate]?.journal,
        newMoodEntries[selectedDate]?.tags,
        intensityToSave,
        newMoodEntries[selectedDate]?.photoUrl // Task 3.3: Pass photoUrl to save function
      );
      return newMoodEntries;
    });

    setSelectedMood(mood);
    if (intensityToSave !== undefined) setCurrentIntensity(intensityToSave); // Update intensity state

    setNotification(
      `Mood saved for ${selectedDate === todayString ? "today" : selectedDate}!`
    );
  };

  const handleSaveJournal = (journal: string) => {
    setCurrentJournal(journal);
    if (selectedMood) {
      setMoodEntries(prevMoodEntries => {
        const newMoodEntries = { ...prevMoodEntries };
        const entryToUpdate = newMoodEntries[selectedDate] || {};
        newMoodEntries[selectedDate] = {
          ...entryToUpdate,
          mood: selectedMood, // Ensure mood is present
          journal: journal,
          tags: entryToUpdate.tags || currentTags || [], // Preserve tags
          intensity: entryToUpdate.intensity || currentIntensity, // Preserve intensity
          // Task 3.3: Simulate adding a photo URL for demonstration if not already present
          photoUrl: entryToUpdate.photoUrl || (selectedDate.endsWith('05') ? 'https://picsum.photos/seed/another/200/300' : undefined),
        };
        saveMoodEntry(
          selectedDate,
          selectedMood,
          journal,
          newMoodEntries[selectedDate]?.tags || currentTags || [],
          newMoodEntries[selectedDate]?.intensity || currentIntensity,
          newMoodEntries[selectedDate]?.photoUrl // Task 3.3: Pass photoUrl to save function
        );
        return newMoodEntries;
      });
      setNotification(
        `Journal saved for ${selectedDate === todayString ? "today" : selectedDate
        }!`
      );

      // Task 2.4: Gentle prompt for negative moods
      if (selectedMood === 'sad' || selectedMood === 'verysad') {
        if (!journal) { // Only prompt if journal is empty
          setNotification(
            `Journal saved. Consider adding a note about why you're feeling ${selectedMood}.`
          );
        }
      } else {
        // User might be trying to save journal without selecting mood
        // Notification/warning is handled in JournalInput component
      }
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
        const entryToUpdate = newMoodEntries[selectedDate] || {};
        newMoodEntries[selectedDate] = {
          ...entryToUpdate,
          mood: selectedMood,
          journal: entryToUpdate.journal || currentJournal || "",
          tags: newSelectedTags,
          intensity: entryToUpdate.intensity || currentIntensity, // Preserve intensity
        };
        saveMoodEntry(
          selectedDate,
          selectedMood,
          newMoodEntries[selectedDate]?.journal || currentJournal || "",
          newSelectedTags,
          newMoodEntries[selectedDate]?.intensity || currentIntensity // Pass intensity
        );
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
    const newTagId = tagName.toLowerCase().replace(/\\s+/g, "-");
    if (!availableTags.find((tag) => tag.id === newTagId)) {
      const newTag: Tag = { id: newTagId, name: tagName, isCustom: true };
      const updatedAvailableTags = [...availableTags, newTag];
      setAvailableTags(updatedAvailableTags);

      const newSelectedTags = [...currentTags, newTagId];
      setCurrentTags(newSelectedTags);

      if (selectedMood) {
        setMoodEntries(prevMoodEntries => {
          const newMoodEntries = { ...prevMoodEntries };
          const entryToUpdate = newMoodEntries[selectedDate] || {};
          newMoodEntries[selectedDate] = {
            ...entryToUpdate,
            mood: selectedMood,
            journal: entryToUpdate.journal || currentJournal || "",
            tags: newSelectedTags,
            intensity: entryToUpdate.intensity || currentIntensity, // Preserve intensity
          };
          saveMoodEntry(
            selectedDate,
            selectedMood,
            newMoodEntries[selectedDate]?.journal || currentJournal || "",
            newSelectedTags,
            newMoodEntries[selectedDate]?.intensity || currentIntensity // Pass intensity
          );
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
    setShowMonthChart(false);
    setShowMoodHistory(false); // Ensure mood history is also hidden
  };

  const handleHistoryEntryClick = (dateString: string) => {
    const dateObject = new Date(dateString);
    setSelectedDate(formatDateToString(dateObject));
    setCurrentMonth(dateObject.getMonth());
    setCurrentYear(dateObject.getFullYear());
    setShowMoodHistory(false); // Hide history feed
    setShowYearInPixels(false); // Ensure other views are hidden
    setShowMonthChart(false);   // Ensure other views are hidden
  };

  // Task 2.3: Function to add custom mood (basic structure)
  // const handleAddCustomMood = (newMood: MoodData) => { // Ensure MoodData is imported if used
  //   // setCustomMoods(prev => [...prev, newMood]);
  //   // saveCustomMoods([...customMoods, newMood]); // Assuming a saveCustomMoods function
  //   // setShowCustomMoodModal(false);
  //   // Potentially update MOODS array or handle it separately in EmojiSelector
  //   alert("Custom mood functionality would be implemented here.");
  // };

  const isTodaySelectedAndNotLogged = 
    selectedDate === todayString && 
    !moodEntries[todayString]?.mood &&
    !showYearInPixels && !showMonthChart && !showMoodHistory;

  return (
    <div className="min-h-screen bg-background text-text-primary p-6 md:p-8 flex flex-col items-center font-sans">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-text-primary mb-3">
          Emoji Mood Tracker
        </h1>
        {isTodaySelectedAndNotLogged ? (
          <p className="text-accent text-lg animate-pulse">How are you feeling today?</p> // Task 5.4: Gentle prompt
        ) : (
          <p className="text-text-secondary text-lg">Track your daily mood with emojis</p>
        )}
      </header>
      <main className="w-full max-w-6xl flex flex-col items-center">
        <EmojiSelector
          selectedMood={selectedMood}
          onSelectMood={handleSelectMood}
          initialIntensity={currentIntensity} // Pass initial intensity
          // customMoods={customMoods} // Pass custom moods to selector - Task 2.3
          // onAddCustomMood={() => setShowCustomMoodModal(true)} // Task 2.3
        />

        {/* Placeholder for Custom Mood Modal - Task 2.3 */}
        {/* {showCustomMoodModal && (
          <div className=\"fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50\">
            <div className=\"bg-white p-6 rounded-xl shadow-2xl w-full max-w-md\">
              <h3 className=\"text-xl font-semibold text-text-primary mb-4\">Add Custom Mood</h3>
              <p className=\"text-text-secondary mb-4\">Define a new mood to track.</p>
              <button onClick={() => handleAddCustomMood({emoji: '🤔', label: 'Thinking', value: 'thinking', color: '#A0AEC0'})} className=\"btn-primary w-full mb-2\">Add 'Thinking' (Example)</button>
              <button onClick={() => setShowCustomMoodModal(false)} className=\"w-full py-2 px-4 bg-gray-200 text-text-secondary rounded-lg hover:bg-gray-300 transition-colors\">Cancel</button>
            </div>
          </div>
        )} */}

        <div className="w-full mx-auto mt-8">
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            <button
              onClick={() => {
                setShowYearInPixels(false);
                setShowMonthChart(false);
                setShowMoodHistory(false); // Task 3.2
              }}
              className={`px-5 py-2.5 font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 ${ 
                !showYearInPixels && !showMonthChart && !showMoodHistory // Task 3.2
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-text-secondary hover:bg-gray-300'
              }`}
            >
              Calendar View
            </button>
            <button
              onClick={() => {
                setShowYearInPixels(true);
                setShowMonthChart(false);
                setShowMoodHistory(false); // Task 3.2
              }}
              className={`px-5 py-2.5 font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 ${ 
                showYearInPixels
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-text-secondary hover:bg-gray-300'
              }`}
            >
              Year in Pixels
            </button>
            <button
              onClick={() => {
                setShowYearInPixels(false);
                setShowMonthChart(true);
                setShowMoodHistory(false); // Task 3.2
              }}
              className={`px-5 py-2.5 font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 ${ 
                showMonthChart
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-text-secondary hover:bg-gray-300'
              }`}
            >
              Month Chart
            </button>
            {/* Task 3.2: Button to show Mood History Feed */}
            <button
              onClick={() => {
                setShowYearInPixels(false);
                setShowMonthChart(false);
                setShowMoodHistory(true);
              }}
              className={`px-5 py-2.5 font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 ${ 
                showMoodHistory
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-text-secondary hover:bg-gray-300'
              }`}
            >
              Mood History
            </button>
          </div>
          {showYearInPixels ? (
            <div className="p-6 bg-white shadow-xl rounded-2xl mt-8 w-full"> {/* Increased border-radius */}
              <div className="overflow-x-auto">
                <YearInPixels year={currentYear} moodEntries={moodEntries} onDayClick={handleDayClickFromYearView} />
              </div>
            </div>
          ) : showMonthChart ? (
            <div className="p-6 bg-white shadow-xl rounded-2xl mt-8 w-full"> {/* Increased border-radius */}
              <h3 className="text-2xl font-semibold text-slate-700 mb-8 text-center">
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
              <div className="mt-8 flex justify-center">
                <MoodLegend horizontal={true} />
              </div>
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={() => handleChangeMonth('prev')}
                  className="btn-primary"
                >
                  ← Previous Month
                </button>
                <button
                  onClick={() => handleChangeMonth('next')}
                  className="btn-primary"
                >
                  Next Month →
                </button>
              </div>
            </div>
          ) : showMoodHistory ? ( // Task 3.2: Render MoodHistoryFeed
            <MoodHistoryFeed moodEntries={moodEntries} onEntryClick={handleHistoryEntryClick} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full mt-8">
              <div className="lg:col-span-2 flex flex-col gap-8">
                <div className="p-6 bg-white shadow-xl rounded-2xl"> {/* Increased border-radius */}
                  <div className="mb-6 text-center">
                    <h3 className="text-xl font-medium text-text-primary">
                      Logging mood for:{" "}
                      <span className="font-bold text-text-primary">
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
                  <div className="mt-8 flex justify-center">
                    <MoodLegend horizontal={true} />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-1 flex flex-col gap-8">
                <div className="p-6 bg-white shadow-xl rounded-2xl"> {/* Increased border-radius */}
                  <JournalInput
                    key={`journal-${selectedDate}`}
                    onSaveJournal={handleSaveJournal}
                    initialJournal={currentJournal}
                    moodSelected={selectedMood !== null}
                  />
                </div>
                <div className="p-6 bg-white shadow-xl rounded-2xl"> {/* Increased border-radius */}
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
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto pt-8 pb-6 text-center text-text-secondary text-sm">
        <p>© {new Date().getFullYear()} Emoji Mood Tracker. All rights reserved.</p>
        {/* Task 5.5: Add link to mental health resource */}
        <p className="mt-2">
          <a 
            href="https://www.mentalhealth.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary underline"
          >
            Need Support? Visit MentalHealth.com
          </a>
        </p>
      </footer>

      <Notification message={notification} />
    </div>
  );
}

export default App;
