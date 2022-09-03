import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';
import { defineConfig } from 'vite';

const srcDir = resolve(__dirname, 'src');

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],
    resolve: {
        alias: {
            src: srcDir,
            '@features': resolve(srcDir, 'app', 'features'),
            '@lib': resolve(srcDir, 'app', 'lib'),
        },
    },
    build: {
        rollupOptions: {
            input: {
                app: resolve(srcDir, 'app', 'index.html'),
                background: resolve(srcDir, 'background', 'index.ts'),
            },
            output: {
                entryFileNames: (chunk) => `src/${chunk.name}/index.js`,
            },
        },
    },
});
