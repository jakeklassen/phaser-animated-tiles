import path from "path";
import moveTesting from "./fixtures/move_testing.json";
import TiledMap from "../@types/tiled";
import { Tilemap } from "./tilemap";

// For every tileset referenced, add a tileset property with the loaded
// tileset file.
for (const [tilesetIdx] of moveTesting.tilesets.entries()) {
  const tileset = moveTesting.tilesets[tilesetIdx];
  const tilesetPath = path.resolve(
    path.join(__dirname, `./fixtures`, tileset.source.replace(".tsx", ".json")),
  );

  moveTesting.tilesets[tilesetIdx] = require(tilesetPath);
}

describe("Tilemap", () => {
  let tilemap: Tilemap;

  beforeAll(async () => {
    tilemap = await Tilemap.load(moveTesting as TiledMap);
  });

  it("should correctly determine smallest tile height", () => {
    expect(tilemap.smallestTileHeight).toBe(0.5);
  });

  it("should return the correct height layer based on z position", () => {
    console.log(tilemap.getHeightLayerFromZ(5.5));
  });
});
