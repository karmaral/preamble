import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import webExtension, { readJsonFile } from 'vite-plugin-web-extension';
import { resolve } from 'path';

const srcDir = resolve(__dirname, 'src');

function generateManifest() {
  const manifest = readJsonFile("src/manifest.json");
  const pkg = readJsonFile("package.json");
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    webExtension({
      manifest: generateManifest,
      watchFilePaths: ['package.json', 'manifest.json'],
    }),
  ],
  resolve: {
    alias: {
      src: srcDir,
      '$features': resolve(srcDir, 'app', 'features'),
      '$lib': resolve(srcDir, 'app', 'lib'),
      '$stores': resolve(srcDir, 'app', 'lib', 'stores.ts'),
    },
  },
});
