import React from 'react';
import { TreeIcon, XIcon, WarningIcon } from './Icons';
import { Position, Territory, CellState } from '../types/game';

interface BoardProps {
  board: CellState[][];
  territories: Territory[];
  errors: Position[];
  territoryErrors: number[];
  onCellClick: (row: number, col: number) => void;
  disabled: boolean;
  isDarkMode: boolean;
  errorMessage?: string;
  solution?: Position[];
  showingSolution: boolean;
}

const TERRITORY_COLORS = {
  light: [
    'bg-red-300',
    'bg-blue-300',
    'bg-emerald-300',
    'bg-amber-300',
    'bg-purple-300',
    'bg-pink-300',
  ],
  dark: [
    'bg-red-800/40',
    'bg-blue-800/40',
    'bg-emerald-800/40',
    'bg-amber-800/40',
    'bg-purple-800/40',
    'bg-pink-800/40',
  ],
};

const TERRITORY_HIGHLIGHT_COLORS = {
  light: [
    'bg-red-200',
    'bg-blue-200',
    'bg-emerald-200',
    'bg-amber-200',
    'bg-purple-200',
    'bg-pink-200',
  ],
  dark: [
    'bg-red-700/30',
    'bg-blue-700/30',
    'bg-emerald-700/30',
    'bg-amber-700/30',
    'bg-purple-700/30',
    'bg-pink-700/30',
  ],
};

const Board: React.FC<BoardProps> = ({ 
  board, 
  territories, 
  errors, 
  territoryErrors, 
  onCellClick, 
  disabled,
  isDarkMode,
  errorMessage,
  solution,
  showingSolution,
}) => {
  const getTerritoryId = (row: number, col: number): number => {
    return territories.findIndex(t => 
      t.cells.some(cell => cell.row === row && cell.col === col)
    );
  };

  const isError = (row: number, col: number) => {
    return errors.some(err => err.row === row && err.col === col);
  };

  const isTerritoryError = (row: number, col: number) => {
    const territoryId = getTerritoryId(row, col);
    return territoryErrors.includes(territoryId);
  };

  const isSolutionTree = (row: number, col: number) => {
    return solution?.some(pos => pos.row === row && pos.col === col);
  };

  const shouldHighlightTerritory = (territoryId: number): boolean => {
    if (territoryId < 0 || territoryId >= territories.length) return false;
    return territories[territoryId].cells.some(
      cell => board[cell.row][cell.col] === 'tree'
    );
  };

  const colorScheme = isDarkMode ? TERRITORY_COLORS.dark : TERRITORY_COLORS.light;
  const highlightColorScheme = isDarkMode ? TERRITORY_HIGHLIGHT_COLORS.dark : TERRITORY_HIGHLIGHT_COLORS.light;

  const getStatusMessage = () => {
    if (errorMessage) return errorMessage;
    if (showingSolution) return "Here's the solution! Click again to return to your attempt.";
    return "Place exactly one tree in each territory. Trees can't share rows, columns, or be adjacent.";
  };

  return (
    <div className="space-y-2 sm:space-y-4">
      <style>{`
        .row-highlight { box-shadow: inset 0 0 0 2px rgba(239, 68, 68, 0.3); }
        .col-highlight { box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.3); }
        .adjacent-highlight { box-shadow: inset 0 0 0 2px rgba(245, 158, 11, 0.3); }
      `}</style>

      <div className={`h-8 sm:h-12 flex items-center justify-center ${
        isDarkMode ? 'text-gray-200' : 'text-gray-700'
      }`}>
        <div className={`text-center p-2 rounded w-full text-sm sm:text-base ${
          errorMessage 
            ? isDarkMode ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-600'
            : isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          {getStatusMessage()}
        </div>
      </div>

      <div className="grid gap-0.5 w-full aspect-square" style={{ gridTemplateColumns: `repeat(${board.length}, minmax(0, 1fr))` }}>
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            const territoryId = getTerritoryId(rowIndex, colIndex);
            const hasError = isError(rowIndex, colIndex);
            const hasTerritoryError = isTerritoryError(rowIndex, colIndex);
            const isInSolution = isSolutionTree(rowIndex, colIndex);
            const showTree = showingSolution ? isInSolution : cell === 'tree';
            const isHighlighted = shouldHighlightTerritory(territoryId);
            const colorIndex = Math.max(0, territoryId % colorScheme.length);

            return (
              <button
                key={`${rowIndex}-${colIndex}`}
                onClick={() => onCellClick(rowIndex, colIndex)}
                disabled={disabled && !showingSolution}
                className={`
                  aspect-square p-1 rounded transition-all duration-200
                  ${isHighlighted ? highlightColorScheme[colorIndex] : colorScheme[colorIndex]}
                  ${hasError || hasTerritoryError ? 'ring-2 ring-red-500' : 'hover:brightness-95'}
                  ${disabled && !showingSolution ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
                  ${(hasError || hasTerritoryError) && 'animate-pulse'}
                  ${isInSolution && showingSolution && 'ring-2 ring-green-500'}
                  relative
                `}
              >
                <div className={`w-full h-full ${isDarkMode ? 'text-gray-200' : 'text-gray-700'} 
                  ${showTree && 'animate-bounce-once'}`}>
                  {showTree && (hasError || hasTerritoryError ? <WarningIcon /> : <TreeIcon />)}
                  {cell === 'marked' && !showingSolution && <XIcon />}
                </div>
              </button>
            );
          })
        ))}
      </div>
    </div>
  );
};

export default Board;