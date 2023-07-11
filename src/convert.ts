import fs from 'fs'
import path from 'path'
import mammoth from 'mammoth'
import pc from 'picocolors'
import { mdTransform } from './markdown'

export function convert(paths: string[], outputDir = './', html = false): Promise<any> {
  if (!fs.existsSync(outputDir))
    fs.mkdirSync(outputDir)
  if (!fs.statSync(outputDir).isDirectory())
    throw new Error('outputDir is not a directory')
  // 判断是目录还是指定文件
  return Promise.all(
    paths
      // .filter(p => !p.includes('node_modules'))
      .filter(p => fs.statSync(p).isDirectory() || path.extname(p) === '.docx')
      .map((p) => {
        if (fs.statSync(p).isDirectory())
          return convert(fs.readdirSync(p).map(f => path.join(p, f)), outputDir, html)
        else if (html)
          return convertDocxToHTML(p, outputDir)
        else
          return convertDocxToMardown(p, outputDir)
      }),
  )
}

function convertDocxToMardown(filename: string, outputDir: string) {
  mammoth.convertToMarkdown({ path: filename })
    .then((res) => {
      const name = `${path.basename(filename, '.docx')}.md`
      const dist = path.join(outputDir, name)
      const text = mdTransform(res.value, name)
      fs.writeFileSync(dist, text)
      // eslint-disable-next-line no-console
      console.log(pc.green(`${filename} => ${dist}`))
      return true
    })
}

function convertDocxToHTML(filename: string, outputDir: string) {
  mammoth.convertToHtml({ path: filename })
    .then((res) => {
      const name = `${path.basename(filename, '.docx')}.html`
      const dist = path.join(outputDir, name)
      // const text = resolveMarkdown(res.value, name)
      const text = res.value
      fs.writeFileSync(dist, text)
      // eslint-disable-next-line no-console
      console.log(pc.green(`${filename} => ${dist}`))
      return true
    })
}
