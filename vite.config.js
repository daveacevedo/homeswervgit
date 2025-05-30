import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Add optimizeDeps configuration to help with dependency pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@headlessui/react',
      '@heroicons/react',
      'chart.js',
      'react-chartjs-2',
      'date-fns'
    ]
  },
  // Reduce build optimization to avoid potential deadlocks
  build: {
    sourcemap: false, // Disable source maps to prevent file system errors
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react'],
          charts: ['chart.js', 'react-chartjs-2']
        }
      }
    }
  },
  // Increase memory limit for Node.js
  server: {
    hmr: {
      overlay: false
    },
    host: true, // Listen on all addresses
    port: 5173, // Specify a port
    strictPort: false, // Allow fallback to another port if 5173 is taken
    open: true // Open browser automatically
  }
})
