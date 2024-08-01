import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoaderPlugin from 'vite-svg-loader';

function createSvgLoaderPlugin() {
  return svgLoaderPlugin({
    svgo: true,
    defaultImport: 'component',
  });
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgLoaderPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
});
