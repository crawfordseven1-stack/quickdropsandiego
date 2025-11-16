// vite.config.js

import { defineConfig } from 'vite';
// IMPORT FRAMEWORK PLUGIN HERE (e.g., if using React, uncomment below)
// import react from '@vitejs/plugin-react';

export default defineConfig({
  // 🔑 CRITICAL DEPLOYMENT FIX:
  // Set the base path to the absolute root '/' (forward slash).
  // This is the definitive fix for asset loading errors on your custom domain.
  base: '/', 

  plugins: [
    // Add your framework plugin here (e.g., react()), or leave blank if using vanilla JS
  ],

  // 🎨 TAILWIND CSS CONFIGURATION:
  // This tells Vite/PostCSS to process your styles and build Tailwind CSS.
  css: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  
  // 📦 OPTIONAL: Ensures output goes to the correct folder
  build: {
    outDir: 'dist', 
  },
});
