import { getAdjacentTiles } from "./get-adjacent-tiles";

describe("getAdjacentTiles", () => {
  describe("3x3 grid", () => {
    it("should return north, east, south, west positions", () => {
      const grid = [
        [0, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
      ];

      const tiles = getAdjacentTiles(grid, { x: 1, y: 1 });

      expect(tiles.north).toEqual({ x: 1, y: 0 });
      expect(tiles.east).toEqual({ x: 2, y: 1 });
      expect(tiles.south).toEqual({ x: 1, y: 2 });
      expect(tiles.west).toEqual({ x: 0, y: 1 });
    });

    it("should return east, south, west positions", () => {
      const grid = [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
      ];

      const tiles = getAdjacentTiles(grid, { x: 1, y: 0 });

      expect(tiles.north).not.toBeDefined();
      expect(tiles.east).toEqual({ x: 2, y: 0 });
      expect(tiles.south).toEqual({ x: 1, y: 1 });
      expect(tiles.west).toEqual({ x: 0, y: 0 });
    });

    it("should return west, south positions", () => {
      const grid = [
        [0, 1, 1],
        [0, 0, 1],
        [0, 0, 0],
      ];

      const tiles = getAdjacentTiles(grid, { x: 2, y: 0 });

      expect(tiles.north).not.toBeDefined();
      expect(tiles.east).not.toBeDefined();
      expect(tiles.south).toEqual({ x: 2, y: 1 });
      expect(tiles.west).toEqual({ x: 1, y: 0 });
    });

    it("should return 0 defined tile positions", () => {
      const grid = [
        [0, 0, 1],
        [0, 0, 0],
        [0, 0, 0],
      ];

      const tiles = getAdjacentTiles(grid, { x: 2, y: 0 });

      expect(tiles.north).not.toBeDefined();
      expect(tiles.east).not.toBeDefined();
      expect(tiles.south).not.toBeDefined();
      expect(tiles.west).not.toBeDefined();
    });
  });
});
