// vite.config.js

import { defineConfig } from 'vite';
// 1. Import your framework's plugin (Example: React)
import react from '@vitejs/plugin-react'; 
// 2. Import the official Tailwind CSS Vite plugin (if not using PostCSS)
// import tailwindcss from '@tailwindcss/vite'; 

export default defineConfig({
  // **CRUCIAL FIX FOR GITHUB PAGES**
  // Set the base path to '.' for relative paths, which is necessary 
  // when deploying to a custom domain on GitHub Pages.
  base: './', 

  plugins: [
    // 3. Add the framework plugin to the plugins array
    react(),
    // 4. If using a dedicated plugin: tailwindcss(),
  ],

  // Alternative way to configure Tailwind/PostCSS if needed:
  css: {
    postcss: {
      plugins: [
        // Include any required PostCSS plugins like Tailwind CSS and Autoprefixer
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },
  
  // Optional: Configuration for the build output directory
  build: {
    outDir: 'dist', 
  },
});
