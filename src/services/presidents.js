export const findPresidentBy = async ({ id }) => {
  try {
    const response = await fetch(`https://kings-league-api.daveeb.workers.dev/presidents/${id}`)
    const president = await response.json()
    return president
  } catch (e) {
    // enviar el error a un servicio de reporte de errores
    return null
  }
}
