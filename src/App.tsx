import React, { useState } from 'react';
import { TreeIcon, PlayIcon, ResetIcon } from './components/Icons';
import Board from './components/Board';
import Timer from './components/Timer';
import Menu from './components/Menu';
import WelcomeScreen from './components/WelcomeScreen';
import VictoryScreen from './components/VictoryScreen';
import { useGameLogic } from './hooks/useGameLogic';

function App() {
  const { 
    state, 
    handleCellClick, 
    startGame, 
    resetGame, 
    handleTimeUp,
    updateTime,
    toggleDarkMode,
    toggleSolution,
  } = useGameLogic();

  const [showWelcome, setShowWelcome] = useState(true);

  // Get share URL with seed if game is started
  const shareUrl = state.isStarted && state.seed 
    ? `${window.location.origin}?seed=${state.seed}`
    : undefined;

  return (
    <div className={`min-h-screen transition-colors ${
      state.isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gradient-to-b from-green-900 to-green-700'
    }`}>
      <WelcomeScreen 
        onDismiss={() => setShowWelcome(false)}
        isDarkMode={state.isDarkMode}
      />

      {state.isWon && !state.showingSolution && (
        <VictoryScreen
          timeLeft={state.timeLeft}
          totalTime={180}
          treeCount={state.totalTreePlacements}
          onDismiss={resetGame}
          isDarkMode={state.isDarkMode}
          shareUrl={shareUrl}
        />
      )}

      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Menu 
          isDarkMode={state.isDarkMode}
          onToggleDarkMode={toggleDarkMode}
          shareUrl={shareUrl}
        />

        <div className={`rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-[min(100vw-2rem,90vh-8rem)] ${
          state.isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 ${state.isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                <TreeIcon />
              </div>
              <h1 className={`text-2xl sm:text-3xl font-bold ${
                state.isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>CrossTree</h1>
            </div>
            {state.isStarted && !state.isWon && !state.showingSolution && (
              <Timer 
                duration={180} 
                onTimeUp={handleTimeUp}
                onTimeChange={updateTime}
                isPaused={state.isWon || state.showingSolution} 
              />
            )}
          </div>

          <Board 
            board={state.board}
            territories={state.territories}
            errors={state.errors}
            territoryErrors={state.territoryErrors}
            onCellClick={handleCellClick}
            disabled={!state.isStarted || state.isTimeUp || state.isWon}
            isDarkMode={state.isDarkMode}
            errorMessage={state.errorMessage}
            solution={state.solution}
            showingSolution={state.showingSolution}
          />

          <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col items-center gap-4">
            {!state.isStarted ? (
              <button
                onClick={() => startGame()}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                <div className="w-4 h-4 sm:w-5 sm:h-5">
                  <PlayIcon />
                </div>
                Play Game
              </button>
            ) : (
              <>
                <div className="flex gap-2 sm:gap-4">
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                  >
                    <div className="w-4 h-4 sm:w-5 sm:h-5">
                      <ResetIcon />
                    </div>
                    Reset Game
                  </button>

                  <button
                    onClick={toggleSolution}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                  >
                    {state.showingSolution ? 'Hide Solution' : 'Show Solution'}
                  </button>
                </div>

                {state.isTimeUp && !state.isWon && !state.showingSolution && (
                  <div className="text-lg sm:text-xl font-bold text-red-600">
                    Time's up! Try again!
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;