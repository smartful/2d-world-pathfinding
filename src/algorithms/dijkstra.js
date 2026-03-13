import { getNeighborsPositions, getMovementCost } from "../grid";
import {
  fromKeyToPosition,
  fromPositionToKey,
  popLowestPriority,
} from "../utils";

export const dijkstra = (grid, startKey, goalKey) => {
  const explorationQueue = [{ key: startKey, priority: 0 }];
  const gScore = new Map([[startKey, 0]]);
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
    const neighborsPositions = getNeighborsPositions(grid, currentPosition);
    for (let neighborPosition of neighborsPositions) {
      const neighborKey = fromPositionToKey(neighborPosition);
      if (visited.has(neighborKey)) continue;

      const cost = getMovementCost(grid, neighborPosition);
      const tryG = gScore.get(current.key) + cost;
      const neighborG = gScore.get(neighborKey);
      if (neighborG === undefined || tryG < neighborG) {
        gScore.set(neighborKey, tryG);
        cameFrom.set(neighborKey, current.key);

        explorationQueue.push({
          key: neighborKey,
          priority: tryG,
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

  return {
    found,
    explorationOrder,
    path,
  };
};
