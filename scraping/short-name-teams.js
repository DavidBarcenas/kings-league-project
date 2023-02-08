import { teams } from '../db/index.js'

export function getShortNameTeams() {
  const shortNames = {
    'los-troncos-fc': 'TFC',
    '1k': '1K',
    'el-barrio': 'RDB',
    'ultimate-mostoles': 'ULT',
    'saiyans-fc': 'SAI',
    kunisports: 'KNS',
    'jijantes-fc': 'JFC',
    'rayo-barcelona': 'RDB',
    'porcinos-fc': 'POR',
    'xbuyer-team': 'XBU',
    'aniquiladores-fc': 'ANI',
    'pio-fc': 'PIO'
  }

  return teams.map((team) => {
    return {
      ...team,
      shortName: shortNames[team.id]
    }
  })
}
