#!/usr/bin/env node
/* Small wrapper to start Vite programmatically and enable HTTPS when dev certs exist at /certs */
const fs = require('fs')
const path = require('path')
const { createServer } = require('vite')

async function start() {
  const host = process.env.HOST || '0.0.0.0'
  const port = process.env.PORT ? Number(process.env.PORT) : 5173

  const certPath = '/certs/dev.crt'
  const keyPath = '/certs/dev.key'
  let https = false
  try {
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      https = {
        cert: fs.readFileSync(certPath),
        key: fs.readFileSync(keyPath),
      }
      console.log('dev-serve: using HTTPS with certs mounted at /certs')
    } else {
      console.log('dev-serve: no dev certs found at /certs, falling back to HTTP')
    }
  } catch (err) {
    console.warn('dev-serve: error checking /certs, falling back to HTTP', err)
  }

  const server = await createServer({
    // keep other config from vite.config.ts, only override server options
    server: {
      host,
      port,
      https,
    },
  })

  await server.listen()

  const protocol = https ? 'https' : 'http'
  // Prefer printing localhost for developer convenience
  const displayHost = host === '0.0.0.0' ? 'localhost' : host
  console.log(`Vite dev server running at ${protocol}://${displayHost}:${port}/`)
}

start().catch((err) => {
  console.error('dev-serve: failed to start', err)
  process.exit(1)
})
