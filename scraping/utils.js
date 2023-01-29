import * as cheerio from 'cheerio'

export const urls = {
  leaderboard: 'https://kingsleague.pro/estadisticas/clasificacion/',
  coaches: 'https://es.besoccer.com/competicion/info/kings-league/2023',
  mvp: 'https://kingsleague.pro/estadisticas/mvp/'
}

export async function scrape(url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}
