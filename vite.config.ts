import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Required for GitHub Pages + your custom domain
  base: '/',

  plugins: [react()],

  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
