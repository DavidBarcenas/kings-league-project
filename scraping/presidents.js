import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

const staticsPath = path.join(process.cwd(), './assets/static/presidents')
const dbPath = path.join(process.cwd(), '../db/')
const rawPresidents = await readFile(`${dbPath}/raw-presidents.json`, 'utf-8').then(JSON.parse)

const presidents = await Promise.all(
  rawPresidents.map(async presidentInfo => {
    const { slug: id, title, _links: links } = presidentInfo
    const { rendered: name } = title

    const { 'wp:attachment': attachment } = links
    const { href: imageApiEndpoint } = attachment[0]

    const responseImageEndpoint = await fetch(imageApiEndpoint)
    const data = await responseImageEndpoint.json()
    const [imageInfo] = data
    const { guid: { rendered: imageUrl } } = imageInfo

    const fileExtension = imageUrl.split('.').at(-1)

    const responseImage = await fetch(imageUrl)
    const arrayBuffer = await responseImage.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const imageFileName = `${id}.${fileExtension}`
    await writeFile(`${staticsPath}/${imageFileName}`, buffer)

    return { id, name, image: imageFileName, teamId: 0 }
  })
)

await writeFile(`${dbPath}/presidents.json`, JSON.stringify(presidents, null, 2))
