import minimist from 'minimist'
import pc from 'picocolors'
import { version } from '../package.json'
import { convert } from './convert'
import { generateRandom } from './generate'
import { publish } from './publish'
import { excelToJson, jsonoToExcel } from './translate'
import { getQPS } from './qps'

async function main() {
  const argv = minimist(process.argv.slice(2), {
    boolean: ['publish', 'convert', 'help', 'version', 'generate', 'show', 'qps', 'html'],
    string: ['min', 'max', 'count', 'src', 'dst', 'outputDir'],
    alias: {
      publish: 'p',
      convert: 'c',
      outputDir: 'o',
      help: 'h',
      version: 'v',
      generate: 'g',
      translate: 't',
      show: 's',
      qps: 'q',
    },
  })

  if (argv.show) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(argv, null, 2))
  }

  if (argv.publish) {
    publish()
  }
  else if (argv.convert) {
    const paths = argv._
    if (paths.length === 0)
      paths.push('./')
    convert(paths, argv.outputDir, argv.html)
  }
  else if (argv.help) {
    help()
  }
  else if (argv.version) {
    // eslint-disable-next-line no-console
    console.log(version)
  }
  else if (argv.generate) {
    const min = argv.min ?? 2
    const max = argv.max ?? 4
    const count = argv.count ?? 20
    generateRandom(min, max, count)
  }
  else if (argv.translate) {
    const src = argv.src
    const dst = argv.dst
    if (src.endsWith('.xlsx')) {
      // toJson
      excelToJson(src, dst)
    }
    else {
      jsonoToExcel(src, dst)
    }
  }
  else if (argv.qps) {
    if (argv.src)
      getQPS(argv.src)
    else
      throw new Error('you must set xlsx path, like --src="xxx.xlsx"')
  }
}

function help() {
  // eslint-disable-next-line no-console
  console.log(`
Usage:
  $ mi [options]

Options:
  -p, --publish           ${pc.dim('[boolean]')} select a mihome project from current directory to publish
  -c, --convert --outputDir=<output> <--html> <files>   ${pc.dim('[string]')}  convert all files(file or directory's file) to markdown or html if with --html
  -o, --outputDir=<path>  ${pc.dim('[string]')}  output directory otherwise use current directory
  -g, --generate          ${pc.dim('[boolean]')} generate random data sec <min>s, <max>s, <count>
  -v, --version           ${pc.dim('[boolean]')} show version
  -t, --translate         ${pc.dim('[boolean]')} json to excel(mi -t --src=./path/to/locale/json/parent/dir --dst=./translate/excel/output/dir)
  -q, --qps               ${pc.dim('[boolean]')} calc qps(mi -q --src="./path/to/excel")
`)
}

main()
