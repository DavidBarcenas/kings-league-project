import { readdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'
import { logInfo, logSuccess } from './log'

const inputPath = path.join(process.cwd(), 'assets', 'static', 'players')
const outputPath = path.join(process.cwd(), 'public', 'teams', 'players')

export async function optimizePlayerImages() {
  const files = await readdir(inputPath)

  const optimizeImage = async (file) => {
    const filePath = path.join(inputPath, file)
    const outputFilePath = path.join(outputPath, file.replace('.png', '.webp'))

    logInfo(`Optimizing image: ${file}`)
    await sharp(filePath).webp({ effort: 6 }).toFile(outputFilePath)
    logSuccess(`Optimized image: ${file}`)
  }

  await Promise.all(files.map(optimizeImage))
}
