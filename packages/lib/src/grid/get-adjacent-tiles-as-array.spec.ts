import { getAdjacentTilesAsArray } from "./get-adjacent-tiles-as-array";

describe("getAdjacentTilesAsArray", () => {
  describe("3x3 grid", () => {
    it("should return north, east, south, west positions", () => {
      const grid = [
        [0, 1, 0],
        [1, 0, 1],
        [0, 1, 0],
      ];

      const tiles = getAdjacentTilesAsArray(grid, { x: 1, y: 1 });

      expect(tiles).toContainEqual({ x: 1, y: 0 });
      expect(tiles).toContainEqual({ x: 2, y: 1 });
      expect(tiles).toContainEqual({ x: 1, y: 2 });
      expect(tiles).toContainEqual({ x: 0, y: 1 });
    });

    it("should return east, south, west positions", () => {
      const grid = [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
      ];

      const tiles = getAdjacentTilesAsArray(grid, { x: 1, y: 0 });

      expect(tiles).toContainEqual({ x: 2, y: 0 });
      expect(tiles).toContainEqual({ x: 1, y: 1 });
      expect(tiles).toContainEqual({ x: 0, y: 0 });
    });

    it("should return west, south positions", () => {
      const grid = [
        [0, 1, 1],
        [0, 0, 1],
        [0, 0, 0],
      ];

      const tiles = getAdjacentTilesAsArray(grid, { x: 2, y: 0 });

      expect(tiles).toContainEqual({ x: 2, y: 1 });
      expect(tiles).toContainEqual({ x: 1, y: 0 });
    });

    it("should return 0 defined tile positions", () => {
      const grid = [
        [0, 0, 1],
        [0, 0, 0],
        [0, 0, 0],
      ];

      const tiles = getAdjacentTilesAsArray(grid, { x: 2, y: 0 });

      expect(tiles.length).toBe(0);
    });
  });
});
