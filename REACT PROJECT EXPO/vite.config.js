import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.dirname(fileURLToPath(import.meta.url))
const shorelineDataRoot = fs.existsSync(path.resolve(projectRoot, '../dashboard-react/public'))
  ? path.resolve(projectRoot, '../dashboard-react/public')
  : path.resolve(projectRoot, 'public')
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

        const targetFile = path.join(shorelineDataRoot, fileName)
        if (!fs.existsSync(targetFile)) return next()

        response.setHeader('Content-Type', 'application/geo+json')
        fs.createReadStream(targetFile).pipe(response)
      })
    },
    buildStart() {
      if (command !== 'build') return
      for (const fileName of shorelineFiles) {
        const targetFile = path.join(shorelineDataRoot, fileName)
        if (fs.existsSync(targetFile)) {
          this.emitFile({
            type: 'asset',
            fileName,
            source: fs.readFileSync(targetFile),
          })
        }
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), existingShorelineData()],
  server: {
    watch: {
      ignored: ['**/*.mp4'],
    },
  },
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
