import { defineMarkdownTransform } from '../utils'

const regexArray = [
  {
    regex: /\\\./g,
    replacer: '.',
  },
  {
    regex: /(?<![\:\>])(?:(?:\+|00)86)?1\d{10}/g,
    replacer: '<a href="tel:$&">$&</a>',
  },
  {
    regex: /(([^<>()[\]\\.,;：:\s@"\u4E00-\u9FA5]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g,
    replacer: '<a href="mailto:$&">$&</a>',
  },
]

export default defineMarkdownTransform((str) => {
  regexArray.forEach((item) => {
    str = str.replace(item.regex, item.replacer)
  })

  return str
})
