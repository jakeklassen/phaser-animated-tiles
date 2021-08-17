import TiledMap, {
  TiledLayerTilelayer,
  TiledProperty,
  TiledPropertyAbstract,
  TiledTile,
  TiledTileset,
} from "../@types/tiled";

/**
 * Evaluate tiles within tilesets, looking for the smallest `height` on
 * a tile.
 * @param tilesets
 * @returns
 */
export function determineSmallestTileHeight(tilesets: TiledTileset[]) {
  return tilesets.reduce((min, tileset) => {
    if (!Array.isArray(tileset.tiles)) {
      return min;
    }

    const tileHeights = tileset.tiles
      .map((tile) => tile.properties ?? [])
      .filter((properties) =>
        properties.filter(
          (
            property,
          ): property is TiledPropertyAbstract<number, "int" | "float"> =>
            property.name === "height" &&
            (property.type === "float" || property.type === "int"),
        ),
      )
      .flat()
      .map((property) => property.value)
      .filter((value): value is number => !isNaN(+value));

    const smallest = Math.min(...tileHeights);

    return smallest < min ? smallest : min;
  }, 1);
}

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

  /**
   * Determined by examining all tileset tiles for a `height` property with
   * the smallest value.
   */
  #smallestTileHeight: number;

  protected constructor(tiledmap: TiledMap) {
    this.#tiledmap = JSON.parse(JSON.stringify(tiledmap));

    const tilesets = tiledmap.tilesets as TiledTileset[];

    this.#smallestTileHeight = determineSmallestTileHeight(tilesets);
  }

  /**
   * Determined by examining all tileset tiles for a `height` property with
   * the smallest value. Defaults to `1`;
   */
  public get smallestTileHeight(): Readonly<number> {
    return this.#smallestTileHeight;
  }

  public getHeightLayerFromZ(z: number) {
    // TODO: Elevate to class property
    const tileIdMap = new Map<number, TiledTile>();

    const tilesets = this.#tiledmap.tilesets as TiledTileset[];

    for (const tileset of tilesets) {
      for (const tile of tileset.tiles ?? []) {
        // Add 1 to tileset tile id so we get the correct tile id when
        // comparing layer data and tileset tile ids.
        tileIdMap.set(tile.id + 1, tile);
      }
    }

    let heigthAccumulator = 0;

    const tilelayers: TiledLayerTilelayer[] = this.#tiledmap.layers.filter(
      (layer): layer is TiledLayerTilelayer => layer.type === "tilelayer",
    );

    return tilelayers.reduce((index, layer, layerIndex) => {
      // Are we already done?
      if (heigthAccumulator === z) {
        return index;
      }

      // `layer.data as number[]` since we're not looking to use base64
      const uniqueTileIds = new Set(layer.data as number[]);

      const smallestLayerTileHeight = Array.from(uniqueTileIds).reduce(
        (height, tileId) => {
          const tile = tileIdMap.get(tileId);

          if (tile == null) {
            return height;
          }

          const tileHeight = tile.properties?.find(
            (
              property,
            ): property is TiledPropertyAbstract<number, "float" | "int"> =>
              property.name === "height",
          )?.value;

          if (tileHeight == null) {
            console.warn(
              `Tile with id ${tileId} contains empty height property`,
            );

            return height;
          }

          if (tileHeight < height) {
            height = tileHeight;
          }

          return height;
        },
        Number.MAX_SAFE_INTEGER,
      );

      heigthAccumulator += smallestLayerTileHeight;

      if (heigthAccumulator === z) {
        index = layerIndex;
      }

      return index;
    }, 0);
  }
}
