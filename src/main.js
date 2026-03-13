// import { bfs } from "./algorithms/bfs.js";
import { dijkstra } from "./algorithms/dijkstra.js";
import {
  addRandomObstacles,
  addRandomWeightedCells,
  createGrid,
  setCell,
} from "./grid.js";
import { animateExploration, drawGrid } from "./render.js";
import { fromPositionToKey } from "./utils.js";
import "./style.css";

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
addRandomObstacles(grid, 0.15, forbidden);
addRandomWeightedCells(grid, 0.2, forbidden);
setCell(grid, startPosition, "S");
setCell(grid, goalPosition, "G");

drawGrid(grid, ctx, cellSize);

const { found, explorationOrder, path } = dijkstra(grid, startKey, goalKey);

if (!found) {
  console.log("No path found.");
} else {
  console.log("Target found!");
  animateExploration(grid, ctx, cellSize, explorationOrder, path);
}
