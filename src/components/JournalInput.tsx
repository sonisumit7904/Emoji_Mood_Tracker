import React, { useState, useEffect } from 'react';
import WarningToast from './WarningToast';

interface JournalInputProps {
  onSaveJournal: (journal: string) => void;
  initialJournal?: string;
  moodSelected?: boolean; 
}

const MAX_JOURNAL_LENGTH = 100; 

const JournalInput: React.FC<JournalInputProps> = ({ 
  onSaveJournal, 
  initialJournal = '',
  moodSelected = false 
}) => {
  const [journal, setJournal] = useState(initialJournal);
  const [warningMessage, setWarningMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setJournal(initialJournal);
  }, [initialJournal]);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!moodSelected) {
      setWarningMessage("Please select a mood first before saving your journal entry.");
      setShowWarning(true);
      return;
    }
    
    onSaveJournal(journal.trim());
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJournal(e.target.value);
  };

  const handleCloseWarning = () => {
    setShowWarning(false);
  };

  const charsLeft = MAX_JOURNAL_LENGTH - journal.length;

  return (
    <>
      <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-lg w-full">
        <label htmlFor="journalEntry" className="block text-sm font-medium text-gray-700 mb-1">
          A few words about today? (Optional)
        </label>
        <textarea
          id="journalEntry"
          value={journal}
          onChange={handleChange}
          placeholder="Few words or #tags (max 100 chars): e.g., #work, #travel, today happy - travel"
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
          maxLength={MAX_JOURNAL_LENGTH} 
        />
        <div className="text-xs text-gray-500 mt-1 text-right">
          {charsLeft} characters remaining
        </div>
        <button
          type="submit"
          className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Journal
        </button>
      </form>

      <WarningToast 
        message={warningMessage} 
        isVisible={showWarning} 
        onClose={handleCloseWarning}
      />
    </>
  );
};

export default JournalInput;
