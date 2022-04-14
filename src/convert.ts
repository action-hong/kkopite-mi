import fs from 'fs'
import path from 'path'
import mammoth from 'mammoth'
import pc from 'picocolors'

export function convert(paths: string[], outputDir = './'): Promise<any> {
  if (!fs.existsSync(outputDir))
    fs.mkdirSync(outputDir)
  if (!fs.statSync(outputDir).isDirectory())
    throw new Error('outputDir is not a directory')
  // 判断是目录还是指定文件
  return Promise.all(
    paths
      .filter(p => fs.statSync(p).isDirectory() || path.extname(p) === '.docx')
      .map((p) => {
        if (fs.statSync(p).isDirectory())
          return convert(fs.readdirSync(p).map(f => path.join(p, f)), outputDir)
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
      fs.writeFileSync(dist, res.value)
      // eslint-disable-next-line no-console
      console.log(pc.green(`${filename} => ${dist}`))
      return true
    })
}
