import minimist from 'minimist'
import { publish } from './publish'

async function main() {
  const argv = minimist(process.argv.slice(2), {
    boolean: ['publish'],
    alias: {
      publish: 'p',
    },
  })

  if (argv.publish)
    publish()
}

main()
