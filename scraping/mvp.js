import { teams } from '../db/index.js'

const mvpSelectors = {
  rank: { selector: '.fs-table-text_1', typeOf: 'number' },
  team: { selector: '.fs-table-text_3', typeOf: 'string' },
  playerName: { selector: '.fs-table-text_4', typeOf: 'string' },
  gamesPlayed: { selector: '.fs-table-text_5', typeOf: 'number' },
  mvps: { selector: '.fs-table-text_6', typeOf: 'number' }
}

export async function getMVP($) {
  const $rows = $('table tbody tr')
  const mvpSelectorEntries = Object.entries(mvpSelectors)
  const mvpList = []

  const getImageFromTeam = ({ name }) => {
    const { image } = teams.find((team) => team.name === name)
    return image
  }

  $rows.each((i, el) => {
    const mvpEntries = mvpSelectorEntries.map(([key, { selector, typeOf }]) => {
      const rowValue = $(el).find(selector).text().trim()
      const value = typeOf === 'number' ? Number(rowValue) : rowValue

      return [key, value]
    })
    const { team: teamName, ...mvp } = Object.fromEntries(mvpEntries)
    const image = getImageFromTeam({ name: teamName })
    mvpList.push({
      ...mvp,
      team: teamName,
      image,
      rank: i + 1
    })
  })

  return mvpList
}
