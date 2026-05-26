import react from '@vitejs/plugin-react'
import * as path from 'path'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const isElectron = process.env.ELECTRON === 'true'

// https://vitejs.dev/config/
export default defineConfig({
  base: isElectron ? './' : '/',
  plugins: [
    react(),
    ...(isElectron ? [] : [VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['faviconpos.svg', 'MagnitLogo.svg', 'MagnitManagementLogo.svg', 'MagnitPOS.svg', 'no-img.png', 'uzum.png'],
      manifest: {
        name: 'Magnit POS',
        short_name: 'Magnit POS',
        description: 'Magnit Point of Sale',
        theme_color: '#0B1220',
        background_color: '#F4F6FA',
        display: 'standalone',
        orientation: 'landscape',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 5000000, // 5MB
        runtimeCaching: [
          {
            urlPattern: /\/api\//i,
            handler: 'NetworkOnly',
          },
        ],
      },
    })]),
  ],
  server: { port: 8000, host: true },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'components'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@constants': path.resolve(__dirname, 'constants'),
      '@icons': path.resolve(__dirname, 'src/assets/icons'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      ...(isElectron ? { 'virtual:pwa-register/react': path.resolve(__dirname, 'utils/pwa-stub.js') } : {}),
    },
  },
  checkjs: true,
})
