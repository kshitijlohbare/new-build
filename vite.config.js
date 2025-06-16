import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  
  return {
    // Add timestamp for cache busting
    plugins: [react()],
    optimizeDeps: {
      force: true // Force dependency pre-bundling
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, './src')
      }
    },
    define: {
      'import.meta.env.VITE_APP_DOMAIN': JSON.stringify(isProd ? 'caktuscoco.com' : 'localhost'),
      'import.meta.env.VITE_APP_URL': JSON.stringify(isProd ? 'https://caktuscoco.com' : 'http://localhost:5173'),
    },
    server: {
      port: 5173,
      fs: {
        strict: true,
      },
      // Simple SPA fallback - let Vite handle it
      historyApiFallback: true
    },
    preview: {
      port: 5173,
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html')
        },
        output: {
          manualChunks: {
            // Split vendor chunks
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-ui': ['@radix-ui/react-avatar', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-label', '@radix-ui/react-tabs'],
            'vendor-charts': ['recharts'],
            'vendor-emoji': ['@emoji-mart/data', '@emoji-mart/react'],
            'vendor-tanstack': ['@tanstack/react-query'],
            'vendor-supabase': ['@supabase/supabase-js'],
            // Split app chunks by feature
            'feature-auth': [
              './src/components/auth/AuthCallback.tsx', 
              './src/components/auth/Login.tsx', 
              './src/components/auth/Register.tsx',
              './src/components/auth/ProtectedRoute.tsx'
            ],
            'feature-meditation': ['./src/pages/Meditation.tsx'],
            'feature-practices': ['./src/pages/Practices.tsx'],
          },
        },
      },
      // Increase the warning limit for bundle size
      chunkSizeWarningLimit: 800,
    }
  }
})
