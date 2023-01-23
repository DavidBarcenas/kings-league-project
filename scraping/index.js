import * as cheerio from 'cheerio'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

const urls = {
  leaderBoard: 'https://kingsleague.pro/estadisticas/clasificacion/'
}

async function scrape (url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

async function getLeaderBoard () {
  const $ = await scrape(urls.leaderBoard)
  const $rows = $('table tbody tr')
  const leaderBoard = []
  const leaderBoardSelectors = {
    team: { selector: '.fs-table-text_3', typeOf: 'string' },
    wins: { selector: '.fs-table-text_4', typeOf: 'number' },
    loses: { selector: '.fs-table-text_5', typeOf: 'number' },
    goalsScored: { selector: '.fs-table-text_6', typeOf: 'number' },
    goalsConceded: { selector: '.fs-table-text_7', typeOf: 'number' },
    yellowCards: { selector: '.fs-table-text_8', typeOf: 'number' },
    redCards: { selector: '.fs-table-text_9', typeOf: 'number' }
  }

  $rows.each((i, el) => {
    const leaderBoardEntries = Object.entries(leaderBoardSelectors).map(([key, { selector, typeOf }]) => {
      const rowValue = $(el).find(selector).text().trim()
      const value = typeOf === 'number' ? Number(rowValue) : rowValue
      return [key, value]
    })
    leaderBoard.push(Object.fromEntries(leaderBoardEntries))
  })

  return leaderBoard
}

const leaderBoard = await getLeaderBoard()

const filePath = path.join(process.cwd(), './db/leaderboard.json')
await writeFile(filePath, JSON.stringify(leaderBoard, null, 4), 'utf-8')
