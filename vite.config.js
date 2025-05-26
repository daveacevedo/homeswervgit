import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  // Add optimizeDeps configuration to help with dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@headlessui/react',
      'chart.js',
      'react-chartjs-2',
      'date-fns'
    ]
  },
  // Improved build optimization with better chunking strategy
  build: {
    sourcemap: true,
    minify: 'esbuild',
    chunkSizeWarningLimit: 600, // Increase the warning limit slightly
    rollupOptions: {
      output: {
        manualChunks: {
          // Core libraries
          'react-core': ['react', 'react-dom'],
          
          // Routing
          'router': ['react-router-dom'],
          
          // UI components
          'ui-components': ['@headlessui/react'],
          
          // Form handling
          'forms': ['react-hook-form'],
          
          // Data visualization
          'charts': ['chart.js', 'react-chartjs-2'],
          
          // Date utilities
          'date-utils': ['date-fns'],
          
          // Supabase related
          'supabase': ['@supabase/supabase-js']
        }
      }
    }
  },
  // Configure server to use a specific port and fix timeout issues
  server: {
    port: 5174, // Set a specific port to avoid conflicts
    strictPort: false, // Allow Vite to try another port if this one is in use
    hmr: {
      overlay: true,
      timeout: 60000 // Increase timeout to 60 seconds
    },
    watch: {
      usePolling: false
    }
  }
})
