import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
//import mkcert from 'vite-plugin-mkcert'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss()
    //mkcert()  // ← Enables HTTPS locally
  ],

  server: {
    host: true,
    port: 5174,
    allowedHosts: [
      'ghfb.forjasbolivar.com'
    ]
  },

  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
})
