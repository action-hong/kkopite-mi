/* eslint-disable no-console */

import fs from 'fs'
import { spawn } from 'child_process'
import path from 'path'
import { pathToFileURL } from 'url'
import inquirer from 'inquirer'
import pc from 'picocolors'
import JSON5 from 'json5'
import { getStorage, go, setStorage } from './utils'

interface ValidError {
  /**
   * 默认或者返回true表示需要提示文案确认
   */
  valid?: (name: string, projectPath: string) => boolean
  /**
   * 提示文案
   */
  text: string | string[] | ((name: string, projectPath: string) => string | string[])
  /**
   * 默认为空数组，表示所有项目都需要检查，写项目名即可
   */
  include?: string[]
  /**
   * 表示排除在外的项目，写项目名
   */
  exclude?: string[]
}

const defaultValidConfig: Array<ValidError> = [
  {
    valid(projectName: string) {
      const p = `./projects/${projectName}/util/device.js`
      if (!fs.existsSync(p)) return false
      const file = fs.readFileSync(p, 'utf-8')
      const reg = /USE_MOCK\s?=\s?true/
      return reg.test(file)
    },
    text(projectName: string) {
      return `修改${projectName}文件中关于 USE_MOCK = true的代码, 改成USE_MOCK = false后再打包!!!`
    },
  },
  {
    valid(_projectName: string) {
      return true
    },
    text: ['请确认你的项目是否需要配置智能场景，检查你的设置页面'],
  },
]

async function getUserValidConfig(): Promise<Array<ValidError>> {
  const name = pathToFileURL(path.resolve(process.cwd(), './mi.config.mjs'))
  if (!fs.existsSync(name)) return []
  const config = await import(name.toString())
  if (Array.isArray(config.default)) return config.default
  return [config.default]
}

function commandPublish(name: string) {
  return new Promise((resolve) => {
    // https://www.cnblogs.com/yinyuxing/p/15508288.html
    const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
    const ls = spawn(command, [
      'run',
      'publish',
      name,
    ])

    ls.stdout.on('data', (data) => {
    // buffer to string
      console.log(data.toString())
    })

    ls.stderr.on('data', (data) => {
      console.log(pc.red(`stderr: ${data}`))
    })

    ls.on('close', (code) => {
      console.log(`child process exited with code ${code}`)
      resolve(code)
    })
  })
}

async function puglishPackage(name: string) {
  const storage = getStorage()
  const recent = storage.recentPublishProject
  console.log(pc.green(`准备开始打包${name}`))
  const projectPath = `./projects/${name}`
  const allConfig = [...defaultValidConfig, ...await getUserValidConfig()]
  for (const config of allConfig) {
    const {
      valid = () => true,
      include = [],
      exclude = [],
      text,
    } = config

    if (include.length && !include.includes(name)) continue
    if (exclude.length && exclude.includes(name)) continue

    if (
      valid(name, projectPath)
    ) {
      let temp = text as (string[] | string)
      let result: string[] = []
      if (typeof text === 'function')
        temp = text(name, projectPath)
      if (typeof temp === 'string')
        result = [temp]
      else
        result = temp

      console.log(pc.red(`WARN:\n${result.join('\n')}`))
      if (!await go('是否坚持打包?'))
        return
    }
  }

  // 保存当前选择的
  recent[name] = Date.now()
  setStorage(storage)

  await commandPublish(name)
}

export async function publish() {
  const storage = getStorage()
  const recent = storage.recentPublishProject
  // 找到projects下的所有目录
  const map = tryGetProjectName() as Record<string, string>
  const projects = fs.readdirSync('./projects')
    .filter(name => name.startsWith('com.'))
    .sort((a, b) => (recent[b] || 0) - (recent[a] || 0))
    .map(name => ({ name: name + (map[name] ? `(${map[name]})` : ''), value: name }))
  const answer = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'project',
      message: '选择你要打包的项目',
      choices: projects,
    },
  ])

  for (const name of answer.project)
    await puglishPackage(name)
}

export function checkPath(path: string) {
  if (!fs.existsSync(path)) return false
  const file = fs.readFileSync(path, 'utf-8')
  const reg = /USE_MOCK\s?=\s?true/
  return reg.test(file)
}

export function tryGetProjectName() {
  const jsonPath = './.vscode/settings.json'
  if (!fs.existsSync(jsonPath)) {
    console.log(pc.red(`WARN: ${jsonPath}不存在`))
    return {}
  }
  try {
    const data = JSON5.parse(fs.readFileSync(jsonPath, 'utf-8')) as any
    return data['mihome.projectAliasMap'] || {}
  }
  catch (error) {
    console.log(pc.red(`WARN: ${jsonPath}解析失败`))
    return {}
  }
}
