import path from 'path'
import * as fs from 'fs'
import * as XLSX from 'xlsx/xlsx.mjs'

/* load 'fs' for readFile and writeFile support */
XLSX.set_fs(fs)

let source = {}
const target: any = {}

export function jsonoToExcel(src: string, dst: string) {
  const children = fs.readdirSync(src)
  const sourceLocale = 'zh'
  children.forEach((locale) => {
    if (locale.endsWith('json')) {
      const p = path.join(src, locale)
      const key = locale.replace('.json', '')
      const res = JSON.parse(fs.readFileSync(p, 'utf-8'))
      if (key === sourceLocale)
        source = res
      else
        target[key] = res
    }
  })

  const languages = Object.keys(target)
    .sort(a => a === 'en' ? -1 : 1)

  const rows = Object.entries(
    source,
  ).map(([K, V]) => {
    const obj: any = {}
    languages
      .forEach((key) => {
        obj[key] = target[key][K] || ''
      })
    return ({
      key: K,
      [sourceLocale]: V,
      ...obj,
    })
  })

  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'translation')

  /* fix headers */
  XLSX.utils.sheet_add_aoa(worksheet, [['key', sourceLocale, ...languages]], { origin: 'A1' })

  /* calculate column width */
  // const max_width = rows.reduce((w, r) => Math.max(w, r.en.length), 10);
  // worksheet["!cols"] = [ { wch: max_width } ];

  XLSX.writeFile(workbook, path.join(dst, './translate.xlsx'))
}

export function excelToJson(src: string, dst: string) {
  const workbook = XLSX.readFile(src)
  const worksheet = workbook.Sheets.translation
  const result = XLSX.utils.sheet_to_json(worksheet)
  const obj: any = {}
  result.forEach((item: any) => {
    const key = item.key
    if (key) {
      Object.keys(item).forEach((locale) => {
        if (locale !== 'key') {
          if (!obj[locale])
            obj[locale] = {}

          if (item[locale])
            obj[locale][key] = item[locale]
        }
      })
    }
  })

  const output = dst
  if (!fs.existsSync(output))
    fs.mkdirSync(output)

  Object.keys(obj)
    .forEach((item) => {
      // 读取原有的
      let origin = {}
      const p = path.join(output, `${item}.json`)
      if (fs.existsSync(p))
        origin = JSON.parse(fs.readFileSync(p, 'utf-8'))

      fs.writeFileSync(
        p,
        // 合并原有的
        `${JSON.stringify({
          ...origin,
          ...obj[item],
        }, null, 2)}${'\n'}`,
      )
    })
}
