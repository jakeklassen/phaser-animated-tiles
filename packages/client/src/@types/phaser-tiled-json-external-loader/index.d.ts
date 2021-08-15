interface TilemapTiledJSONExternalOptions {
  key: string;
  url: string;
  xhrSettings?: Phaser.Types.Loader.XHRSettingsObject;
  path?: string;
  baseURL?: string;
  tilesetXhrSettings?: Phaser.Types.Loader.XHRSettingsObject;
}

declare module "phaser-tiled-json-external-loader" {
  /**
   * Add support for loading tilemaps with external tilesets.
   * @param phaser
   */
  export default function registerTiledJSONExternalLoader(
    phaser: typeof Phaser,
  ): void;
}

declare namespace Phaser {
  namespace Loader {
    interface LoaderPlugin {
      tilemapTiledJSONExternal(
        key: string,
        tilemapURL: string,
        path?: string,
        baseURL?: string,
        tilemapXhrSettings?: any,
      ): void;
      tilemapTiledJSONExternal(
        mutlifile: TilemapTiledJSONExternalOptions[],
      ): void;
      tilemapTiledJSONExternal(opts: TilemapTiledJSONExternalOptions): void;
    }
  }
}
