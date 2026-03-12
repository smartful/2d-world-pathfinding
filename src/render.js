import { getCell, setCell } from "./grid";
import { fromKeyToPosition } from "./utils";

export const drawGrid = (grid, context, cellSize) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[0].length; x++) {
      const cell = getCell(grid, { x, y });

      if (cell === "#") context.fillStyle = "#444";
      else if (cell === "S") context.fillStyle = "#3b82f6";
      else if (cell === "G") context.fillStyle = "#22c55e";
      else if (cell === "V") context.fillStyle = "#a855f7";
      else if (cell === "*") context.fillStyle = "#facc15";
      else context.fillStyle = "#e5e7eb";

      context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

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
  index = 0,
) => {
  if (index >= explorationOrder.length) {
    animatePath(grid, context, cellSize, path);
    return;
  }

  const key = explorationOrder[index];
  const position = fromKeyToPosition(key);
  const cell = getCell(grid, position);

  if (cell === ".") {
    setCell(grid, position, "V");
  }

  drawGrid(grid, context, cellSize);

  setTimeout(() => {
    animateExploration(
      grid,
      context,
      cellSize,
      explorationOrder,
      path,
      index + 1,
    );
  }, 150);
};

export const animatePath = (grid, context, cellSize, path, index = 0) => {
  if (index >= path.length) {
    drawGrid(grid, context, cellSize);
    return;
  }

  const key = path[index];
  const position = fromKeyToPosition(key);
  const cell = getCell(grid, position);

  if (cell === "." || cell === "V") {
    setCell(grid, position, "*");
  }

  drawGrid(grid, context, cellSize);

  setTimeout(() => {
    animatePath(grid, context, cellSize, path, index + 1);
  }, 120);
};
