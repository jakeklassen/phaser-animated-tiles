/**
 * @type {import('vite').UserConfig}
 */
const config = {
  // We can't have base64 images - they won't work with Phaser tilemaps
  assetsInlineLimit: 0,
};

export default config;
