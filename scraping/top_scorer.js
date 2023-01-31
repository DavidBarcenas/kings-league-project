import { teams } from '../db/index.js'

const scoresSelectors = {
  ranking: { selector: '.fs-table-text_1', typeOf: 'string' },
  team: { selector: '.fs-table-text_3', typeOf: 'string' },
  playerName: { selector: '.fs-table-text_4', typeOf: 'string' },
  gamesPlayed: { selector: '.fs-table-text_5', typeOf: 'number' },
  goals: { selector: '.fs-table-text_6', typeOf: 'number' }
}

export async function getTopScorer($) {
  const $rows = $('table tbody tr')

  const getImageFromTeam = ({ name }) => {
    const { image } = teams.find((team) => team.name === name)
    return image
  }

  const scoresSelectorEntries = Object.entries(scoresSelectors)
  const scoreList = []

  $rows.each((index, el) => {
    const scoreEntries = scoresSelectorEntries.map(([key, { selector, typeOf }]) => {
      const rowValue = $(el).find(selector).text().trim()
      const value = typeOf === 'number' ? Number(rowValue) : rowValue

      return [key, value]
    })

    const { team: teamName, ...scoreData } = Object.fromEntries(scoreEntries)
    const image = getImageFromTeam({ name: teamName })

    scoreList.push({
      ...scoreData,
      rank: index + 1,
      team: teamName,
      image
    })
  })

  return scoreList
}
