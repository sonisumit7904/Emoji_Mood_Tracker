# Emoji Mood Tracker

## Description
Emoji Mood Tracker is a user-friendly application designed to help you track your daily moods, jot down thoughts in a journal, and associate activities with your entries. Visualize your mood patterns over time with an interactive calendar and charts. Built with React, TypeScript, and Vite, it offers a fast and modern experience.

## Live Demo / Screenshots
Check out our guide video to see Emoji Mood Tracker in action:

https://github.com/user/EmojiMoodTracker/assets/videos/Emoji_Mood_Tracker_Intro.mp4

If the video above doesn't play, you can download it directly from [here](./Emoji_Mood_Tracker_Intro.mp4).

## Features
- **Daily Mood Logging:** Easily select an emoji representing your mood for any given day.
- **Journaling:** Add private notes and reflections to your daily mood entries.
- **Activity Tagging:** Associate activities (e.g., Work, Exercise, Hobby) with your mood entries to identify patterns.
- **Customizable Activity Tags:** Add your own custom tags to personalize your tracking.
- **Interactive Calendar View:** Navigate through months and select specific dates to log or view moods.
- **"Year in Pixels" View:** Get a colorful overview of your moods throughout the year.
- **Monthly Mood Chart:** Visualize the distribution of your moods for the current month.
- **Data Persistence:** Moods, journal entries, and custom tags are saved locally in your browser using `localStorage`.
- **Notifications:** Get feedback on actions like saving moods or journals.

## Tech Stack
- **Frontend:** React, TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Charting:** Chart.js
- **Icons:** Lucide React
- **Linting/Formatting:** ESLint

## Getting Started

### Prerequisites
- Node.js (v18.x or later recommended)
- npm (or yarn/pnpm)

### Installation
1. Clone the repository (if applicable) or download the source code.
2. Navigate to the project directory:
   ```bash
   cd EmojiMoodTracker
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server
To start the development server and view the application in your browser:
```bash
npm run dev
```
This will typically open the app at `http://localhost:5173`.

### Building for Production
To create an optimized production build:
```bash
npm run build
```
The build artifacts will be located in the `dist/` directory. You can preview the production build locally using:
```bash
npm run preview
```

## Usage
1.  **Open the App:** Launch the application in your browser.
2.  **Select a Date:** Use the calendar to navigate to the desired date. By default, today's date is selected.
3.  **Choose a Mood:** Click on an emoji that best represents your mood for the selected day.
4.  **Write a Journal Entry (Optional):** Type your thoughts or notes related to your mood in the journal section. The journal saves automatically as you type if a mood has been selected.
5.  **Add Activity Tags (Optional):** Select from predefined tags or add your own custom tags to categorize your entry.
6.  **View Mood History:**
    *   Click on different dates in the calendar to see past entries.
    *   Toggle the "Year in Pixels" view to see an annual overview.
    *   Toggle the "Monthly Mood Chart" to see a chart of your moods for the selected month.
7.  **Manage Custom Tags:** Add new tags via the input field in the `ActivityTagSelector` or remove custom tags by clicking the 'x' next to them.

## Folder Structure
```
EmojiMoodTracker/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Image assets (if any)
│   ├── components/          # React components
│   │   ├── ActivityTagSelector.tsx
│   │   ├── Calendar.tsx
│   │   ├── CalendarDay.tsx
│   │   ├── EmojiSelector.tsx
│   │   ├── JournalInput.tsx
│   │   ├── MoodChart.tsx
│   │   ├── MoodLegend.tsx
│   │   ├── Notification.tsx
│   │   ├── WarningToast.tsx
│   │   └── YearInPixels.tsx
│   ├── types/               # TypeScript type definitions (types.ts)
│   ├── utils/               # Utility functions
│   │   ├── dateUtils.ts     # Date manipulation helpers
│   │   ├── localStorage.ts  # localStorage interaction
│   │   └── moodUtils.ts     # Mood-related helpers
│   ├── App.tsx              # Main application component
│   ├── index.css            # Global styles and Tailwind directives
│   ├── main.tsx             # Entry point of the React application
│   └── vite-env.d.ts        # Vite environment types
├── .eslintrc.cjs            # ESLint configuration
├── index.html               # Main HTML file
├── package.json             # Project metadata and dependencies
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript compiler options
├── tsconfig.node.json       # TypeScript Node specific config
└── vite.config.ts           # Vite configuration
```

## How it Works (for Developers/Judges)

### State Management
The application primarily uses React's built-in state management (`useState`, `useEffect`). The main state, including mood entries, selected dates, current journal text, and tags, is managed within the `App.tsx` component.

### Data Persistence
-   All mood entries (mood, journal text, associated tags) and user-created custom tags are stored in the browser's `localStorage`.
-   Utility functions in `src/utils/localStorage.ts` handle the saving and retrieval of this data.
-   Data is loaded from `localStorage` when the application starts and updated whenever a user logs a mood, saves a journal, or modifies tags.

### Key Components
-   **`App.tsx`**: The root component orchestrating the entire application, managing state, and handling logic for mood selection, journaling, tag management, and date navigation.
-   **`Calendar.tsx`**: Renders the monthly calendar grid, allowing users to select dates and displaying mood colors for logged days.
-   **`EmojiSelector.tsx`**: Displays the available mood emojis for selection.
-   **`JournalInput.tsx`**: A text area for users to write their journal entries.
-   **`ActivityTagSelector.tsx`**: Allows users to select from existing activity tags or create and add new custom tags.
-   **`MoodChart.tsx`**: Displays a chart (likely a pie or bar chart using Chart.js) summarizing mood distribution for the selected month.
-   **`YearInPixels.tsx`**: Provides a compact, year-long visualization of daily moods.
-   **`Notification.tsx`**: Displays temporary messages to the user (e.g., "Mood saved!").

### Date and Mood Utilities
-   `src/utils/dateUtils.ts`: Contains helper functions for formatting dates, getting month names, days in a month, etc.
-   `src/utils/moodUtils.ts`: May contain utilities related to mood data, colors, or processing (if any specific logic is centralized there).

## Potential Future Enhancements
-   **Cloud Sync:** Allow users to back up and sync their data across devices.
-   **Advanced Analytics:** Provide more detailed insights and trends (e.g., mood correlation with specific activities).
-   **Themes:** Offer different color themes for the application.
-   **Reminders/Notifications:** Implement daily reminders to log mood.
-   **Export Data:** Allow users to export their mood data (e.g., as CSV or JSON).
-   **Password Protection/Privacy Features:** Enhance privacy for sensitive journal entries.
-   **Internationalization (i18n):** Support for multiple languages.
-   **Accessibility (a11y) Improvements:** Further enhancements to ensure the app is usable by everyone.

## Contributing
Contributions are welcome! If you have suggestions for improvements or want to fix a bug, please feel free to:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature` or `bugfix/YourBugfix`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature/YourFeature`).
6. Open a Pull Request.

Please ensure your code adheres to the existing coding style and passes linting checks.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details (if you choose to add one).

---

*This README was generated with assistance from an AI coding assistant.*
