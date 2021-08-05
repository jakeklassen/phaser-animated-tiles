/**
 * @type {import('vite').UserConfig}
 */
const config = {
  assetsInclude: [
    "./src/assets/maps/desert-external-tilesets/desert.json",
    "./src/assets/maps/desert-external-tilesets/water.json",
  ],
  // We can't have base64 images - they won't work with Phaser tilemaps
  assetsInlineLimit: 0,
};

export default config;
