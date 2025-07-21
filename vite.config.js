import react from '@vitejs/plugin-react'
import * as path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 8000, host: true },
  resolve: {
    paths: { '@/*': ['./src/*'] },
    alias: { '@': path.resolve(__dirname, 'src'), paths: { '@/*': ['./src/*'] } },
  },
  checkjs: true,
})
