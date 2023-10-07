/* eslint-disable no-console */

import fs from 'fs'
import { spawn } from 'child_process'
import inquirer from 'inquirer'
import pc from 'picocolors'
import JSON5 from 'json5'
import { getStorage, go, setStorage } from './utils'

interface ValidError {
  valid: (p: string) => boolean
  text: string | string[] | ((p: string) => string | string[])
}

const validConfig: Array<ValidError> = [
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
      type: 'list',
      name: 'project',
      message: '选择你要打包的项目',
      choices: projects,
    },
  ])

  for (const valid of validConfig) {
    if (valid.valid(answer.project)) {
      let temp = valid.text as (string[] | string)
      let result: string[] = []
      if (typeof valid.text === 'function')
        temp = valid.text(answer.project)
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
  recent[answer.project] = Date.now()
  setStorage(storage)

  // https://www.cnblogs.com/yinyuxing/p/15508288.html
  const command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const ls = spawn(command, [
    'run',
    'publish',
    answer.project,
  ])

  ls.stdout.on('data', (data) => {
    // buffer to string
    console.log(data.toString())
  })

  ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`)
  })

  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })
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
