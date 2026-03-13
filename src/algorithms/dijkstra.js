import { getNeighborsPositions, getMovementCost } from "../grid";
import {
  fromKeyToPosition,
  fromPositionToKey,
  popLowestPriority,
} from "../utils";

export const dijkstra = (grid, startKey, goalKey) => {
  const explorationQueue = [{ key: startKey, priority: 0 }];
  const gScore = new Map([[startKey, 0]]);
  const visited = new Set([startKey]);
  const explorationOrder = [];
  const cameFrom = new Map(); // childKey -> parentKey

  let found = false;
  while (explorationQueue.length > 0) {
    const current = popLowestPriority(explorationQueue);
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
      cameFrom.set(neighborKey, current.key);
      visited.add(neighborKey);
      gScore.set(neighborKey, cost);
      explorationQueue.push({
        key: neighborKey,
        priority: gScore.get(neighborKey),
      });
    }
  }

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
  const path = reversePath.reverse();

  return {
    found,
    explorationOrder,
    path,
  };
};
