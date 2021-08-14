import EasyStar from "easystarjs";
import { isEqual } from "lodash";
import path from "path";
import { Merge } from "type-fest";
import desertTileset from "./fixtures/desert_tileset.json";
import moveTesting from "./fixtures/move_testing.json";

/**
 * Generate 2d grid of `size` * `size` elements
 * @param size
 * @returns
 */
const generateGrid = (size: number) => {
  if (size <= 0) {
    throw new Error("size must be a positive number");
  }

  if (Math.floor(size) !== size) {
    throw new Error("size must be a positive nubmer");
  }

  const grid: number[][] = [];

  for (let y = 0; y < size * 2 + 1; y++) {
    grid[y] = [];

    for (let x = 0; x < size * 2 + 1; x++) {
      grid[y][x] = 0;
    }
  }

  return grid;
};

/**
 * Grid of available movements, based on center position in the grid.
 * Offsets will be applied relative to `position`
 * @param move The max number of moves
 * @param position
 * @returns
 */
const generateMovementGrid = (
  move: number,
  position: { x: number; y: number },
) => {
  const grid: (number | number[])[][] = generateGrid(move);

  grid[move][move] = [position.x, position.y];

  for (let y = 0; y <= move; ++y) {
    for (let x = 0; x <= move; ++x) {
      if (x + y > move) {
        continue;
      }

      grid[move][move - x] = [position.x - x, position.y];
      grid[move][move + x] = [position.x + x, position.y];
      grid[move - y][move] = [position.x, position.y - y];
      grid[move + y][move] = [position.x, position.y + y];
      grid[move - y][move - x] = [position.x - x, position.y - y];
      grid[move + y][move + x] = [position.x + x, position.y + y];
      grid[move - y][move + x] = [position.x + x, position.y - y];
      grid[move + y][move - x] = [position.x - x, position.y + y];
    }
  }

  return grid;
};

const getAdjacentTiles = (
  grid: number[][],
  relativeTo: { x: number; y: number },
) => {
  const north = grid[relativeTo.y - 1]?.[relativeTo.x];
  const south = grid[relativeTo.y + 1]?.[relativeTo.x];
  const east = grid[relativeTo.y]?.[relativeTo.x + 1];
  const west = grid[relativeTo.y]?.[relativeTo.x - 1];

  return {
    north: north ? { x: relativeTo.x, y: relativeTo.y - 1 } : undefined,
    east: east ? { x: relativeTo.x + 1, y: relativeTo.y } : undefined,
    south: south ? { x: relativeTo.x, y: relativeTo.y + 1 } : undefined,
    west: west ? { x: relativeTo.x - 1, y: relativeTo.y } : undefined,
  };
};

const getAdjacentTilesAsArray = (
  grid: number[][],
  relativeTo: { x: number; y: number },
) =>
  Object.values(getAdjacentTiles(grid, relativeTo)).filter(
    (position): position is { x: number; y: number } => position != null,
  );

const getUniquePaths = (paths: { x: number; y: number }[][]) => {
  const unique: typeof paths = [];

  for (const potentialPath of paths) {
    const duplicate = unique.find((path) => isEqual(path, potentialPath));

    if (duplicate == null) {
      unique.push(potentialPath);
    }
  }

  return unique;
};

// [
//   [0, 0, 0, 1, 0, 0, 0],
//   [0, 0, 1, 1, 1, 0, 0],
//   [0, 1, 1, 1, 1, 1, 0],
//   [1, 1, 1, 1, 1, 1, 1],
//   [0, 1, 1, 1, 1, 1, 0],
//   [0, 0, 1, 1, 1, 0, 0],
//   [0, 0, 0, 1, 0, 0, 0],
// ];
console.table(
  generateMovementGrid(3, { x: 9, y: 9 }).map((row) =>
    row.map((position) => (Array.isArray(position) ? 1 : "")),
  ),
);

enum Direction {
  North = "north",
  East = "east",
  South = "south",
  West = "west",
}

const getDirection = (
  t1: Pick<Position, "x" | "y">,
  t2: Pick<Position, "x" | "y">,
): Direction => {
  if (t1.y < t2.y) return Direction.South;
  if (t1.x < t2.x) return Direction.East;
  if (t1.y > t2.y) return Direction.North;
  return Direction.West;
};

