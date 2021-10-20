export type Grid3d<T> = T[][][];

export const generateGrid3d = <T>(
  width: number,
  height: number,
  elevation: number,
  emptyValue: T,
): Grid3d<T> => {
  if (Math.floor(width) !== width || width < 0 || width === 0) {
    throw new Error("width must be a postive integer");
  }

  if (Math.floor(height) !== height || height < 0 || height === 0) {
    throw new Error("height must be a postive integer");
  }

  if (Math.floor(elevation) !== elevation || elevation < 0 || elevation === 0) {
    throw new Error("elevation must be a postive integer");
  }

  const grid: T[][][] = [];

  for (let z = 0; z < elevation; z++) {
    for (let y = 0; y < height; y++) {
      grid[y] = [];

      for (let x = 0; x < width; x++) {
        grid[z][y][x] = emptyValue;
      }
    }
  }

  return grid;
};
