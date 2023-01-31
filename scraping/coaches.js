const coachesSelectors = {
  teamName: { selector: '.name.mt10', typeOf: 'string' },
  coach: { selector: '.name.mt20', typeOf: 'string' },
  coachImg: { selector: '.player-circle-box', typeOf: 'string' }
}

export async function getCoaches($) {
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

  return teamsWithCoach
}
