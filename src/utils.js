export const fromPositionToKey = (position) => {
  return `${position.x},${position.y}`;
};

export const fromKeyToPosition = (key) => {
  const [x, y] = key.split(",").map(Number);
  return { x, y };
};
