import { getUniquePaths } from "./get-unique-paths";

describe("getUniquePaths", () => {
  it("should return unique paths", () => {
    const paths = [
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
      [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
      ],
    ];

    const [_duplicate, ...expected] = paths;

    expect(getUniquePaths(paths)).toEqual(expected);
  });

  it("should return 0 paths when empty", () => {
    expect(getUniquePaths([])).toEqual([]);
  });
});
