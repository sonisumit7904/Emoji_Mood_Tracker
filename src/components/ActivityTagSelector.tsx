import React, { useState, useEffect } from 'react';
import WarningToast from './WarningToast';

interface Tag {
  id: string;
  name: string;
  isCustom?: boolean;
}

interface ActivityTagSelectorProps {
  availableTags: Tag[];
  selectedTags: string[];
  onTagSelectionChange: (selectedTags: string[]) => void;
  onAddCustomTag: (tagName: string) => void;
  onRemoveTag: (tagId: string) => void;
  moodSelected?: boolean;
}

const ActivityTagSelector: React.FC<ActivityTagSelectorProps> = ({ 
  availableTags, 
  selectedTags, 
  onTagSelectionChange, 
  onAddCustomTag,
  onRemoveTag,
  moodSelected = false
}) => {
  const [customTagInput, setCustomTagInput] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [showWarning, setShowWarning] = useState(false);

  const handleTagClick = (tagId: string) => {
    if (!moodSelected) {
      setWarningMessage('Please select a mood first before choosing tags.');
      setShowWarning(true);
      return;
    }
    
    const newSelectedTags = selectedTags.includes(tagId)
      ? selectedTags.filter(t => t !== tagId)
      : [...selectedTags, tagId];
    onTagSelectionChange(newSelectedTags);
  };

  const handleAddCustomTag = () => {
    if (!moodSelected) {
      setWarningMessage('Please select a mood first before adding custom tags.');
      setShowWarning(true);
      return;
    }
    
    if (customTagInput.trim() !== '' && !availableTags.find(tag => tag.name.toLowerCase() === customTagInput.trim().toLowerCase())) {
      onAddCustomTag(customTagInput.trim());
      setCustomTagInput('');
    }
  };

  const handleCloseWarning = () => {
    setShowWarning(false);
  };

  return (
    <>
      <div className="my-4 p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Add Activities/Tags:</h3>      
        <div className="flex flex-wrap gap-2 mb-3">
          {availableTags.map(tag => (
            <div key={tag.id} className="relative">
              <button
                type="button"
                onClick={() => handleTagClick(tag.id)}
                className={`${tag.isCustom ? 'pl-3 pr-5' : 'px-3'} py-1 text-sm rounded-full border transition-colors
                  ${selectedTags.includes(tag.id) 
                    ? 'bg-blue-500 text-white border-blue-500' 
                    : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'}
                `}
              >
                {tag.name}
              </button>
              {tag.isCustom && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTag(tag.id);
                  }}
                  className="absolute top-0 right-0 w-5 h-5 rounded-full flex items-center justify-center text-xs
                    hover:bg-red-500 hover:text-white transition-colors"
                  title={`Remove ${tag.name} tag`}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input 
            type="text"
            value={customTagInput}
            onChange={(e) => setCustomTagInput(e.target.value)}
            placeholder="Add custom tag..."
            className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm sm:text-sm"
          />
          <button 
            type="button"
            onClick={handleAddCustomTag}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-md shadow-sm transition-colors"
          >
            Add Tag
          </button>
        </div>
      </div>
      
      {/* Toast notification for warnings */}
      <WarningToast 
        message={warningMessage} 
        isVisible={showWarning} 
        onClose={handleCloseWarning}
      />
    </>
  );
};

export default ActivityTagSelector;
