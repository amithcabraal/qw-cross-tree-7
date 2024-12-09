import React, { useEffect, useState } from 'react';
import { TreeIcon, XIcon } from './Icons';

interface WelcomeScreenProps {
  onDismiss: () => void;
  isDarkMode: boolean;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onDismiss, isDarkMode }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setIsVisible(false);
    onDismiss();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-lg w-full p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl text-sm sm:text-base
        ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
              <TreeIcon />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">CrossTree</h1>
          </div>
          <button 
            onClick={handleDismiss}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6">
              <XIcon />
            </div>
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <p className="text-base sm:text-lg font-medium">Welcome to CrossTree, a unique puzzle game where logic meets nature!</p>
          
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold">How to Play:</h2>
            <ul className="list-disc list-inside space-y-1.5 sm:space-y-2">
              <li>Each colored region must contain exactly one tree</li>
              <li>Trees cannot share the same row or column</li>
              <li>Trees cannot be placed in adjacent squares (including diagonally)</li>
              <li>Click cells to cycle through: Empty → Tree → Marked (X)</li>
              <li>Complete the puzzle before the timer runs out!</li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="w-full py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
        >
          Start Playing
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;