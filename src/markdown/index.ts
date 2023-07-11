import { defineMarkdownTransform } from '../utils'
import email from './email'
import list from './list'
import edge from './edge'
import en from './en'

const arr = [
  email,
  list,
  edge,
  en,
]

export const mdTransform = defineMarkdownTransform((str, name) => {
  return arr.reduce((input, func) => func(input, name), str)
})
