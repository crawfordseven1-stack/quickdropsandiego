// vite.config.js

import { defineConfig } from 'vite';
// If you are using React, Vue, or another framework, you'd import its plugin here:
// import react from '@vitejs/plugin-react';

// Import the official Tailwind CSS Vite plugin
import tailwindcss from '@tailwindcss/vite'; 

export default defineConfig({
  // **Deployment Fix for Custom Domains**
  // Set the base path to '.' to use relative paths. This fixes asset loading
  // issues (CSS, JS, images) when deploying to GitHub Pages under a custom domain.
  // Using '/' often works, but './' is more robust for assets.
  base: './', 

  plugins: [
    // Include your framework plugin here (e.g., react(), vue())
    // react(), 
    
    // Add the Tailwind CSS plugin to the list of plugins
    tailwindcss(),
  ],
  
  // You may also include other configuration blocks if needed, 
  // such as for PostCSS if you are not using the dedicated plugin:
  // css: {
  //   postcss: {
  //     plugins: [tailwindcss()],
  //   },
  // },
});
