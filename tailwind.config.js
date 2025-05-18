/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#4A90E2',        // Calming Blue
        'accent': '#50E3C2',         // Vibrant Teal
        'background': '#F7F9FA',     // Light Gray
        'text-primary': '#333333',   // Dark Gray
        'text-secondary': '#767676', // Medium Gray
        // Mood colors - Retained
        'mood-veryhappy': '#60A5FA', // Blue 500
        'mood-happy': '#34D399',     // Green 400
        'mood-neutral': '#FACC15',   // Yellow 400
        'mood-sad': '#FB923C',       // Orange 400
        'mood-verysad': '#F87171',   // Red 400
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Added Inter font
      },
      spacing: { // Added for consistent spacing - Task 1.2
        '128': '32rem',
      },
      borderRadius: { // Added for consistent UI components - Task 1.4
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
};
