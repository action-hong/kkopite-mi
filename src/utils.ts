import fs from 'fs'
import inquirer from 'inquirer'

export function go(message: string) {
  return inquirer.prompt([
    {
      type: 'confirm',
      name: 'go',
      message,
    },
  ]).then(res => res.go)
}

const DATA_JSON = './.mihome.json'

interface MiHomeStorage {
  recentPublishProject: Record<string, number>
}

const DefaultStorage: MiHomeStorage = {
  recentPublishProject: {},
}

export function getStorage(): MiHomeStorage {
  if (!fs.existsSync(DATA_JSON)) {
    return {
      ...DefaultStorage,
    }
  }
  else {
    return {
      ...DefaultStorage,
      ...JSON.parse(fs.readFileSync(DATA_JSON, 'utf-8')),
    }
  }
}

export function setStorage(data: MiHomeStorage) {
  fs.writeFileSync(DATA_JSON, JSON.stringify(data))
}

export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function randomSec(min: number, max: number) {
  return `${(random(min * 100, max * 100) / 100).toFixed(2)}s`
}

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
    // FIXME: 无法处理已经被包裹的email
    regex: /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g,
    replacer: '<a href="mailto:$&">$&</a>',
  },
]
// 处理电话，处理邮箱
export function resolveMarkdown(str: string) {
  regexArray.forEach((item) => {
    str = str.replace(item.regex, item.replacer)
  })
  return str
}
