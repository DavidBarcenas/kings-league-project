import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

const dbPath = path.join(process.cwd(), './db')

async function readDBFile(dbName) {
  return readFile(`${dbPath}/${dbName}.json`, 'utf-8').then(JSON.parse)
}

export const teams = await readDBFile('teams')
export const presidents = await readDBFile('presidents')

export function writeDBFile(dbName, data) {
  return writeFile(
    `${dbPath}/${dbName}.json`,
    JSON.stringify(data, null, 4),
    'utf-8'
  )
}
