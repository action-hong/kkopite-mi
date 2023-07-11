import { defineMarkdownTransform } from '../utils'

const list = [
  'en',
  '英文',
]

const map = {
  一: 'A',
  二: 'B',
  三: 'C',
  四: 'D',
  五: 'E',
  六: 'F',
  七: 'G',
  八: 'H',
  九: 'I',
  十: 'J',
}

export default defineMarkdownTransform((str, name) => {
  if (list.every(key => !name.includes(key))) return str

  str = str.replace(/\\\((.)\\\)/g, (match, sel) => {
    return `\(${map[sel as keyof typeof map] || sel}\)` || sel
  })

  return str
})
