import { TiledPropertyAbstract, TiledTileset } from "../@types/tiled";

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
