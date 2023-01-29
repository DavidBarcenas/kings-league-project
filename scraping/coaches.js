import * as cheerio from 'cheerio'
import { writeDBFile, teams } from '../db/index.js'

const coachesSelectors = {
  teamName: { selector: '.name.mt10', typeOf: 'string' },
  coach: { selector: '.name.mt20', typeOf: 'string' },
  coachImg: { selector: '.player-circle-box', typeOf: 'string' }
}

const urls = {
  coaches: 'https://es.besoccer.com/competicion/info/kings-league/2023'
}

async function scrape(url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

async function getCoaches() {
  const $ = await scrape(urls.coaches)

  const coachNames = $(coachesSelectors.coach.selector)
    .toArray()
    .map((name) => name.children[0].data)

  const coachImages = $(coachesSelectors.coachImg.selector)
    .toArray()
    .map((img) => {
      const { attribs } = img
      const { src } = attribs
      return src
    })

  const teamNames = $(coachesSelectors.teamName.selector)
    .toArray()
    .map((name) => name.children[0].data)

  const teamsWithCoach = coachNames.map((name, i) => {
    return {
      name,
      teamName: teamNames[i],
      image: coachImages[i]
    }
  })

  return teams.map((team) => {
    const coachInfoTeam = teamsWithCoach.filter(({ teamName }) => {
      return (
        teamName.replace(' FC', '').toLocaleUpperCase() ===
        team.name.replace(' FC', '').toLocaleUpperCase()
      )
    })[0]

    console.log(coachInfoTeam)

    return {
      ...team,
      coachInfo: {
        name: coachInfoTeam.name,
        image: coachInfoTeam.image
      }
    }
  })
}

const teamsWithCoach = await getCoaches()
writeDBFile('teams', teamsWithCoach)
