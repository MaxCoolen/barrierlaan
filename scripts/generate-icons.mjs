import sharp from 'sharp'
import { readFileSync } from 'fs'
import { mkdirSync } from 'fs'

mkdirSync('./public', { recursive: true })

const svg = readFileSync('./public/icon.svg')

const sizes = [
  { size: 192,  file: './public/icon-192.png' },
  { size: 512,  file: './public/icon-512.png' },
  { size: 180,  file: './public/apple-touch-icon.png' },
  { size: 32,   file: './public/favicon-32.png' },
]

for (const { size, file } of sizes) {
  await sharp(svg).resize(size, size).png().toFile(file)
  console.log(`✓ ${file} (${size}x${size})`)
}

console.log('\n✅ Alle iconen gegenereerd!')
