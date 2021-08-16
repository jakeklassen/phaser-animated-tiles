import TiledMap from "../@types/tiled";

export class Tilemap {
  static async load(tiledmap: TiledMap) {
    for (const [tilesetIdx, tileset] of tiledmap.tilesets.entries()) {
      // TODO: load tilesets
      // TODO: support web/node
    }

    return new Tilemap(tiledmap);
  }

  #tiledmap: TiledMap;

  protected constructor(tiledmap: TiledMap) {
    this.#tiledmap = JSON.parse(JSON.stringify(tiledmap));
  }
}
