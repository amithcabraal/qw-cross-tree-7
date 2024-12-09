import React from 'react';
import { TreeIcon, ShareIcon } from './Icons';

interface VictoryScreenProps {
  timeLeft: number;
  totalTime: number;
  treeCount: number;
  onDismiss: () => void;
  isDarkMode: boolean;
  shareUrl?: string;
}

const VictoryScreen: React.FC<VictoryScreenProps> = ({ 
  timeLeft, 
  totalTime, 
  treeCount,
  onDismiss,
  isDarkMode,
  shareUrl
}) => {
  const timeTaken = totalTime - timeLeft;
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;

  const handleShare = async () => {
    if (!shareUrl) return;
    
    try {
      await navigator.share({
        title: 'CrossTree Puzzle',
        text: `I solved the CrossTree puzzle in ${minutes}:${String(seconds).padStart(2, '0')} with ${treeCount} tree placements!`,
        url: shareUrl,
      });
    } catch (err) {
      // Fallback to clipboard
      navigator.clipboard.writeText(
        `I solved the CrossTree puzzle in ${minutes}:${String(seconds).padStart(2, '0')} with ${treeCount} tree placements! Try it at: ${shareUrl}`
      );
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`max-w-md w-full p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl text-center text-sm sm:text-base
        ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
      >
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className={`w-12 h-12 sm:w-16 sm:h-16 ${isDarkMode ? 'text-green-400' : 'text-green-600'} animate-bounce`}>
            <TreeIcon />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Congratulations!</h2>
        <p className="text-base sm:text-lg mb-4 sm:mb-6">You've mastered the CrossTree puzzle!</p>

        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <div className={`p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <div className="text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
            <div className="text-xs sm:text-sm opacity-75">Time Taken</div>
          </div>

          <div className={`p-3 sm:p-4 rounded-lg ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <div className="text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1">{treeCount}</div>
            <div className="text-xs sm:text-sm opacity-75">Total Tree Placements</div>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {shareUrl && (
            <button
              onClick={handleShare}
              className="w-full py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <div className="w-4 h-4 sm:w-5 sm:h-5">
                <ShareIcon />
              </div>
              Share Victory
            </button>
          )}

          <button
            onClick={onDismiss}
            className="w-full py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryScreen;