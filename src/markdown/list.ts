import { defineMarkdownTransform } from '../utils'

export default defineMarkdownTransform((str) => {
  str = str.replace(/•\s+?/g, '- ')
  str = str.replace(/(\d)+、/g, '$1. ')
  str = str.replace(/(\d)+?\.(?!\s)/g, '$1. ')

  return str
})
