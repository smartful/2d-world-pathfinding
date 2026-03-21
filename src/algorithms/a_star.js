import { getNeighborsPositions, getMovementCost } from "../grid";
import {
  fromKeyToPosition,
  fromPositionToKey,
  manhattan,
  popLowestPriority,
} from "../utils";

export const a_star = (grid, startKey, goalKey) => {
  const startPosition = fromKeyToPosition(startKey);
  const goalPosition = fromKeyToPosition(goalKey);

  const explorationQueue = [{ key: startKey, priority: 0 }];
  const gScore = new Map([[startKey, 0]]);
  const fScore = new Map([[startKey, manhattan(startPosition, goalPosition)]]);
  const visited = new Set();
  const explorationOrder = [];
  const cameFrom = new Map(); // childKey -> parentKey

  let found = false;

  while (explorationQueue.length > 0) {
    const current = popLowestPriority(explorationQueue);
    if (!current) break;
    if (visited.has(current.key)) continue;

    visited.add(current.key);
    explorationOrder.push(current.key);

    if (current.key === goalKey) {
      found = true;
      break;
    }

    const currentPosition = fromKeyToPosition(current.key);
    const currentG = gScore.get(current.key);

    const neighborsPositions = getNeighborsPositions(grid, currentPosition);
    for (let neighborPosition of neighborsPositions) {
      const neighborKey = fromPositionToKey(neighborPosition);
      if (visited.has(neighborKey)) continue;

      const tryNeighborG = currentG + getMovementCost(grid, neighborPosition);
      const existingNeighborG = gScore.get(neighborKey);
      if (existingNeighborG === undefined || tryNeighborG < existingNeighborG) {
        gScore.set(neighborKey, tryNeighborG);

        const neighborF =
          tryNeighborG + manhattan(neighborPosition, goalPosition);
        fScore.set(neighborKey, neighborF);

        cameFrom.set(neighborKey, current.key);
        explorationQueue.push({
          key: neighborKey,
          priority: neighborF,
        });
      }
    }
  }

  // Reconstruct path: goal -> start
  const path = [];
  if (found) {
    let currentKey = goalKey;

    while (currentKey !== startKey) {
      path.push(currentKey);
      currentKey = cameFrom.get(currentKey);
      if (!currentKey) break;
    }
    path.reverse();
  }

  return { found, explorationOrder, path };
};
