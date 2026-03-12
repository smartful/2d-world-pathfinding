import { getNeighborsPositions } from "../grid";
import { fromKeyToPosition, fromPositionToKey } from "../utils";

export const bfs = (grid, startKey, goalKey) => {
  const explorationQueue = [startKey];
  const visited = new Set([startKey]);
  const explorationOrder = [];
  const cameFrom = new Map(); // childKey -> parentKey

  let found = false;

  while (explorationQueue.length > 0) {
    const currentKey = explorationQueue.shift();
    explorationOrder.push(currentKey);

    if (currentKey === goalKey) {
      found = true;
      break;
    }

    const currentPosition = fromKeyToPosition(currentKey);
    const neighborsPositions = getNeighborsPositions(grid, currentPosition);

    for (let neighborPosition of neighborsPositions) {
      const neighborKey = fromPositionToKey(neighborPosition);
      if (visited.has(neighborKey)) continue;
      cameFrom.set(neighborKey, currentKey);
      visited.add(neighborKey);
      explorationQueue.push(neighborKey);
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
