import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Em dev, sem VITE_API_URL, requisições a /frequencia são encaminhadas ao backend
      '/frequencia': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
