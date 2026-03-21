import { getMovementCost } from "./grid";
import { fromKeyToPosition } from "./utils";

export const getPathCost = (grid, path) => {
  let totalCost = 0;

  for (const key of path) {
    const position = fromKeyToPosition(key);
    totalCost += getMovementCost(grid, position);
  }

  return totalCost;
};

export const getPathLength = (path) => {
  return path.length;
};

export const getExploredNodesCount = (explorationOrder) => {
  return explorationOrder.length;
};
