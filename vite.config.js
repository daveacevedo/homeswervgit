import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@heroicons/react': path.resolve(__dirname, 'node_modules/@heroicons/react/dist/esm'),
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
    ],
    exclude: ['@heroicons/react']
  },
  // Reduce build optimization to avoid potential deadlocks
  build: {
    sourcemap: true,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@headlessui/react'],
          charts: ['chart.js', 'react-chartjs-2']
        }
      }
    }
  },
  // Increase memory limit for Node.js and fix timeout issues
  server: {
    hmr: {
      overlay: false,
      timeout: 0 // Disable timeout
    },
    watch: {
      usePolling: true,
      interval: 1000
    }
  },
  // Disable file system APIs that are not supported in WebContainer
  define: {
    'window.showDirectoryPicker': 'undefined',
    'window.showOpenFilePicker': 'undefined',
    'window.showSaveFilePicker': 'undefined',
    'window.FileSystemHandle': 'undefined',
    'window.FileSystemFileHandle': 'undefined',
    'window.FileSystemDirectoryHandle': 'undefined'
  }
})
