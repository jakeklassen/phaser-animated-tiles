import { TiledTile, TiledTileset } from "../@types/tiled";

/**
 * Given a list of tilesets, create a map of tile id's to tile data.
 * @param tilesets
 * @returns
 */
export const generateTileIdMapFromTilesets = (tilesets: TiledTileset[]) => {
  const tileIdMap = new Map<TiledTile["id"], TiledTile>();

  for (const tileset of tilesets) {
    for (const tile of tileset.tiles ?? []) {
      // Add 1 to tileset tile id so we get the correct tile id when
      // comparing layer data and tileset tile ids.
      tileIdMap.set(tile.id + 1, tile);
    }
  }

  return tileIdMap;
};
