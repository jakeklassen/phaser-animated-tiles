import { getAdjacentTiles } from "./get-adjacent-tiles";

/**
 * Return adjacent tiles as an array. Grid cells with a value of `0` are
 * considered empty, and are not returned.
 * @param grid
 * @param relativeTo
 * @returns
 */
export const getAdjacentTilesAsArray = (
  grid: number[][],
  relativeTo: { x: number; y: number },
) =>
  Object.values(getAdjacentTiles(grid, relativeTo)).filter(
    (position): position is { x: number; y: number } => position != null,
  );