type Tilemap = Merge<
  typeof moveTesting,
  {
    tilesets: Array<
      typeof moveTesting["tilesets"][number] & {
        tileset: typeof desertTileset;
      }
    >;
  }
>;

// For every tileset referenced, add a tileset property with the loaded
// tileset file.
for (const [tilesetIdx] of moveTesting.tilesets.entries()) {
  const tileset = moveTesting.tilesets[tilesetIdx];
  const tilesetPath = path.resolve(
    path.join(
      __dirname,
      `./fixtures/`,
      tileset.source.replace(".tsx", ".json"),
    ),
  );

  (moveTesting as Tilemap).tilesets[tilesetIdx].tileset = require(tilesetPath);
}

const map: Tilemap = JSON.parse(JSON.stringify(moveTesting));

const targetTileX = 5;
const targetTileY = 9;
const normalizedTargetTileIdx = targetTileX + targetTileY * map.width;

// We only care about layers labeled as `height`
const heightLayers = map.layers.filter((layer) =>
  layer.properties?.some((property) => property.value === "height"),
);

const heightLayersWithGridIndices: typeof map["layers"] = JSON.parse(
  JSON.stringify(heightLayers),
);

for (const [layerIdx, layer] of heightLayers.entries()) {
  for (const [tileIdx, tileId] of layer.data.entries()) {
    // We are 'shifting' the tile to a normalzed position that would work
    // in a 2d grid, 'not' the way the map is rendered.
    // Basically tiles that 'appear' in a column, now will be.
    const newIdx = tileIdx + (map.width + 1) * layerIdx;

    // Tileid of 0 refers to an empty tile
    if (tileId === 0) {
      continue;
    }

    // Shift the tileId from the old index to the new index
    heightLayersWithGridIndices[layerIdx].data[tileIdx] = 0;
    heightLayersWithGridIndices[layerIdx].data[newIdx] = tileId;
  }
}

const aStarGrids = heightLayersWithGridIndices.map((layer) => {
  const layerTileArray = layer.data.map((tileId, _tileIdx) => {
    if (tileId === 0) {
      return 0;
    }

    const tileset = map.tilesets.find(({ firstgid }) => tileId >= firstgid);
    // Keep in mind, layer.data with a tileId of 0 acutally means an empty tile.
    // However, in Tiled the first tile in a tileset will have an id of 0. This
    // is a problem when we look up the tileid in the tileset (0-based), because
    // we need to subtract 1 from the layer.data tileid to get the correct tileset
    // tileid.
    const tile = tileset?.tileset.tiles.find((tile) => tile.id === tileId - 1);

    if (tile == null) {
      console.warn(
        `Probably a bug, no tile found for ${tileId} on height layer`,
      );

      return 0;
    }

    const heightProp = tile.properties?.find(
      (property) => property.name === "height",
    );

    if (heightProp == null) {
      console.warn("Probably a bug, no height prop on height layer");

      return 0;
    }

    return { layerTileId: tileId, tile, tileHeight: heightProp.value };
  });

  const grid: typeof layerTileArray[] = [];

  for (let row = 0; row < map.height; ++row) {
    grid[row] = [];
    const y = row;

    for (let col = 0; col < map.width; ++col) {
      const x = col;
      const gridIdx = x + y * map.width;

      grid[row][col] = layerTileArray[gridIdx];
    }
  }

  return {
    ...layer,
    grid,
  };
});

console.log(aStarGrids[0].grid[9][5]);
console.log(aStarGrids[1].grid[9][5]);
console.log(aStarGrids[2].grid[9][5]);
console.log(aStarGrids[3].grid[9][5]);
console.log(aStarGrids[4].grid[9][5]);
console.log(aStarGrids[5].grid[9][5]);

console.log(aStarGrids[0].grid[5][8]);
console.log(aStarGrids[1].grid[5][8]);
console.log(aStarGrids[2].grid[5][8]);
console.log(aStarGrids[3].grid[5][8]);
console.log(aStarGrids[4].grid[5][8]);
console.log(aStarGrids[5].grid[5][8]);

