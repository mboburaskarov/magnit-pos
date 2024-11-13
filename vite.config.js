import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 8000 },
  resolve: {
    paths: { '@/*': ['./src/*'] },
    alias: { '@': path.resolve(__dirname, 'src'), paths: { '@/*': ['./src/*'] } },
  },
  checkjs: true,
})
