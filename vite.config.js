import react from '@vitejs/plugin-react'
import * as path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 8000, host: true },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'components'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@constants': path.resolve(__dirname, 'constants'),
      '@icons': path.resolve(__dirname, 'src/assets/icons'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
    },
  },
  checkjs: true,
})
