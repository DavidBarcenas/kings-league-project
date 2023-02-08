import { writeDBFile } from 'db/index.js'
import { logInfo } from './log.js'
import { getShortNameTeams } from './short-name-teams.js'
import { getURLTeams } from './url-teams.js'
import { scrapings, scrapeAndSave } from './utils.js'

// get first parameter from command line
const scrapeParameter = process.argv.at(-1)

if (scrapings[scrapeParameter]) {
  await scrapeAndSave(scrapeParameter)
} else {
  logInfo('Scraping all data...')

  for (const infoToScrape of Object.keys(scrapings)) {
    await scrapeAndSave(infoToScrape)
  }

  const teamsWithUrl = await getURLTeams()
  await writeDBFile('teams', teamsWithUrl)

  // Update file of teams.json with short name of each team
  await writeDBFile('teams', getShortNameTeams())
}
