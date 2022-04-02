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
