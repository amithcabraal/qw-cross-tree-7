import React, { useState } from 'react';
import { MenuIcon, HelpCircleIcon, MoonIcon, SunIcon, ShareIcon, ExpandIcon, ShrinkIcon } from './Icons';
import { useFullscreen } from '../hooks/useFullscreen';

interface MenuProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  shareUrl?: string;
}

const Menu: React.FC<MenuProps> = ({ isDarkMode, onToggleDarkMode, shareUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const handleShare = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.share({
        title: 'CrossTree Puzzle',
        text: 'Can you solve this CrossTree puzzle?',
        url: shareUrl,
      });
    } catch (err) {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 p-1.5 sm:p-2 rounded-full 
          ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} 
          shadow-lg hover:brightness-90 transition-all z-50`}
      >
        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
          <MenuIcon />
        </div>
      </button>

      {isOpen && (
        <div className={`fixed top-12 sm:top-14 md:top-16 right-2 sm:right-3 md:right-4 p-3 sm:p-4 rounded-lg shadow-xl z-50 text-sm sm:text-base
          ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
        >
          <button
            onClick={() => setShowHowToPlay(true)}
            className="flex items-center gap-2 w-full p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5">
              <HelpCircleIcon />
            </div>
            How to Play
          </button>

          <button
            onClick={onToggleDarkMode}
            className="flex items-center gap-2 w-full p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5">
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </div>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-2 w-full p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <div className="w-4 h-4 sm:w-5 sm:h-5">
              {isFullscreen ? <ShrinkIcon /> : <ExpandIcon />}
            </div>
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </button>

          {shareUrl && (
            <button
              onClick={handleShare}
              className="flex items-center gap-2 w-full p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5">
                <ShareIcon />
              </div>
              Share Puzzle
            </button>
          )}
        </div>
      )}

      {showHowToPlay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full p-4 sm:p-6 rounded-xl shadow-xl text-sm sm:text-base
            ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4">How to Play</h2>
            <ul className="space-y-2 mb-6">
              <li>• Each colored region must contain exactly one tree</li>
              <li>• Trees cannot share the same row or column</li>
              <li>• Trees cannot be placed in adjacent squares (including diagonally)</li>
              <li>• Click cells to cycle through: Empty → Tree → Marked (X)</li>
              <li>• Use marks (X) to eliminate cells that cannot contain a tree</li>
              <li>• Complete the puzzle before the timer runs out!</li>
            </ul>
            <button
              onClick={() => setShowHowToPlay(false)}
              className="w-full py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;