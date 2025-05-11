import { fileURLToPath, URL } from 'node:url';

import type { Plugin } from 'vite';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';
import svgLoaderPlugin from 'vite-svg-loader';

function createSvgLoaderPlugin(): Plugin<any> {
  return svgLoaderPlugin({
    svgo: true,
    defaultImport: 'component',
  });
}

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "scss/colors/index.scss";',
      },
    },
  },
  plugins: [
    vue(),
    eslintPlugin({
      cache: false,
      emitWarning: true,
      failOnError: true,
    }),
    createSvgLoaderPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'scss': fileURLToPath(new URL('./scss', import.meta.url)),
    },
  },
});
