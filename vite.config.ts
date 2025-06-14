import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: './postcss.config.cjs'
  },
  server: {
    host: 'localhost',
    port: 5173,
    open: true,
    // Removed proxy - connecting directly to Supabase
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('lottie-web')) return 'vendor-lottie';
            // Add more libraries as needed
            return 'vendor';
          }
        }
      }
    }
  }
});
