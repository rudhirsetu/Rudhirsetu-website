import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
    }),
  ],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks
          react: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
          sanity: ['@sanity/client', '@sanity/image-url'],
        },
        assetFileNames: (assetInfo) => {
          // Optimize asset file naming and caching
          if (assetInfo.name?.endsWith('.webp') || assetInfo.name?.endsWith('.png') || assetInfo.name?.endsWith('.jpg')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    chunkSizeWarningLimit: 600,
    // Optimize static assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
  },
})
