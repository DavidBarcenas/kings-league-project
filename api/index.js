import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import leaderboard from '../db/leaderboard.json'

const app = new Hono()

app.get('/', (c) => c.json([
  {
    endpoint: '/leaderboard',
    description: 'Returns the leaderboard'
  }
]))

app.get('/leaderboard', (c) => {
  return c.json(leaderboard)
})

app.get('/static/*', serveStatic({ root: './' }))

export default app
