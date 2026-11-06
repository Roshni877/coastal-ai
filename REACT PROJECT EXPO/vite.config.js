import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))
const shorelineDataRoot = path.resolve(projectRoot, '../dashboard-react/public')
const shorelineFiles = [
  'shoreline_2020.geojson',
  'shoreline_2024.geojson',
  'shoreline_predicted.geojson',
]

function existingShorelineData() {
  let command = 'serve'
  return {
    name: 'existing-shoreline-data',
    configResolved(config) {
      command = config.command
    },
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const fileName = request.url?.split('?')[0]?.slice(1)
        if (!shorelineFiles.includes(fileName)) return next()

        response.setHeader('Content-Type', 'application/geo+json')
        fs.createReadStream(path.join(shorelineDataRoot, fileName)).pipe(response)
      })
    },
    buildStart() {
      if (command !== 'build') return
      for (const fileName of shorelineFiles) {
        this.emitFile({
          type: 'asset',
          fileName,
          source: fs.readFileSync(path.join(shorelineDataRoot, fileName)),
        })
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), existingShorelineData()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})
