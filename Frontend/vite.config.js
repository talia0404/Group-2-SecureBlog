import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('ssl/privatekey.pem'),
      cert: fs.readFileSync('ssl/certificate.pem'),
    },
    port: 5173
  }
});
