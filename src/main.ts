import "phaser";
import { AnimatedTiles } from "./plugins/animated-tiles";

export default class Demo extends Phaser.Scene {
  controls?: Phaser.Cameras.Controls.FixedKeyControl;
  animatedTiles!: AnimatedTiles;

  constructor() {
    super("demo");
  }

  preload() {
    this.load.image("iso_test", "/assets/maps/desert/tileset.png");
    this.load.image("water", "/assets/maps/desert/water.png");
    this.load.tilemapTiledJSON("map", "/assets/maps/desert/desert.json");
  }

  create() {
    const map = this.make.tilemap({
      key: "map",
      tileWidth: 32,
      tileHeight: 32,
      width: 100,
      height: 100,
    });

    const isoTileset = map.addTilesetImage("iso_test", "iso_test", 32, 32);
    const waterTileset = map.addTilesetImage("water", "water", 32, 32);

    map.createLayer("Tile Layer 1", [isoTileset, waterTileset]);
    map.createLayer("Tile Layer 2", [isoTileset, waterTileset]);
    map.createLayer("Tile Layer 3", [isoTileset, waterTileset]);
    map.createLayer("Props", [isoTileset, waterTileset]);

    this.animatedTiles.init(map);

    this.cameras.main.zoom = 2;
    this.cameras.main.setScroll(400, 100);

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
    this.controls?.update(delta);

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
