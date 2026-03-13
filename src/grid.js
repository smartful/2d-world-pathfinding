import { fromPositionToKey } from "./utils";

export const createGrid = (width, height, fill = ".") => {
  return Array.from({ length: height }, () => Array(width).fill(fill));
};

export const printGrid = (grid) => {
  console.log(grid.map((row) => row.join(" ")).join("\n"));
};

export const inBounds = (grid, position) => {
  return (
    position.x >= 0 &&
    position.x < grid[0].length &&
    position.y >= 0 &&
    position.y < grid.length
  );
};

export const getCell = (grid, position) => {
  if (!inBounds(grid, position)) {
    throw new Error(`Out of bounds : ${fromPositionToKey(position)}`);
  }
  return grid[position.y][position.x];
};

export const setCell = (grid, position, value) => {
  if (!inBounds(grid, position)) {
    throw new Error(`Out of bounds : ${fromPositionToKey(position)}`);
  }
  grid[position.y][position.x] = value;
};

export const addRandomObstacles = (
  grid,
  ratio = 0.2,
  forbidden = new Set(),
) => {
  const height = grid.length;
  const width = grid[0].length;
  const total = height * width;
  const obstaclesCount = Math.floor(total * ratio);

  let placed = 0;
  while (placed < obstaclesCount) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const key = `${x},${y}`;
    if (forbidden.has(key)) continue;
    if (grid[y][x] === ".") {
      grid[y][x] = "#";
      placed++;
    }
  }
};

export const addRandomWeightedCells = (
  grid,
  ratio = 0.2,
  forbidden = new Set(),
) => {
  const height = grid.length;
  const width = grid[0].length;
  const total = height * width;
  const obstaclesCount = Math.floor(total * ratio);

  let placed = 0;
  while (placed < obstaclesCount) {
    const x = Math.floor(Math.random() * width);
    const y = Math.floor(Math.random() * height);
    const key = `${x},${y}`;
    if (forbidden.has(key)) continue;
    if (grid[y][x] === ".") {
      grid[y][x] = "~";
      placed++;
    }
  }
};

export const isCorrectMovement = (grid, newPosition, obstacle = "#") => {
  return inBounds(grid, newPosition) && getCell(grid, newPosition) !== obstacle;
};

export const getNeighborsPositions = (grid, position) => {
  const neighbors = [];
  const topPosition = { x: position.x, y: position.y - 1 };
  const rightPosition = { x: position.x + 1, y: position.y };
  const bottomPosition = { x: position.x, y: position.y + 1 };
  const leftPosition = { x: position.x - 1, y: position.y };
  if (isCorrectMovement(grid, topPosition)) neighbors.push(topPosition);
  if (isCorrectMovement(grid, rightPosition)) neighbors.push(rightPosition);
  if (isCorrectMovement(grid, bottomPosition)) neighbors.push(bottomPosition);
  if (isCorrectMovement(grid, leftPosition)) neighbors.push(leftPosition);

  return neighbors;
};

export const getMovementCost = (grid, position) => {
  const cell = getCell(grid, position);

  if (cell === "~") return 5;
  if (cell === "#") return Infinity;

  return 1;
};
