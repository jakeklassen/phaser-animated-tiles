/**
 * Return adjacent tiles relative to position.
 * 0's in the grid are assumed to be empty values and will not be
 * returned.
 * @param grid
 * @param relativeTo
 * @returns
 */
export const getAdjacentTiles = (
  grid: number[][],
  relativeTo: { x: number; y: number },
) => {
  const north = grid[relativeTo.y - 1]?.[relativeTo.x];
  const south = grid[relativeTo.y + 1]?.[relativeTo.x];
  const east = grid[relativeTo.y]?.[relativeTo.x + 1];
  const west = grid[relativeTo.y]?.[relativeTo.x - 1];

  return {
    north:
      north ?? 0 !== 0 ? { x: relativeTo.x, y: relativeTo.y - 1 } : undefined,
    east:
      east ?? 0 !== 0 ? { x: relativeTo.x + 1, y: relativeTo.y } : undefined,
    south:
      south ?? 0 !== 0 ? { x: relativeTo.x, y: relativeTo.y + 1 } : undefined,
    west:
      west ?? 0 !== 0 ? { x: relativeTo.x - 1, y: relativeTo.y } : undefined,
  };
};
