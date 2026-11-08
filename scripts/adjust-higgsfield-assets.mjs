import fs from 'node:fs'
import sharp from 'sharp'

const base = 'C:/Users/raque/Desktop/Terra-Santa-Casa-1-Higgsfield'
const files = [
  `${base}/01_PLAN/casa1_plan_original.png`,
  `${base}/01_PLAN/casa1_plan_line_art.png`,
  `${base}/02_GENERATED/casa1_isometric_cutaway.png`,
  `${base}/02_GENERATED/casa1_isometric_variant.png`,
]

for (const file of files) {
  const source = await sharp(file).metadata()
  const width = source.width ?? 0
  const height = source.height ?? 0
  const targetHeight = Math.ceil(width / 2.5)
  if (width / height > 2.5) {
    const extra = targetHeight - height
    const top = Math.floor(extra / 2)
    const bottom = extra - top
    const temp = `${file}.tmp.png`
    await sharp(file)
      .extend({ top, bottom, left: 0, right: 0, background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .png()
      .toFile(temp)
    fs.copyFileSync(temp, file)
    fs.unlinkSync(temp)
  }
  const result = await sharp(file).metadata()
  console.log(`${file}: ${result.width}x${result.height} ratio ${(result.width / result.height).toFixed(3)}`)
}
