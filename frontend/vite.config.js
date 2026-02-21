import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Em dev, sem VITE_API_URL, requisições à API são encaminhadas ao backend (lê backend/data/frequencias.json)
      '/frequencia': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/relatorio': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/estagiario': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
