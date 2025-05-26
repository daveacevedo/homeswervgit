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
    sourcemap: true,
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
    }
  },
  // Disable file system APIs that are not supported in WebContainer
  define: {
    'window.showDirectoryPicker': 'undefined',
    'window.showOpenFilePicker': 'undefined',
    'window.showSaveFilePicker': 'undefined'
  }
})
