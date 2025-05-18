import React, { useEffect, useState } from 'react';

interface WarningToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  autoHideDuration?: number;
}

const WarningToast: React.FC<WarningToastProps> = ({ 
  message, 
  isVisible, 
  onClose,
  autoHideDuration = 3000 
}) => {
  const [animation, setAnimation] = useState<'slide-in' | 'slide-out'>('slide-in');
  
  useEffect(() => {
    if (isVisible) {
      setAnimation('slide-in');
      const timer = setTimeout(() => {
        setAnimation('slide-out');
        setTimeout(onClose, 300); 
      }, autoHideDuration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHideDuration, onClose]);

  if (!isVisible) return null;
  
  return (
    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 ${animation === 'slide-in' ? 'animate-slide-in' : 'animate-slide-out'}`}>
      <div className="bg-amber-50 border-l-4 border-amber-500 text-amber-800 p-4 rounded-md shadow-md flex items-center min-w-[300px]">
        <div className="mr-3 text-amber-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <p className="font-medium">{message}</p>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setAnimation('slide-out');
            setTimeout(onClose, 300);
          }} 
          className="ml-auto text-amber-500 hover:text-amber-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default WarningToast;