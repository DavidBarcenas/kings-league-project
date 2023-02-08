import * as cheerio from 'cheerio'
import { getLeaderBoard } from './leaderboard.js'
import { getMVP } from './mvp.js'
import { logError, logInfo, logSuccess } from './log.js'
import { writeDBFile } from '../db/index.js'
import { getTopScorer } from './top_scorer.js'
import { getAssists } from './top-assists.js'

export const scrapings = {
  leaderboard: {
    url: 'https://kingsleague.pro/estadisticas/clasificacion/',
    scraper: getLeaderBoard
  },
  mvp: {
    url: 'https://kingsleague.pro/estadisticas/mvp/',
    scraper: getMVP
  },
  top_scorer: {
    url: 'https://kingsleague.pro/estadisticas/goles/',
    scraper: getTopScorer
  },
  assists: {
    url: 'https://kingsleague.pro/estadisticas/asistencias/',
    scraper: getAssists
  }
}

export async function scrape(url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

export async function scrapeAndSave(name) {
  const start = performance.now()

  try {
    const { scraper, url } = scrapings[name]

    logInfo(`Scraping [${name}]...`)
    const $ = await scrape(url)
    const content = await scraper($)
    logSuccess(`[${name}] scraped successfully`)

    logInfo(`Writing [${name}] to database...`)
    await writeDBFile(name, content)
    logSuccess(`[${name}] written successfully`)
  } catch (error) {
    logError(`Error scraping [${name}]`)
    logError(error)
  } finally {
    const end = performance.now()
    const time = (end - start) / 1000
    logInfo(`[${name}] scraped in ${time} seconds`)
  }
}
