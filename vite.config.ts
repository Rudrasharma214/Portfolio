import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    // three is ~250KB gzipped and cannot be tree-shaken (R3F's reconciler
    // imports the full element catalogue). It is lazy-loaded into its own
    // chunk, so the warning is expected rather than something to fix.
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep the WebGL stack in its own chunk so the hero copy paints first.
          if (id.includes('three') || id.includes('@react-three')) return 'three';
          if (id.includes('react-router')) return 'router';
        },
      },
    },
  },
});
