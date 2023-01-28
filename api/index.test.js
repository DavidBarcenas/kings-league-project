import { unstable_dev as unstableDev } from 'wrangler'
import { describe, expect, it, beforeAll, afterAll } from 'vitest'

describe('Worker', () => {
  let worker

  beforeAll(async () => {
    worker = await unstableDev('api/index.js', {
      experimental: { disableExperimentalWarning: true }
    })
  })

  afterAll(async () => {
    await worker.stop()
  })

  it('routes should have endpoint and description', async () => {
    const resp = await worker.fetch()
    if (resp) {
      const apiRoutes = await resp.json()
      apiRoutes.forEach((endpoint) => {
        expect(endpoint).toHaveProperty('endpoint')
        expect(endpoint).toHaveProperty('description')
      })
    }
  })
})

describe('Testing /teams route', () => {
  let worker

  beforeAll(async () => {
    worker = await unstableDev('api/index.js', {
      experimental: { disableExperimentalWarning: true }
    })
  })

  afterAll(async () => {
    await worker.stop()
  })

  it('the teams should have all props', async () => {
    const resp = await worker.fetch('/teams')
    if (resp) {
      const teams = await resp.json()
      const numberTeams = Object.entries(teams).length

      teams.forEach((team) => {
        expect(team).toHaveProperty('id')
        expect(team).toHaveProperty('name')
        expect(team).toHaveProperty('image')
        expect(team).toHaveProperty('url')
        expect(team).toHaveProperty('presidentId')
        expect(team).toHaveProperty('channel')
        expect(team).toHaveProperty('coach')
        expect(team).toHaveProperty('socialNetworks')
        expect(team).toHaveProperty('players')
      })

      expect(numberTeams).toBe(12)
    }
  })

  it('should return 404 for unknown team', async () => {
    const resp = await worker.fetch('/teams/unknown')
    expect(resp.status).toBe(404)
  })

  it('should return 404 for unknown president', async () => {
    const resp = await worker.fetch('/presidents/unknown')
    const respJson = await resp.json()
    expect(respJson.message).toBe('President not found')
    expect(resp.status).toBe(404)
  })

  it('should return 404 for unknown team', async () => {
    const resp = await worker.fetch('/teams/unknown')
    const respJson = await resp.json()
    expect(respJson.message).toBe('Team not found')
    expect(resp.status).toBe(404)
  })
})
