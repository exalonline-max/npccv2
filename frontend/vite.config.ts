import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: ((): any => {
    const base = {
      host: '0.0.0.0',
      port: 5173,
      // Allow lvh.me subdomains (e.g. admintest1.lvh.me) for multi-tenant dev
      allowedHosts: ['.lvh.me', 'localhost'],
      proxy: {
        '/api': 'https://api.lvh.me:5001'
      }
    }

    // If dev certs are mounted at /certs, enable HTTPS for Vite dev server
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require('fs')
      const certPath = '/certs/dev.crt'
      const keyPath = '/certs/dev.key'
      if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
        return Object.assign({}, base, { https: { cert: fs.readFileSync(certPath), key: fs.readFileSync(keyPath) } })
      }
    } catch (e) {
      // ignore in environments without fs or TS types
    }

    return base
  })(),
  preview: {
    host: '0.0.0.0'
  },
  define: {
    'process.env': {}
  },
  build: {},
  // proxy configured above in the server block
})
