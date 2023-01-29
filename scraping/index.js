import { scrapings, scrapeAndSave } from './utils.js'

for (const infoToScrape of Object.keys(scrapings)) {
  await scrapeAndSave(infoToScrape)
}
