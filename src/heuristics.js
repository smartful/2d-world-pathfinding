// Pour mouvement qui n'autorise pas les diagonales (uniquement horizontaux et verticaux)
export const manhattan = (positionA, positionB) => {
  return (
    Math.abs(positionB.x - positionA.x) + Math.abs(positionB.y - positionA.y)
  );
};

// Pour mouvement qui autorise les diagonales
export const octileDistance = (positionA, positionB) => {
  const distanceX = Math.abs(positionA.x - positionB.x);
  const distanceY = Math.abs(positionA.y - positionB.y);
  const minDistance = Math.min(distanceX, distanceY);
  const maxDistance = Math.max(distanceX, distanceY);
  return minDistance * Math.sqrt(2) + (maxDistance - minDistance);
};
