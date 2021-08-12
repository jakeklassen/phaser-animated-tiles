// import tilemap from "./fixtures/desert-external-tilesets/tilemap.json";
// import { AnimatedTiles } from "./animated-tiles";
// import { mocked } from "ts-jest/utils";
import Phaser from "phaser";

// jest.mock("phaser");
// We need to mock this since it causes errors during boot
// jest.mock("phaser/src/physics/matter-js/components/Transform.js");

// type TilemapFixture = typeof tilemap;

// TODO: Need to create a PHASER tilemap fixture or load it

describe("AnimatedTiles", () => {
  let game: Phaser.Game;

  beforeAll((done) => {
    document.body.innerHTML = `<div id="game"></div>`;

    game = new Phaser.Game({
      type: Phaser.HEADLESS,
      audio: {
        noAudio: true,
      },
      customEnvironment: true,
      parent: "game",
      callbacks: {
        postBoot() {
          console.log("post boot");
          game.loop.stop();
        },
      },
      // plugins: {
      //   scene: [
      //     {
      //       key: AnimatedTiles.key,
      //       plugin: AnimatedTiles,
      //       mapping: AnimatedTiles.mapping,
      //       start: true,
      //     },
      //   ],
      // },
      scene: {
        init() {
          console.log("scene init");
          done();
        },
      },
    });
  });

  afterAll(() => {
    if (game == null) {
      return;
    }

    game.destroy(true, true);
  });

  it("should be constructable", async () => {
    // const scene = TestScene({});

    // const game = new Phaser.Game({
    //   type: Phaser.HEADLESS,
    //   callbacks: {
    //     postBoot() {
    //       game.loop.stop();
    //     },
    //   },
    //   // plugins: {
    //   //   scene: [
    //   //     {
    //   //       key: AnimatedTiles.key,
    //   //       plugin: AnimatedTiles,
    //   //       mapping: AnimatedTiles.mapping,
    //   //       start: true,
    //   //     },
    //   //   ],
    //   // },
    //   scene: {
    //     init() {
    //       console.log("init");
    //     },
    //   },
    // });

    console.log(game.scene.getScenes());

    // const mockPluginManager = mocked(
    //   new Phaser.Plugins.PluginManager(game),
    //   true,
    // );

    // const instance = new AnimatedTiles(
    //   game.scene.getScene("test"),
    //   new Phaser.Plugins.PluginManager(game),
    //   AnimatedTiles.key,
    // );

    // expect(instance).toBeInstanceOf(AnimatedTiles);
  });
});
