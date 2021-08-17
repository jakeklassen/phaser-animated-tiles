import { generateGrid } from "../grid/generate-grid";

/**
 * Grid of available movements, based on center position in the grid.
 * Offsets will be applied relative to `position`
 * @param width Grid width
 * @param height Grid height
 * @param move The max number of moves for a unit
 * @param position Generate movement grid around this position
 * @returns
 */
export const generateMovementGrid = (
  width: number,
  height: number,
  move: number,
  position: { x: number; y: number },
) => {
  const grid: (number | number[])[][] = generateGrid(width, height, 0);

  if (grid[position.y]?.[position.x] == null) {
    throw new Error(`position ${position.x}, ${position.y} is out of bounds`);
  }

  grid[position.y][position.x] = [position.x, position.y];

  for (let y = 0; y <= move; ++y) {
    for (let x = 0; x <= move; ++x) {
      if (x + y > move) {
        continue;
      }

      if (grid[position.y]?.[position.x - x] != null) {
        grid[position.y][position.x - x] = [position.x - x, position.y];
      }

      if (grid[position.y]?.[position.x + x] != null) {
        grid[position.y][position.x + x] = [position.x + x, position.y];
      }

      if (grid[position.y - y]?.[position.x] != null) {
        grid[position.y - y][position.x] = [position.x, position.y - y];
      }

      if (grid[position.y + y]?.[position.x] != null) {
        grid[position.y + y][position.x] = [position.x, position.y + y];
      }

      if (grid[position.y - y]?.[position.x - x] != null) {
        grid[position.y - y][position.x - x] = [position.x - x, position.y - y];
      }

      if (grid[position.y + y]?.[position.x + x] != null) {
        grid[position.y + y][position.x + x] = [position.x + x, position.y + y];
      }

      if (grid[position.y - y]?.[position.x + x] != null) {
        grid[position.y - y][position.x + x] = [position.x + x, position.y - y];
      }

      if (grid[position.y + y]?.[position.x - x] != null) {
        grid[position.y + y][position.x - x] = [position.x - x, position.y + y];
      }
    }
  }

  return grid;
};
