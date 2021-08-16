import { generateGrid } from "./generate-grid";

describe("generateGrid", () => {
  it("should fail if either width or height is a float", () => {
    expect(() => generateGrid(1.1, 2)).toThrow();
    expect(() => generateGrid(1, 2.2)).toThrow();
  });

  it("should fail if either width or height is negative", () => {
    expect(() => generateGrid(-1, 2)).toThrow();
    expect(() => generateGrid(1, -2)).toThrow();
  });

  it("should fail if either width or height is 0", () => {
    expect(() => generateGrid(1, 0)).toThrow();
    expect(() => generateGrid(0, 1)).toThrow();
  });

  it("should return 1x1 grid", () => {
    const grid = generateGrid(1, 1);

    expect(grid).toEqual([[0]]);
  });

  it("should return 2x2 grid", () => {
    const grid = generateGrid(2, 2);

    expect(grid).toEqual([
      [0, 0],
      [0, 0],
    ]);
  });

  it("should return 3x3 grid", () => {
    const grid = generateGrid(3, 3);

    expect(grid).toEqual([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
  });

  it("should return 1x2 grid", () => {
    const grid = generateGrid(1, 2);

    expect(grid).toEqual([[0], [0]]);
    expect(grid[0][0]).toBe(0);
    expect(grid[1][0]).toBe(0);
  });

  it("should return 2x1 grid", () => {
    const grid = generateGrid(2, 1);

    expect(grid).toEqual([[0, 0]]);
    expect(grid[0][0]).toBe(0);
    expect(grid[0][1]).toBe(0);
  });
});
