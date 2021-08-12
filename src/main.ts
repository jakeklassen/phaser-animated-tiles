import Phaser, { Tilemaps } from "phaser";
import registerTiledJSONExternalLoader from "phaser-tiled-json-external-loader";
// import desertMapEmbeddedTilesetsJsonUrl from "./assets/maps/desert/desert.json";
import desertMapJsonUrl from "./assets/maps/desert-external-tilesets/tilemap.json?url";
import isoTestTilesetUrl from "./assets/maps/desert-external-tilesets/tileset.png?url";
import waterTilesetUrl from "./assets/maps/desert-external-tilesets/water.png?url";
import { AnimatedTiles } from "./plugins/animated-tiles";

registerTiledJSONExternalLoader(Phaser);

export default class Demo extends Phaser.Scene {
  controls!: Phaser.Cameras.Controls.FixedKeyControl;
  animatedTiles!: AnimatedTiles;

  constructor() {
    super("demo");
  }

  preload() {
    this.load.image("iso_test", isoTestTilesetUrl);
    this.load.image("water", waterTilesetUrl);
    this.load.tilemapTiledJSONExternal("tilemap", desertMapJsonUrl);
    // this.load.tilemapTiledJSON("tilemap", desertMapEmbeddedTilesetsJsonUrl);
  }

  create() {
    const map = this.make.tilemap({
      key: "tilemap",
    });

    const isoTileset = map.addTilesetImage("iso_test", "iso_test", 32, 32);
    const waterTileset = map.addTilesetImage("water", "water", 32, 32);

    map.createLayer("Tile Layer 1", [isoTileset, waterTileset]);
    map.createLayer("Tile Layer 2", [isoTileset, waterTileset]);
    map.createLayer("Tile Layer 3", [isoTileset, waterTileset]);
    map.createLayer("Movement", [isoTileset, waterTileset]);
    map.createLayer("Cursor", [isoTileset, waterTileset]);
    map.createLayer("Character", [isoTileset, waterTileset]);
    map.createLayer("Props", [isoTileset, waterTileset]);

    this.animatedTiles.init(map);

    console.log(map);
    // @ts-expect-error
    window.map = map;

    /**
     * https://github.com/photonstorm/phaser/issues/5644
     */
    // @ts-ignore
    Tilemaps.TilemapLayer.prototype.putTileAt = function (
      tile: number | Phaser.Tilemaps.Tile,
      tileX: number,
      tileY: number,
      recalculateFaces?: boolean,
    ) {
      if (recalculateFaces === undefined) {
        recalculateFaces = true;
      }

      if (
        !Phaser.Tilemaps.Components.IsInLayerBounds(tileX, tileY, this.layer)
      ) {
        return null;
      }

      var oldTile = this.layer.data[tileY][tileX];
      var oldTileCollides = oldTile && oldTile.collides;

      if (tile instanceof Phaser.Tilemaps.Tile) {
        this.layer.data[tileY][tileX] = new Phaser.Tilemaps.Tile(
          this.layer,
          tile.index,
          tileX,
          tileY,
          tile.width,
          tile.height,
          this.layer.baseTileWidth,
          this.layer.baseTileHeight,
        );
        this.layer.data[tileY][tileX].copy(tile);
      } else {
        var tileset = this.layer.tilemapLayer.gidMap[tile];
        var index = tile;
        this.layer.data[tileY][tileX] = new Phaser.Tilemaps.Tile(
          this.layer,
          index,
          tileX,
          tileY,
          tileset.tileWidth,
          tileset.tileHeight,
          this.layer.baseTileWidth,
          this.layer.baseTileHeight,
        );
      }

      // Updating colliding flag on the new tile
      var newTile = this.layer.data[tileY][tileX];
      var collides = this.layer.collideIndexes.indexOf(newTile.index) !== -1;

      Phaser.Tilemaps.Components.SetTileCollision(newTile, collides);

      // Recalculate faces only if the colliding flag at (tileX, tileY) has changed
      if (recalculateFaces && oldTileCollides !== newTile.collides) {
        Phaser.Tilemaps.Components.CalculateFacesAt(tileX, tileY, this.layer);
      }

      return newTile;
    };

    map.getLayer("Tile Layer 1").tilemapLayer.putTileAt(23, 4, 4);

    this.cameras.main.zoom = 2;
    this.cameras.main.centerOn(0, 200);

    const cursors = this.input.keyboard.createCursorKeys();
    const controlConfig: Phaser.Types.Cameras.Controls.FixedKeyControlConfig = {
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5,
    };
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl(controlConfig);
  }

  override update(_time: number, delta: number) {
    if (!this.sys.isActive()) {
      console.log("not active yet");
      return;
    }

    this.controls.update(delta);
    this.animatedTiles.updateAnimatedTiles();
  }
}

const config: Phaser.Types.Core.GameConfig = {
  antialias: false,
  backgroundColor: "#125555",
  width: 1280,
  height: 720,
  parent: "app",
  pixelArt: true,
  plugins: {
    scene: [
      {
        key: AnimatedTiles.key,
        plugin: AnimatedTiles,
        mapping: AnimatedTiles.mapping,
        start: true,
      },
    ],
  },
  scene: Demo,
  type: Phaser.AUTO,
};

new Phaser.Game(config);
