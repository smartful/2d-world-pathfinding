import "./style.css";
import {
  addRandomObstacles,
  createGrid,
  fromKeyToPosition,
  fromPositionToKey,
  getCell,
  getNeighborsPositions,
  setCell,
} from "./utils.js";

// Canvas
const width = 12;
const height = 8;
const cellSize = 50;

const canvas = document.getElementById("gridCanvas");
const ctx = canvas.getContext("2d");

canvas.width = width * cellSize;
canvas.height = height * cellSize;

// Init
const grid = createGrid(width, height);

const startPosition = { x: 1, y: 1 };
const goalPosition = { x: 10, y: 6 };

const startKey = fromPositionToKey(startPosition);
const goalKey = fromPositionToKey(goalPosition);

const forbidden = new Set([startKey, goalKey]);
addRandomObstacles(grid, 0.25, forbidden);
setCell(grid, startPosition, "S");
setCell(grid, goalPosition, "G");

// Some graphical utils
const drawGrid = (grid) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const cell = getCell(grid, { x, y });

      if (cell === "#") ctx.fillStyle = "#444";
      else if (cell === "S") ctx.fillStyle = "#3b82f6";
      else if (cell === "G") ctx.fillStyle = "#22c55e";
      else if (cell === "V") ctx.fillStyle = "#a855f7";
      else if (cell === "*") ctx.fillStyle = "#facc15";
      else ctx.fillStyle = "#e5e7eb";

      ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

      ctx.strokeStyle = "#222";
      ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
};

const animateExploration = (grid, explorationOrder, path, index = 0) => {
  if (index >= explorationOrder.length) {
    animatePath(grid, path);
    return;
  }

  const key = explorationOrder[index];
  const position = fromKeyToPosition(key);
  const cell = getCell(grid, position);

  if (cell === ".") {
    setCell(grid, position, "V");
  }

  drawGrid(grid);

  setTimeout(() => {
    animateExploration(grid, explorationOrder, path, index + 1);
  }, 150);
};

const animatePath = (grid, path, index = 0) => {
  if (index >= path.length) {
    drawGrid(grid);
    return;
  }

  const key = path[index];
  const position = fromKeyToPosition(key);
  const cell = getCell(grid, position);

  if (cell === "." || cell === "V") {
    setCell(grid, position, "*");
  }

  drawGrid(grid);

  setTimeout(() => {
    animatePath(grid, path, index + 1);
  }, 120);
};

drawGrid(grid);

/* BFS */
const explorationQueue = [startKey];
const visited = new Set([startKey]);
const explorationOrder = [];
const cameFrom = new Map(); // childKey -> parentKey

let found = false;

while (explorationQueue.length > 0) {
  const currentKey = explorationQueue.shift();
  explorationOrder.push(currentKey);

  if (currentKey === goalKey) {
    found = true;
    break;
  }

  const currentPosition = fromKeyToPosition(currentKey);
  const neighborPositions = getNeighborsPositions(grid, currentPosition);

  for (let neighborPosition of neighborPositions) {
    const neighborKey = fromPositionToKey(neighborPosition);
    if (visited.has(neighborKey)) continue;
    cameFrom.set(neighborKey, currentKey);
    visited.add(neighborKey);
    explorationQueue.push(neighborKey);
  }
}

let path = [];
if (!found) {
  console.log("No path found.");
} else {
  console.log("Target found!");

  // Reconstruct path: goal -> start
  const reversePath = [];
  let parent;
  let current = goalKey;

  while (parent !== startKey) {
    reversePath.push(current);
    parent = cameFrom.get(current);
    if (!parent) break;
    current = parent;
  }

  path = reversePath.reverse();
  animateExploration(grid, explorationOrder, path);
}
