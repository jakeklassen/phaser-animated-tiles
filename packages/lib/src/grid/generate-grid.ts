export type Grid2d = number[][];
export type Grid3d = number[][][];

export const generateGrid = (width: number, height: number): Grid2d => {
  if (Math.floor(width) !== width || width < 0 || width === 0) {
    throw new Error("width must be a postive integer");
  }

  if (Math.floor(height) !== height || height < 0 || height === 0) {
    throw new Error("height must be a postive integer");
  }

  const grid: number[][] = [];

  for (let y = 0; y < height; y++) {
    grid[y] = [];

    for (let x = 0; x < width; x++) {
      grid[y][x] = 0;
    }
  }

  return grid;
};
