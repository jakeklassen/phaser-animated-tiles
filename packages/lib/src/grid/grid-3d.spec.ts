import { Grid3d } from "./grid-3d";

describe("Grid3d", () => {
  describe("isColumnEmpty", () => {
    it("should respect elevation (z)", () => {
      const grid = new Grid3d(3, 3, 3, 0);

      grid.setItem(0, 0, 0, 1);

      console.table(grid.grids);

      expect(grid.isColumnEmpty(0, 0, 0)).toBe(false);
      // From layer above, onward
      expect(grid.isColumnEmpty(0, 0, 1)).toBe(true);
    });

    it("should work with objects", () => {});
  });
});
