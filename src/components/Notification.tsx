import React, { useEffect, useState } from 'react';

interface NotificationProps {
  message: string | null;
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  if (!message) return null;
  
  return (
    <div 
      className={`
        fixed bottom-4 left-1/2 transform -translate-x-1/2
        bg-blue-500 text-white px-4 py-2 rounded-md shadow-lg
        transition-opacity duration-300
        ${visible ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {message}
    </div>
  );
};

export default Notification;