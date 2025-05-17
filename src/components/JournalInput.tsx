import React, { useState, useEffect } from 'react';

interface JournalInputProps {
  onSaveJournal: (journal: string) => void;
  initialJournal?: string;
}

const JournalInput: React.FC<JournalInputProps> = ({ onSaveJournal, initialJournal = '' }) => {
  const [journal, setJournal] = useState(initialJournal);

  useEffect(() => {
    setJournal(initialJournal);
  }, [initialJournal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveJournal(journal);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 w-full">
      <label htmlFor="journal" className="block text-sm font-medium text-gray-700 mb-1">
        A few words about today? (Optional)
      </label>
      <textarea
        id="journal"
        name="journal"
        rows={3}
        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
        value={journal}
        onChange={(e) => setJournal(e.target.value)}
        placeholder="e.g., #work, #family, had a great day..."
      />
      <button
        type="submit"
        className="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Save Journal
      </button>
    </form>
  );
};

export default JournalInput;
