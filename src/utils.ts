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
