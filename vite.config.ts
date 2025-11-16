// vite.config.js (or vite.config.ts)

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 🚀 Final, correct Vite config for:
// - React
// - TailwindCSS
// - GitHub Pages deployment
// - Custom domain quickdropsd.work

export default defineConfig({
  // ✅ Since you're using a custom domain (quickdropsd.work),
  // base MUST be '/' — this is correct.
  base: '/',

  plugins: [
    react(), // ← REQUIRED for React projects
  ],

  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },

  build: {
    outDir: 'dist', // default for Vite but it's good to keep it explicit
    emptyOutDir: true, 
  },
});
