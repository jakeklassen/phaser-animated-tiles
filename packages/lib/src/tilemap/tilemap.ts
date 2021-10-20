import TiledMap, { TiledTile, TiledTileset } from "../@types/tiled";
import { determineSmallestTileHeight } from "./determine-smallest-tile-height";
import { generateTileIdMapFromTilesets } from "./generate-tile-id-map-from-tilesets";
import { getPropertyValue } from "./get-property-value";

export class Tilemap {
  static async load(tiledmap: TiledMap) {
    if (tiledmap.orientation !== "isometric") {
      throw new Error("Onyl isometric maps are supported");
    }

    // TODO: expect client to provide fully populated map?? I like this
    for (const [tilesetIdx, tileset] of tiledmap.tilesets.entries()) {
      // TODO: load tilesets
      // TODO: support web/node
    }

    const tilemap = new Tilemap(tiledmap);

    return tilemap;
  }

  readonly #tiledmap: TiledMap;

  #tilesById = new Map<TiledTile["id"], TiledTile>();

  /**
   * Determined by examining all tileset tiles for a `height` property with
   * the smallest value.
   */
  #smallestTileHeight: number;

  protected constructor(tiledmap: TiledMap) {
    this.#tiledmap = JSON.parse(JSON.stringify(tiledmap));

    const tilesets = tiledmap.tilesets as TiledTileset[];

    this.#smallestTileHeight = determineSmallestTileHeight(tilesets);
    this.#tilesById = generateTileIdMapFromTilesets(tilesets);
  }

  /**
   * Determined by examining all tileset tiles for a `height` property with
   * the smallest value. Defaults to `1`;
   */
  public get smallestTileHeight(): Readonly<number> {
    return this.#smallestTileHeight;
  }

  /**
   * Return layer index associated with this elevation.
   * @param z Elevation
   * @returns
   */
  public getHeightLayerFromZ(z: number) {
    let heigthAccumulator = 0;
    let heightLayerFound = false;
    let heightLayerIdx = -1;

    for (const [layerIdx, layer] of this.#tiledmap.layers.entries()) {
      if (heightLayerFound) {
        break;
      }

      if (layer.type !== "tilelayer") {
        continue;
      }

      if (
        getPropertyValue(layer.properties ?? [], "string", "type") !== "height"
      ) {
        continue;
      }

      // `layer.data as number[]` since we're not looking to use base64
      const uniqueTileIds = new Set(layer.data as number[]);

      /**
       * If layer contains a tile matching `this.#smallestTileHeight`
       */
      let hasMinTileHeight = false;

      let largestLayerTileHeight = 0;

      for (const tileId of uniqueTileIds) {
        const tile = this.#tilesById.get(tileId);

        if (tile == null) {
          continue;
        }

        const tileHeight = getPropertyValue(
          tile.properties ?? [],
          "float",
          "height",
        );

        if (tileHeight == null) {
          console.warn(`Tile with id ${tileId} contains empty height property`);

          continue;
        }

        if (tileHeight === this.#smallestTileHeight) {
          hasMinTileHeight = true;
        }

        if (tileHeight > largestLayerTileHeight) {
          largestLayerTileHeight = tileHeight;
        }
      }

      heigthAccumulator += largestLayerTileHeight;

      if (heigthAccumulator === z) {
        heightLayerIdx = layerIdx;
        heightLayerFound = true;
      }

      if (
        hasMinTileHeight &&
        heigthAccumulator + this.smallestTileHeight >= z
      ) {
        heightLayerFound = true;
        heightLayerIdx = layerIdx;
      }
    }

    if (heightLayerFound) {
      return this.#tiledmap.layers[heightLayerIdx];
    }

    // return heightLayerIdx;
  }
}
