import "./style.css";
import {
  addRandomObstacles,
  createGrid,
  getCell,
  getNeighborsPositions,
  setCell,
} from "./grid.js";
import { animateExploration, drawGrid } from "./render.js";
import { fromKeyToPosition, fromPositionToKey } from "./utils.js";

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

drawGrid(grid, ctx, cellSize);

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
  animateExploration(grid, ctx, cellSize, explorationOrder, path);
}
