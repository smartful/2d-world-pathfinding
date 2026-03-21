import { getMovementCost, isDiagonalMove } from "./grid";
import { fromKeyToPosition } from "./utils";

export const getPathCost = (grid, path, startKey) => {
  if (!path || path.length === 0) return 0;

  let totalCost = 0;
  let previousPosition = fromKeyToPosition(startKey);

  for (const key of path) {
    const currentPosition = fromKeyToPosition(key);
    const isDiagonal = isDiagonalMove(previousPosition, currentPosition);
    const directionMultiplier = isDiagonal ? Math.sqrt(2) : 1;

    totalCost += getMovementCost(grid, currentPosition) * directionMultiplier;

    previousPosition = currentPosition;
  }

  return totalCost;
};

export const getPathLength = (path) => {
  return path.length;
};

export const getExploredNodesCount = (explorationOrder) => {
  return explorationOrder.length;
};
