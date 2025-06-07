import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Node modules chunking
          if (id.includes('node_modules')) {
            // Vue ecosystem
            if (id.includes('vue') || id.includes('@vue')) {
              return 'vue-vendor';
            }

            // UI libraries (reka-ui and lucide icons)
            if (id.includes('reka-ui') || id.includes('lucide-vue-next') || id.includes('class-variance-authority')) {
              return 'ui-vendor';
            }

            // Utility libraries
            if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('@vueuse')) {
              return 'utils-vendor';
            }

            // QR Code and image processing
            if (id.includes('qrcode') || id.includes('html2canvas')) {
              return 'qr-vendor';
            }

            // Internationalization
            if (id.includes('vue-i18n') || id.includes('@intlify')) {
              return 'i18n-vendor';
            }

            // State management
            if (id.includes('pinia')) {
              return 'state-vendor';
            }

            // Other vendor libraries
            return 'vendor';
          }

          // App code chunking
          if (id.includes('src/components/ui')) {
            return 'ui-components';
          }

          if (id.includes('src/components')) {
            return 'components';
          }

          if (id.includes('src/composables')) {
            return 'composables';
          }

          if (id.includes('src/utils')) {
            return 'utils';
          }

          if (id.includes('src/locales')) {
            return 'locales';
          }
        },
      },
    },
    // Increase chunk size warning limit to 600kb
    chunkSizeWarningLimit: 600,
    // Enable source maps for better debugging
    sourcemap: true,
  },
})
