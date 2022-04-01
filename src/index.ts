/* eslint-disable no-console */
import fs from 'fs'
import { spawn } from 'child_process'
import minimist from 'minimist'
import inquired from 'inquirer'

async function main() {
  const argv = minimist(process.argv.slice(2), {
    boolean: ['publish'],
    alias: {
      publish: 'p',
    },
  })

  if (argv.publish) {
    // 找到projects下的所有目录
    const projects = fs.readdirSync('./projects')
      .filter(name => name.startsWith('com.'))
    const answer = await inquired.prompt([
      {
        type: 'list',
        name: 'project',
        message: '选择你要打包的包',
        choices: projects,
      },
    ])
    const ls = spawn('npm.cmd', [
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
}

main()
