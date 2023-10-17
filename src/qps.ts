/* eslint-disable no-console */
import * as fs from 'fs'
import * as XLSX from 'xlsx/xlsx.mjs'
import pc from 'picocolors'

/* load 'fs' for readFile and writeFile support */
XLSX.set_fs(fs)

export function getQPS(src: string) {
  const workbook = XLSX.readFile(src)
  const worksheet = workbook.Sheets.sheet1
  const result = XLSX.utils.sheet_to_json(worksheet) as Array<any>

  const data = result
    .map(item => item.MsgBody)
    .filter(Boolean)
    .map(item => JSON.parse(item))

  const c = data.map(obj => obj.params.ots_stat[6])
    .filter((val, idx, arr) => {
      if (idx === arr.length - 1) return true
      if (val > arr[idx + 1]) return true
      return false
    })
    .reduce((a, b) => a + b, 0)

  const qps = Math.max(...data.map(obj => obj.params)
    .map(p => 60 * p.ots_stat[6] / p.miio_times[0]))

  console.log(`一天的发包数: ${pc.green(c)}`)
  console.log(`最大的qps: ${pc.green(qps)}`)
}
