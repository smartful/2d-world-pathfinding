import { a_star } from "./algorithms/a_star.js";
import {
  addRandomObstacles,
  addRandomWeightedCells,
  createAgentGrid,
  createGrid,
  printGrid,
  revealAroundAgent,
  setCell,
} from "./grid.js";
import {
  getExploredNodesCount,
  getPathCost,
  getPathLength,
} from "./metrics.js";
import { animateExploration, drawGrid } from "./render.js";
import { fromKeyToPosition, fromPositionToKey } from "./utils.js";
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

const agentGrid = createAgentGrid(grid, startPosition, goalPosition);
revealAroundAgent(grid, agentGrid, startPosition, 1);
printGrid(grid);
printGrid(agentGrid);
let agentPosition = { ...startPosition };

drawGrid(agentGrid, ctx, cellSize, new Set(), new Set(), agentPosition);

const params = new URLSearchParams(window.location.search);
const algorithm = params.get("algo") || "a_star_replanned";
const algoTitle = document.getElementById("algoTitle");
algoTitle.innerText = {
  a_star_replanned: "A* Replannifié",
}[algorithm];

const algoSelect = document.getElementById("algoSelect");
algoSelect.value = algorithm;

algoSelect.addEventListener("change", (e) => {
  const selectedAlgo = e.target.value;

  const params = new URLSearchParams(window.location.search);
  params.set("algo", selectedAlgo);

  window.location.search = params.toString();
});

let result = {
  found: false,
  explorationOrder: [],
  path: [],
};
switch (algorithm) {
  case "a_star_replanned":
    const globalExplorationOrder = [];
    const globalPath = [];
    while (fromPositionToKey(agentPosition) !== goalKey) {
      revealAroundAgent(grid, agentGrid, agentPosition, 1);
      printGrid(agentGrid);
      const localResult = a_star(
        agentGrid,
        fromPositionToKey(agentPosition),
        goalKey,
      );

      globalExplorationOrder.push(...localResult.explorationOrder);

      if (!localResult.found || localResult.path.length === 0) {
        console.log("Pas de chemin connu pour l'instant");
        result = {
          found: false,
          explorationOrder: globalExplorationOrder,
          path: globalPath,
        };
        break;
      }

      const nextKey = localResult.path[0];
      globalPath.push(nextKey);
      const nextPosition = fromKeyToPosition(nextKey);
      agentPosition = nextPosition;

      if (fromPositionToKey(agentPosition) === goalKey) {
        result = {
          found: true,
          explorationOrder: globalExplorationOrder,
          path: globalPath,
        };
      }
    }
    break;
  default:
    // result = bfs(grid, startKey, goalKey);
    break;
}

if (!result.found) {
  console.log("No path found.");
} else {
  console.log("Target found!");
  const pathCost = getPathCost(grid, result.path, startKey);
  const pathLength = getPathLength(result.path);
  const exploredNodesCount = getExploredNodesCount(result.explorationOrder);

  document.getElementById("pathLength").innerText = pathLength;
  document.getElementById("pathCost").innerText = pathCost.toFixed(2);
  document.getElementById("exploredNodes").innerText = exploredNodesCount;

  // animateExploration(
  //   agentGrid,
  //   ctx,
  //   cellSize,
  //   result.explorationOrder,
  //   result.path,
  // );
  drawGrid(
    agentGrid,
    ctx,
    cellSize,
    new Set(result.explorationOrder),
    new Set(result.path),
    agentPosition,
  );
}

const regenBtn = document.getElementById("regenBtn");

regenBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
});
