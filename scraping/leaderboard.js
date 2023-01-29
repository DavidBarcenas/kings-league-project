import { presidents, teams } from '../db/index.js'

const leaderBoardSelectors = {
  team: { selector: '.fs-table-text_3', typeOf: 'string' },
  wins: { selector: '.fs-table-text_4', typeOf: 'number' },
  loses: { selector: '.fs-table-text_5', typeOf: 'number' },
  goalsScored: { selector: '.fs-table-text_6', typeOf: 'number' },
  goalsConceded: { selector: '.fs-table-text_7', typeOf: 'number' },
  yellowCards: { selector: '.fs-table-text_8', typeOf: 'number' },
  redCards: { selector: '.fs-table-text_9', typeOf: 'number' }
}

export async function getLeaderBoard($) {
  const $rows = $('table tbody tr')
  const leaderBoard = []

  const getTeam = ({ name }) => {
    const { presidentId, ...restOfTeam } = teams.find((team) => team.name === name)
    const president = presidents.find((preident) => preident.id === presidentId)
    return { ...restOfTeam, president }
  }

  $rows.each((i, el) => {
    const leaderBoardEntries = Object.entries(leaderBoardSelectors).map(
      ([key, { selector, typeOf }]) => {
        const rowValue = $(el).find(selector).text().trim()
        const value = typeOf === 'number' ? Number(rowValue) : rowValue
        return [key, value]
      }
    )

    const { team: teamName, ...leaderBoardTeam } = Object.fromEntries(leaderBoardEntries)
    const team = getTeam({ name: teamName })
    leaderBoard.push({ team, ...leaderBoardTeam })
  })

  return leaderBoard
}