const isColumnEmpty = (
  grid: typeof aStarGrids,
  position: { x: number; y: number },
) => grid.every((layer) => layer.grid[position.y][position.x] === 0);

interface Unit {
  jump: number;
  move: number;
  flying: boolean;
}

interface Position {
  x: number;
  y: number;
  elevation: number;
}

interface UnitMoveAction {
  from: Position;
  to: Position;
  unit: Unit;
}

/**
 *
 * Rules:
 * - Adjacent empty tiles are based on `jump` as well
 * - Empty tiles do count as movement when adjacent
 *   - For example, when moving 2 units and the unit inbetween is a gap
 *
 * @param map
 * @param _unit
 * @param startingPosition
 * @returns
 */
const determineMoveTiles = async (
  map: Tilemap,
  unit: Unit,
  startingPosition: { x: number; y: number; layer: number; elevation: number },
) => {
  const startingPositionTile =
    aStarGrids[startingPosition.layer].grid[startingPosition.y][
      startingPosition.x
    ];

  if (startingPositionTile === 0) {
    throw new Error("Starting position tile is empty");
  }

  const tileset = map.tilesets.find(
    ({ firstgid }) => startingPositionTile.layerTileId >= firstgid,
  );

  // Keep in mind, layer.data with a tileId of 0 acutally means an empty tile.
  // However, in Tiled the first tile in a tileset will have an id of 0. This
  // is a problem when we look up the tileid in the tileset (0-based), because
  // we need to subtract 1 from the layer.data tileid to get the correct tileset
  // tileid.
  const tile = tileset?.tileset.tiles.find(
    (tile) => tile.id === startingPositionTile.layerTileId - 1,
  );

  const heightProp = tile?.properties?.find(
    (property) => property.name === "height",
  );

  console.log({
    startingPositionTile,
    height: heightProp?.value,
  });

  const walkNode = (
    position: Position & { layer: number },
    unit: Unit,
    path: Position[] = [],
  ): any => {
    // We've exhausted the units move limit, return the current path.
    if (unit.move === 0) {
      return path;
    }

    const left = {
      x: position.x - 1,
      y: position.y,
      elevation: position.elevation,
      layer: position.layer,
    };
    const right = {
      x: position.x + 1,
      y: position.y,
      elevation: position.elevation,
      layer: position.layer,
    };
    const up = {
      x: position.x,
      y: position.y - 1,
      elevation: position.elevation,
      layer: position.layer,
    };
    const down = {
      x: position.x,
      y: position.y + 1,
      elevation: position.elevation,
      layer: position.layer,
    };

    const leftTile = aStarGrids[position.layer].grid[left.y]?.[left.x];
    const rightTile = aStarGrids[position.layer].grid[right.y]?.[right.x];
    const upTile = aStarGrids[position.layer].grid[up.y]?.[up.x];
    const downTile = aStarGrids[position.layer].grid[down.y]?.[down.x];

    console.log({
      left,
      leftTile,
      right,
      rightTile,
      up,
      upTile,
      down,
      downTile,
    });

    // Out of bounds
    if (leftTile == null) {
      return path;
    }

    return walkNode(left, { ...unit, move: unit.move - 1 }, path.concat(left));
  };

  console.log(startingPosition);

  // return walkNode(startingPosition, unit);

  const unitMovementGrid = generateMovementGrid(
    unit.move,
    startingPosition,
  ).map((row) =>
    // Truncate positions that fall off the map
    row.map((value) => {
      if (!Array.isArray(value)) {
        return value;
      }

      const [x, y] = value;

      // Convert out of bounds positions to zeros
      if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
        return 0;
      }

      const moveDelta =
        Math.abs(startingPosition.x - x) + Math.abs(startingPosition.y - y);

      if (moveDelta === unit.move) {
        return isColumnEmpty(aStarGrids, { x, y }) ? 0 : value;
      }

      return value;
    }),
  );

  const aStarMoveable = unitMovementGrid.map((row) =>
    row.map((cell) => (Array.isArray(cell) ? 1 : 0)),
  );

  const easystar = new EasyStar.js();
  easystar.setGrid(aStarMoveable);
  easystar.setAcceptableTiles([1]);

  console.log(unitMovementGrid);

  const destinationPositions = unitMovementGrid
    .flat()
    .filter((value): value is number[] => Array.isArray(value))
    .filter(
      ([x, y]) => !(x === startingPosition.x && y === startingPosition.y),
    );

  const paths = [];

  for (const position of getAdjacentTilesAsArray(aStarMoveable, {
    x: startingPosition.x - unit.move * 2,
    y: startingPosition.y - unit.move * 2,
  })) {
    console.log({
      weightedPostition: {
        x: position.x + unit.move * 2,
        y: position.y + unit.move * 2,
      },
    });

    easystar.setAdditionalPointCost(position.x, position.y, 2);

    for (const [x, y] of destinationPositions) {
      console.log({
        startX: startingPosition.x - unit.move * 2,
        startY: startingPosition.y - unit.move * 2,
        endX: x - unit.move * 2,
        endY: y - unit.move * 2,
      });

      try {
        const path = await new Promise<{ x: number; y: number }[]>(
          (resolve, reject) => {
            easystar.findPath(
              startingPosition.x - unit.move * 2,
              startingPosition.y - unit.move * 2,
              x - unit.move * 2,
              y - unit.move * 2,
              (path) => {
                if (path == null) {
                  reject("No path found");
                } else {
                  resolve(path);
                }
              },
            );

            easystar.calculate();
          },
        );

        // Make sure last position in path is not an empty column
        const lastPosition = path.at(-1);

        if (lastPosition == null) {
          throw new Error("Error getting last position from path");
        }

        if (
          isColumnEmpty(aStarGrids, {
            x: lastPosition.x + unit.move * 2,
            y: lastPosition.y + unit.move * 2,
          })
        ) {
          continue;
        }

        paths.push(
          path.map(({ x, y }) => ({
            x: x + unit.move * 2,
            y: y + unit.move * 2,
          })),
        );
      } catch (error) {
        console.error(error);
      }
    }

    easystar.removeAdditionalPointCost(position.x, position.y);
  }

  console.table(unitMovementGrid);
  console.table(aStarMoveable);

  const unitPaths = getUniquePaths(paths);
  console.log(unitPaths);

  // const unitMovementGridFinalMapIntersect = [];

  // for (let y = 0; y < unitMovementGrid.length; ++y) {
  //   const row = unitMovementGrid[y];

  //   for (let x = 0; x < row.length; ++x) {
  //     if (Array.isArray(row[x]) === false) {
  //       continue;
  //     }

  //     const position = row[x] as number[];

  //     // Off the map?
  //     if (
  //       startingPosition.x + x > map.width ||
  //       startingPosition.y + y > map.height ||
  //       startingPosition.x + x < 0 ||
  //       startingPosition.y + y < 0
  //     ) {
  //       continue;
  //     }

  //     unitMovementGridFinalMapIntersect.push([x, y]);
  //   }
  // }

  // console.log(unitMovementGridFinalMapIntersect);
};

