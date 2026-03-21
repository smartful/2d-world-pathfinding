import { bfs } from "./algorithms/bfs.js";
import { dijkstra } from "./algorithms/dijkstra.js";
import { a_star } from "./algorithms/a_star.js";
import {
  addRandomObstacles,
  addRandomWeightedCells,
  createGrid,
  setCell,
} from "./grid.js";
import {
  getExploredNodesCount,
  getPathCost,
  getPathLength,
} from "./metrics.js";
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
const startPosition = { x: 1, y: 1 };
const goalPosition = { x: 10, y: 6 };

const startKey = fromPositionToKey(startPosition);
const goalKey = fromPositionToKey(goalPosition);

const STORAGE_KEY = "2d-world-grid";

let grid;
const savedGrid = localStorage.getItem(STORAGE_KEY);
if (savedGrid) {
  grid = JSON.parse(savedGrid);
} else {
  grid = createGrid(width, height);
  const forbidden = new Set([startKey, goalKey]);
  addRandomObstacles(grid, 0.15, forbidden);
  addRandomWeightedCells(grid, 0.2, forbidden);
  setCell(grid, startPosition, "S");
  setCell(grid, goalPosition, "G");

  localStorage.setItem(STORAGE_KEY, JSON.stringify(grid));
}

drawGrid(grid, ctx, cellSize);

const params = new URLSearchParams(window.location.search);
const algorithm = params.get("algo") || "bfs";
const algoTitle = document.getElementById("algoTitle");
algoTitle.innerText = {
  bfs: "Breadth First Search",
  dijkstra: "Dijkstra",
  a_star: "A*",
}[algorithm];

const algoSelect = document.getElementById("algoSelect");
algoSelect.value = algorithm;

algoSelect.addEventListener("change", (e) => {
  const selectedAlgo = e.target.value;

  const params = new URLSearchParams(window.location.search);
  params.set("algo", selectedAlgo);

  window.location.search = params.toString();
});

let result;
switch (algorithm) {
  case "bfs":
    result = bfs(grid, startKey, goalKey);
    break;
  case "dijkstra":
    result = dijkstra(grid, startKey, goalKey);
    break;
  case "a_star":
    result = a_star(grid, startKey, goalKey);
    break;
  default:
    result = bfs(grid, startKey, goalKey);
    break;
}

if (!result.found) {
  console.log("No path found.");
} else {
  console.log("Target found!");
  const pathCost = getPathCost(grid, result.path);
  const pathLength = getPathLength(result.path);
  const exploredNodesCount = getExploredNodesCount(result.explorationOrder);

  document.getElementById("pathLength").innerText = pathLength;
  document.getElementById("pathCost").innerText = pathCost;
  document.getElementById("exploredNodes").innerText = exploredNodesCount;

  animateExploration(grid, ctx, cellSize, result.explorationOrder, result.path);
}

const regenBtn = document.getElementById("regenBtn");

regenBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
});
