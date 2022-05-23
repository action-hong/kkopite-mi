/* eslint-disable no-console */
import pc from 'picocolors'
import { randomSec } from './utils'
export function generateRandom(
  min: number,
  max: number,
  count: number,
) {
  const result: string[] = []
  for (let i = 0; i < count; i++)
    result.push(randomSec(min, max))
  console.log(pc.bgGreen('生成了如下数据：'))
  console.log(result.join(','))
}
