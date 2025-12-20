import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://bellavista-backend-env.eba-7zhec9xm.eu-west-2.elasticbeanstalk.com',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://bellavista-backend-env.eba-7zhec9xm.eu-west-2.elasticbeanstalk.com',
        changeOrigin: true,
      }
    }
  },
  define: {
    'process.env.PUBLIC_URL': JSON.stringify(''),
  },
})
