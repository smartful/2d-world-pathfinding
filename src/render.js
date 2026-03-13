import { getCell, setCell } from "./grid";
import { fromKeyToPosition, fromPositionToKey } from "./utils";

export const drawGrid = (
  grid,
  context,
  cellSize,
  visitedCells = new Set(),
  pathCells = new Set(),
) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const position = { x, y };
      const key = fromPositionToKey(position);
      const cell = getCell(grid, position);

      // 1) Base terrain
      if (cell === "#") context.fillStyle = "#444";
      else if (cell === "S") context.fillStyle = "#3b82f6";
      else if (cell === "G") context.fillStyle = "#22c55e";
      else if (cell === "~") context.fillStyle = "#8f7450";
      else context.fillStyle = "#e5e7eb";

      context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

      // 2) Overlay visited
      if (visitedCells.has(key)) {
        context.fillStyle = "rgba(169, 85, 247, 0.45)";
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }

      // 3) Overlay path
      if (pathCells.has(key)) {
        context.fillStyle = "rgba(250, 204, 21, 0.55)";
        context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }

      // 4) Grid border
      context.strokeStyle = "#222";
      context.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize);
    }
  }
};

export const animateExploration = (
  grid,
  context,
  cellSize,
  explorationOrder,
  path,
  visitedCells = new Set(),
  pathCells = new Set(),
  index = 0,
) => {
  if (index >= explorationOrder.length) {
    animatePath(grid, context, cellSize, path, visitedCells, pathCells, 0);
    return;
  }

  const key = explorationOrder[index];
  const position = fromKeyToPosition(key);
  const cell = getCell(grid, position);

  if (cell === "." || cell === "~") {
    visitedCells.add(key);
  }

  drawGrid(grid, context, cellSize, visitedCells, pathCells);

  setTimeout(() => {
    animateExploration(
      grid,
      context,
      cellSize,
      explorationOrder,
      path,
      visitedCells,
      pathCells,
      index + 1,
    );
  }, 150);
};

export const animatePath = (
  grid,
  context,
  cellSize,
  path,
  visitedCells = new Set(),
  pathCells = new Set(),
  index = 0,
) => {
  if (index >= path.length) {
    drawGrid(grid, context, cellSize, visitedCells, pathCells);
    return;
  }

  const key = path[index];
  const position = fromKeyToPosition(key);
  const cell = getCell(grid, position);

  if (cell !== "#") {
    pathCells.add(key);
  }

  drawGrid(grid, context, cellSize, visitedCells, pathCells);

  setTimeout(() => {
    animatePath(
      grid,
      context,
      cellSize,
      path,
      visitedCells,
      pathCells,
      index + 1,
    );
  }, 120);
};
