import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
import leaderboard from '../db/leaderboard.json'
import teams from '../db/teams.json'
import presidents from '../db/presidents.json'

const app = new Hono()

app.get('/', (c) =>
  c.json([
    {
      endpoint: '/leaderboard',
      description: 'Returns the leaderboard'
    },
    {
      endpoint: '/teams',
      description: 'Returns the teams'
    },
    {
      endpoint: '/presidents',
      description: 'Returns the presidents'
    }
  ])
)

app.get('/leaderboard', (c) => c.json(leaderboard))
app.get('/teams', (c) => c.json(teams))
app.get('/presidents', (c) => c.json(presidents))
app.get('/presidents/:id', (c) => {
  const id = c.req.param('id')
  const president = presidents.find((president) => president.id === id)

  return president
    ? c.json(president)
    : c.json({ message: 'President not found' }, 404)
})
app.get('/static/*', serveStatic({ root: './' }))

export default app