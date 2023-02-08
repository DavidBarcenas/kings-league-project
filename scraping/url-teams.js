import { teams } from '../db/index.js'

export async function getURLTeams($) {
  /*
		Las url de la información de cada equipo tiene siempre
		el patrón de la url base 'https://kingsleague.pro/team/',
		añadiéndole el id del equipo.
		Se generan siguiendo este patrón de las url de la página
		oficial.
	*/
  return teams.map((team) => {
    return {
      ...team,
      url: `https://kingsleague.pro/team/${team.id}/`
    }
  })
}
