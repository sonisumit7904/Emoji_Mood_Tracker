import { MoodEntry } from "../types";

/**
 * Generates a random date within a specified range
 * @param start Start date
 * @param end End date
 * @returns Random date between start and end
 */
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

/**
 * Generates a random mood emoji
 * @returns Random emoji from the predefined set
 */
const randomEmoji = (): string => {
  const emojis = ["😀", "😊", "🙂", "😐", "😕", "😢", "😡", "😴", "🤒", "🥳"];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

/**
 * Generates random notes for mood entries
 * @returns Random mood note or empty string
 */
const randomNotes = (): string => {
  const notes = [
    "Had a great day today!",
    "Feeling productive and energetic.",
    "Just an average day, nothing special.",
    "Feeling a bit tired today.",
    "Stressed with work and deadlines.",
    "Had an argument with a friend.",
    "Not feeling well today.",
    "Celebrated a personal achievement!",
    "Spent quality time with family.",
    "Learned something new today!",
    "Feeling unmotivated.",
    "Completed an important project.",
    "Feeling anxious about upcoming events.",
    "",  // Empty notes sometimes
    ""   // Higher chance of empty notes
  ];
  return notes[Math.floor(Math.random() * notes.length)];
};

/**
 * Adds random mood data to localStorage for demonstration purposes
 * @param count Number of random entries to generate
 * @param timeSpan Number of days in the past to generate entries for (default: 365)
 */
export const addRandomMoodData = (count: number, timeSpan: number = 365): void => {
  const today = new Date();
  const startDate = new Date();
  startDate.setDate(today.getDate() - timeSpan);
  
  const moodEntries: Record<string, MoodEntry> = {};
  const usedDates: Set<string> = new Set();
  
  // Get existing entries if any
  const existingData = localStorage.getItem('emoji-mood-tracker');
  if (existingData) {
    try {
      const parsed = JSON.parse(existingData);
      Object.assign(moodEntries, parsed);
      
      // Add used dates to the set
      Object.keys(parsed).forEach(dateStr => usedDates.add(dateStr));
    } catch (e) {
      console.error('Error parsing existing mood data:', e);
    }
  }
  
  // Generate new random entries
  for (let i = 0; i < count; i++) {
    let date = randomDate(startDate, today);
    let dateStr = date.toISOString().split('T')[0];
    
    // Make sure we don't overwrite existing dates or duplicate new ones
    while (usedDates.has(dateStr)) {
      date = randomDate(startDate, today);
      dateStr = date.toISOString().split('T')[0];
    }
    
    usedDates.add(dateStr);
    
    moodEntries[dateStr] = {