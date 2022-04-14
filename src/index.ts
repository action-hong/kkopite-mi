import minimist from 'minimist'
import pc from 'picocolors'
import { version } from '../package.json'
import { convert } from './convert'
import { publish } from './publish'

async function main() {
  const argv = minimist(process.argv.slice(2), {
    boolean: ['publish', 'convert', 'outputDir', 'help', 'version'],
    alias: {
      publish: 'p',
      convert: 'c',
      outputDir: 'o',
      help: 'h',
      version: 'v',
    },
  })

  if (argv.publish) {
    publish()
  }
  else if (argv.convert) {
    const paths = argv._
    if (paths.length === 0)
      paths.push('./')
    convert(paths, argv.outputDir ?? './')
  }
  else if (argv.help) {
    help()
  }
  else if (argv.version) {
    // eslint-disable-next-line no-console
    console.log(version)
  }
}

function help() {
  // eslint-disable-next-line no-console
  console.log(`
Usage:
  $ mi [options]

Options:
  -p, --publish           ${pc.dim('[boolean]')} select a mihome project from current directory to publish
  -c, --convert <files>   ${pc.dim('[string]')}  convert all files(file or directory's file) to markdown
  -o, --outputDir=<path>  ${pc.dim('[string]')}  output directory otherwise use current directory
  -v, --version           ${pc.dim('[boolean]')} show version
`)
}

main()
