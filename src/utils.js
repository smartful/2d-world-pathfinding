export const fromPositionToKey = (position) => {
  return `${position.x},${position.y}`;
};

export const fromKeyToPosition = (key) => {
  const [x, y] = key.split(",").map(Number);
  return { x, y };
};

export const popLowestPriority = (queue) => {
  if (queue.length === 0) return undefined;

  let bestIndex = 0;

  for (let i = 1; i < queue.length; i++) {
    if (queue[i].priority < queue[bestIndex].priority) {
      bestIndex = i;
    }
  }

  const [best] = queue.splice(bestIndex, 1);

  return best;
};
