import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const server = spawn('npx', ['vite', 'preview', '--host', '--port', '5173'], {
  cwd: __dirname,
  stdio: 'inherit'
})

server.on('error', (err) => {
  console.error('Server failed to start:', err)
  process.exit(1)
})

process.on('SIGTERM', () => {
  server.kill()
  process.exit()
})