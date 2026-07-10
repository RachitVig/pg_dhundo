import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
    // Generate sourcemaps in production for easier debugging on Vercel
    sourcemap: false,
    // Raise the chunk size warning limit (leaflet etc. are large)
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Split vendor code into a separate chunk for better caching
        manualChunks: {
          motion: ['framer-motion'],
          maps:   ['leaflet', 'react-leaflet'],
        },
      },
    },
  },
  // Proxy API calls in dev so CORS is not needed when running locally
  server: {
    proxy: {
      '/pgs':   { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/auth':  { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/admin': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/chat':  { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/ws':    { target: 'ws://127.0.0.1:8000',   changeOrigin: true, ws: true },
      '/seed':  { target: 'http://127.0.0.1:8000', changeOrigin: true },
    },
  },
});