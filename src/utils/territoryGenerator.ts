import { Territory, Position } from '../types/game';
import { isPuzzleSolvable } from './puzzleValidator';
import { BOARD_SIZE, REQUIRED_TERRITORIES } from './boardUtils';

class Random {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }
}

function getRandomInt(random: Random, min: number, max: number): number {
  return Math.floor(random.next() * (max - min + 1)) + min;
}

function getAdjacentCells(pos: Position, size: number): Position[] {
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  return directions
    .map(([dx, dy]) => ({
      row: pos.row + dx,
      col: pos.col + dy
    }))
    .filter(({row, col}) => 
      row >= 0 && row < size && col >= 0 && col < size
    );
}

function isConnected(cells: Position[]): boolean {
  if (cells.length === 0) return true;
  if (cells.length === 1) return true;

  const visited = new Set<string>();
  const queue: Position[] = [cells[0]];
  visited.add(`${cells[0].row},${cells[0].col}`);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const adjacent = getAdjacentCells(current, BOARD_SIZE);

    for (const adj of adjacent) {
      const key = `${adj.row},${adj.col}`;
      if (!visited.has(key) && cells.some(c => c.row === adj.row && c.col === adj.col)) {
        visited.add(key);
        queue.push(adj);
      }
    }
  }

  return visited.size === cells.length;
}

function generateTerritorySet(random: Random): Territory[] {
  const territories: Territory[] = [];
  const used = new Set<string>();

  // Create initial territories with single cells
  for (let i = 0; i < REQUIRED_TERRITORIES; i++) {
    let cell: Position;
    do {
      cell = {
        row: getRandomInt(random, 0, BOARD_SIZE - 1),
        col: getRandomInt(random, 0, BOARD_SIZE - 1)
      };
    } while (used.has(`${cell.row},${cell.col}`));

    territories.push({
      id: i,
      cells: [cell],
      seed: random.next()
    });
    used.add(`${cell.row},${cell.col}`);
  }

  // Distribute remaining cells
  const remainingCells: Position[] = [];
  for (let row = 0; row < BOARD_SIZE; row++) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      if (!used.has(`${row},${col}`)) {
        remainingCells.push({ row, col });
      }
    }
  }

  // Randomly assign remaining cells to adjacent territories
  while (remainingCells.length > 0) {
    const cellIndex = getRandomInt(random, 0, remainingCells.length - 1);
    const cell = remainingCells[cellIndex];
    
    // Find adjacent territories
    const adjacentTerritories = territories.filter(territory =>
      territory.cells.some(tcell =>
        getAdjacentCells(cell, BOARD_SIZE).some(adj =>
          adj.row === tcell.row && adj.col === tcell.col
        )
      )
    );

    if (adjacentTerritories.length > 0) {
      // Add to random adjacent territory
      const territory = adjacentTerritories[getRandomInt(random, 0, adjacentTerritories.length - 1)];
      territory.cells.push(cell);
      used.add(`${cell.row},${cell.col}`);
      remainingCells.splice(cellIndex, 1);
    } else {
      // If no adjacent territories, add to closest territory
      let minDist = Infinity;
      let closestTerritory = territories[0];
      
      for (const territory of territories) {
        for (const tcell of territory.cells) {
          const dist = Math.abs(tcell.row - cell.row) + Math.abs(tcell.col - cell.col);
          if (dist < minDist) {
            minDist = dist;
            closestTerritory = territory;
          }
        }
      }
      
      closestTerritory.cells.push(cell);
      used.add(`${cell.row},${cell.col}`);
      remainingCells.splice(cellIndex, 1);
    }
  }

  // Ensure all territories are connected
  for (const territory of territories) {
    if (!isConnected(territory.cells)) {
      return generateTerritorySet(random); // Try again if any territory is not connected
    }
  }

  return territories;
}

export function generateTerritories(size: number, count: number, seed: number): Territory[] {
  const random = new Random(seed);
  const maxAttempts = 20;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const territories = generateTerritorySet(random);
      if (isPuzzleSolvable(territories, size)) {
        return territories;
      }
    } catch (error) {
      console.error('Failed attempt:', error);
    }
  }

  throw new Error('Failed to generate a solvable puzzle');
}