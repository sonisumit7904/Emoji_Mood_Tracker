/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary': '#3B82F6',        // New: Was brand-blue
        'accent': '#10B981',         // New: Was brand-teal
        'background': '#F3F4F6',     // New: Was brand-background
        'text-primary': '#1F2937',   // New: Was brand-text
        'text-secondary': '#4B5563', // New: For secondary text
        // Mood colors - Retained
        'mood-veryhappy': '#60a5fa',
        'mood-happy': '#34d399',
        'mood-neutral': '#facc15',
        'mood-sad': '#fb923c',
        'mood-verysad': '#f87171',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Added Inter font
      },
    },
  },
  plugins: [],
};
