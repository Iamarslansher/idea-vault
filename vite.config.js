import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) return 'vendor-firebase';
            if (id.includes('react-router') || id.includes('@reduxjs') || id.includes('react-redux')) return 'vendor-framework';
            if (id.includes('framer-motion') || id.includes('lucide-react')) return 'vendor-ui';
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1200,
  },
});
