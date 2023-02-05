export const getAllTeams = async () => {
  try {
    const response = await fetch('https://kings-league-api.daveeb.workers.dev/teams')
    const teams = await response.json()
    return teams
  } catch (error) {
    return []
  }
}
