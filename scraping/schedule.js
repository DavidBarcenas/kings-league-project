const selectors = {
  match: '#calendarMatch',
  date: '.el-table-title',
  hour: '.fs-table-text_4',
  locals: '.el-text-1',
  localsImages: '.fs-table-text_3 img',
  visitants: '.el-text-7',
  visitantsImages: '.fs-table-text_5 img',
  scores: '.fs-table-text_8'
}

const maps = {
  'el-bbarrio': 'el-barrio',
  'jijantes-fc': 'jijantes',
  'xbuyer-team': 'xbuyer'
}

const shortNames = {
  'rayo-barcelona': 'RDB',
  '1k': '1K',
  kunisports: 'KNS',
  jijantes: 'JFC',
  'el-barrio': 'ELB',
  pio: 'PIO',
  xbuyer: 'XBU',
  aniquiladores: 'ANI',
  'ultimate-mostoles': 'ULT',
  'saiyans-fc': 'SAI',
  'porcinos-fc': 'POR',
  'los-troncos': 'TFC'
}

export async function getSchedule($) {
  const schedule = []
  const $days = $(selectors.match)

  const getTeamIdFromImageUrl = (url) => {
    return url.slice(url.lastIndexOf('/') + 1).replace(/.(png|svg)/, '')
  }

  $days.each((_, day) => {
    const matches = []
    const $day = $(day)

    const dateRaw = $day.find(selectors.date).text()
    const dateAndLeagueDay = dateRaw.trim()
    const date = dateAndLeagueDay.split('–')[1].trim() // 01/01/2023
    const [dayNumber, monthNumber, yearNumber] = date.split('/')
    const prefixDate = `${yearNumber}-${monthNumber}-${dayNumber}`

    const $locals = $day.find(selectors.locals)
    const $localsImages = $day.find(selectors.localsImages)
    const $visitants = $day.find(selectors.visitants)
    const $visitantsImages = $day.find(selectors.visitantsImages)
    const $results = $day.find(selectors.scores)
    const $hours = $day.find(selectors.hour)

    $results.each((index, result) => {
      const scoreRaw = $(result).text()
      const score = scoreRaw.trim()

      const hourRaw = $($hours[index]).text()
      const hour = hourRaw.replace(/\t|\n|\s:/g, '').trim()

      const matchDate = new Date(`${prefixDate} ${hour} GMT+2`)

      const localNameRaw = $($locals[index]).text()
      const localName = localNameRaw.trim()
      const localImg = $($localsImages[index]).attr('src')
      let localId = getTeamIdFromImageUrl(localImg)
      localId = maps[localId] || localId
      const localShortName = shortNames[localId]

      const visitantNameRaw = $($visitants[index]).text()
      const visitantName = visitantNameRaw.trim()
      const visitantImg = $($visitantsImages[index]).attr('src')
      let visitantId = getTeamIdFromImageUrl(visitantImg)
      visitantId = maps[visitantId] || visitantId
      const visitantShortName = shortNames[visitantId]

      const timestamp = hour === 'vs' ? null : matchDate.getTime()

      matches.push({
        timestamp,
        hour: hour === 'vs' ? null : hour,
        teams: [
          { id: localId, name: localName, shortName: localShortName },
          { id: visitantId, name: visitantName, shortName: visitantShortName }
        ],
        score
      })
    })

    schedule.push({ date, matches })
  })

  return schedule
}