describe("tilemap", () => {
  it("runs", async () => {
    await determineMoveTiles(
      map,
      { move: 3, jump: 1, flying: false },
      { x: 8, y: 5, layer: 0, elevation: 0 },
    );
  });
});

// describe("tilemap ", () => {
//   describe("when jump height is 1 (default)", () => {
//     it("should allow me to move to position 28, 29", () => {
//       // What am I standing in?
//       // Subtract that tiles cost from overall move and jump

//       const unitMoveAction: UnitMoveAction = {
//         from: {
//           x: 29,
//           y: 29,
//           elevation: 0,
//         },
//         to: { x: 28, y: 29, elevation: 0 },
//         unit: { flying: false, jump: 1, move: 3 },
//       };

//       const toPositionIdx =
//         unitMoveAction.to.x + unitMoveAction.to.y * map.width;

//       // Assertions:
//       // Is there a tile at 28, 29?
//       // The unit must fit at 28, 29
//       // The tile at 28, 29 must have a height of 1 or less

//       expect(1).toBe(1);
//     });

//     it.todo("should not allow me jump more than 1 full tiles");
//   });

//   describe("when jump height is 2", () => {
//     it.todo("should allow me to jump 2 full tiles");

//     it.todo("should not allow me jump more than 2 full tiles");
//   });
// });
