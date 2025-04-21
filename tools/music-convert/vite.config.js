import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // The URL prefix Netlify will use
  base: '/tools/music-conv/',
  build: {
    // Output folder goes one level up, into tools/music-conv
    outDir: '../music-conv',
    emptyOutDir: true
  }
});
