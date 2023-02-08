import { teams } from '../db/index.js'
import path from 'node:path'
import { logError, logInfo } from './log.js'
import sharp from 'sharp'

const playersPath = path.join(process.cwd(), './public/teams/players')

const playerSelectors = {
  firstName: { selector: '.fs-grid-meta-3', typeOf: 'string' },
  lastName: { selector: '.fs-grid-text-3', typeOf: 'string' },
  teamName: { selector: '.uk-text-lead', typeOf: 'string' },
  role: { selector: '.fs-grid-meta-1', typeOf: 'string' }
}

let counter = 1000

const extractIdFromUrl = (url) => url.split('/').at(-1).split('.').at(0)

const generateIdForPlayer = ({ teamId, image }) => {
  const imageId = extractIdFromUrl(image)
  const playerId = imageId === 'placeholder' ? counter++ : imageId
  return `${teamId}-${playerId}`
}

export async function getPlayersTwelve($) {
  const $rows = $('div.fs-load-more-item.fs-mw')
  const getTeamFrom = ({ name: teamName }) => teams.find((team) => team.name === teamName)

  const playerSelectorEntries = Object.entries(playerSelectors)
  const players = []

  $rows.each((_, el) => {
    const playerEntries = playerSelectorEntries.map(([key, { selector, typeOf }]) => {
      const rowValue = $(el).find(selector).text().trim()
      const value = typeOf === 'number' ? Number(rowValue) : rowValue

      return [key, value]
    })

    const { teamName, firstName, lastName, ...playerInfo } = Object.fromEntries(playerEntries)
    const name = `${firstName} ${lastName}`
    const team = getTeamFrom({ name: teamName })
    const image = $(el).find('.el-image.uk-invisible').attr('src')

    players.push({
      ...playerInfo,
      firstName,
      lastName,
      image,
      name,
      id: generateIdForPlayer({ teamId: team.id, image }),
      team: {
        id: team.id,
        name: teamName,
        image: team.image,
        imageWhite: team.imageWhite
      }
    })
  })

  for (const player of players) {
    const imageURL = await saveImageWebp(player)
    player.image = imageURL
  }

  return players
}

async function saveImageWebp(player) {
  const { id, image } = player

  if (image.includes('placeholder.png')) {
    return 'placeholder.png'
  }

  try {
    logInfo(`Fetching image for file name: ${id}`)
    const res = await fetch(image)
    const imgArrayBuffer = await res.arrayBuffer()
    const buffer = Buffer.from(imgArrayBuffer)

    logInfo(`Writing image to disk: ${id}`)
    const imageFileName = `${id}.webp`
    const imageFilePath = path.join(playersPath, imageFileName)
    await sharp(buffer).webp().toFile(imageFilePath)
    logInfo(`Everything is done! ${id}`)

    return imageFileName
  } catch (error) {
    logError(error)
  }

  return null
}
