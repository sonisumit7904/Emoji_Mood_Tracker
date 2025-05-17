/**
 * Returns a date string in YYYY-MM-DD format
 */
export const formatDateToString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Returns today's date as a string in YYYY-MM-DD format
 */
export const getTodayString = (): string => {
  return formatDateToString(new Date());
};

/**
 * Returns the number of days in a month
 */
export const getDaysInMonth = (year: number, month: number): number => {
  // month is 0-indexed in JavaScript Date
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Returns the day of the week (0-6) for the first day of the month
 */
export const getFirstDayOfMonth = (year: number, month: number): number => {
  // month is 0-indexed in JavaScript Date
  return new Date(year, month, 1).getDay();
};

/**
 * Returns an array of month names
 */
export const getMonthNames = (): string[] => {
  return [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
};

/**
 * Returns an array of day names
 */
export const getDayNames = (): string[] => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
};

/**
 * Checks if a date is today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};