import * as cheerio from 'cheerio'
import { presidents, teams, writeDBFile } from '../db'

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

  const getTeam = ({ name }) => {
    const { presidentId, ...restOfTeam } = teams.find(team => team.name === name)
    const president = presidents.find(preident => preident.id === presidentId)
    return { ...restOfTeam, president }
  }

  $rows.each((i, el) => {
    const leaderBoardEntries = Object.entries(leaderBoardSelectors).map(([key, { selector, typeOf }]) => {
      const rowValue = $(el).find(selector).text().trim()
      const value = typeOf === 'number' ? Number(rowValue) : rowValue
      return [key, value]
    })

    const { team: teamName, ...leaderBoardTeam } = Object.fromEntries(leaderBoardEntries)
    const team = getTeam({ name: teamName })
    leaderBoard.push({ team, ...leaderBoardTeam })
  })

  return leaderBoard
}

const leaderBoard = await getLeaderBoard()
await writeDBFile('leaderboard', leaderBoard)
