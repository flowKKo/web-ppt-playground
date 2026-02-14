import fs from 'node:fs'
import path from 'node:path'
import type { Plugin } from 'vite'

const USER_DECKS_DIR = path.resolve(__dirname, 'src/data/user-decks')

export default function deckApiPlugin(): Plugin {
  return {
    name: 'deck-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const match = req.url?.match(/^\/__deck-api\/([a-zA-Z0-9_-]+)$/)
        if (!match) return next()

        const id = match[1]

        if (req.method === 'PUT') {
          let body = ''
          req.on('data', (chunk: Buffer) => { body += chunk.toString() })
          req.on('end', () => {
            try {
              JSON.parse(body) // validate JSON
              fs.mkdirSync(USER_DECKS_DIR, { recursive: true })
              fs.writeFileSync(path.join(USER_DECKS_DIR, `${id}.json`), body, 'utf-8')
              res.statusCode = 200
              res.end('ok')
            } catch {
              res.statusCode = 400
              res.end('invalid json')
            }
          })
          return
        }

        if (req.method === 'DELETE') {
          const filePath = path.join(USER_DECKS_DIR, `${id}.json`)
          // Only allow deleting .json files (protect AI-generated .ts)
          if (!fs.existsSync(filePath)) {
            res.statusCode = 404
            res.end('not found')
            return
          }
          fs.unlinkSync(filePath)
          res.statusCode = 200
          res.end('ok')
          return
        }

        res.statusCode = 405
        res.end('method not allowed')
      })
    },
  }
}
