import { generateMovementGrid } from "./generate-movement-grid";

describe("generateMovementGrid", () => {
  it("should fail if position.x or position.y is out of bounds", () => {
    const width = 3;
    const height = 3;
    const move = 3;

    expect(() =>
      generateMovementGrid(width, height, move, { x: width - 1, y: width }),
    ).toThrow();
    expect(() =>
      generateMovementGrid(width, height, move, { x: width, y: height - 1 }),
    ).toThrow();
  });

  it("should return the current grid with a move of 1", () => {
    const grid = generateMovementGrid(4, 4, 1, { x: 2, y: 2 });

    const expected = [
      [0, 0, 0, 0],
      [0, 0, [2, 1], 0],
      [0, [1, 2], [2, 2], [3, 2]],
      [0, 0, [2, 3], 0],
    ];

    expect(grid).toEqual(expected);
  });

  it("should return the current grid with a move of 2", () => {
    const grid = generateMovementGrid(5, 5, 2, { x: 2, y: 2 });

    // [
    //   [0, 0, 1, 0, 0],
    //   [0, 1, 1, 1, 0],
    //   [1, 1, 1, 1, 1],
    //   [0, 1, 1, 1, 0],
    //   [0, 0, 1, 0, 0],
    // ];
    const expected = [
      [0, 0, [2, 0], 0, 0],
      [0, [1, 1], [2, 1], [3, 1], 0],
      [
        [0, 2],
        [1, 2],
        [2, 2],
        [3, 2],
        [4, 2],
      ],
      [0, [1, 3], [2, 3], [3, 3], 0],
      [0, 0, [2, 4], 0, 0],
    ];

    expect(grid).toEqual(expected);
  });

  it("should return the current grid with a move of 3", () => {
    const grid = generateMovementGrid(5, 5, 3, { x: 4, y: 4 });

    // [
    //   [0, 0, 0, 0, 0],
    //   [0, 0, 0, 0, 1],
    //   [0, 0, 0, 1, 1],
    //   [0, 0, 1, 1, 1],
    //   [0, 1, 1, 1, 1],
    // ];
    const expected = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, [4, 1]],
      [0, 0, 0, [3, 2], [4, 2]],
      [0, 0, [2, 3], [3, 3], [4, 3]],
      [0, [1, 4], [2, 4], [3, 4], [4, 4]],
    ];

    expect(grid).toEqual(expected);
  });
});
