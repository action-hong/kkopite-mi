import { defineMarkdownTransform } from '../utils'

export default defineMarkdownTransform((str) => {
  str = str.replace(/\s+?请在使用我们的产品（或服务）前，仔细阅读并了解本《隐私政策》。/, '请在使用我们的产品（或服务）前，仔细阅读并了解本《隐私政策》。')
  return str
})
