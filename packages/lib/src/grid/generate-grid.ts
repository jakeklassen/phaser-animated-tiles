export type Grid2d<T> = T[][];

export const generateGrid = <T>(
  width: number,
  height: number,
  emptyValue: T,
): Grid2d<T> => {
  if (Math.floor(width) !== width || width < 0 || width === 0) {
    throw new Error("width must be a postive integer");
  }

  if (Math.floor(height) !== height || height < 0 || height === 0) {
    throw new Error("height must be a postive integer");
  }

  const grid: T[][] = [];

  for (let y = 0; y < height; y++) {
    grid[y] = [];

    for (let x = 0; x < width; x++) {
      grid[y][x] = emptyValue;
    }
  }

  return grid;
};
