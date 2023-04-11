import { describe, expect, it } from 'vitest'
import { resolveMarkdown } from '../src/utils'

describe('util', () => {
  it('resolve email and phone', () => {
    const text = `
    我们的隐私政策已于__2023 年 1 月 13 日__生效。这一隐私政策能够提供有关我们如何管理您在使用JITTGO智能马桶产品和服务时透露的个人信息的隐私详情。

如果您有任何疑问、意见或建议，欢迎通过以下方式与我们联系：

电子邮件：646705311@qq\.com

电话：<a href="tel:18950187392">18950187392</a>
电话：18950187392
电话：18950187392
电话：18950187392
    `

    expect(resolveMarkdown(text)).toMatchInlineSnapshot(`
      "
          我们的隐私政策已于__2023 年 1 月 13 日__生效。这一隐私政策能够提供有关我们如何管理您在使用JITTGO智能马桶产品和服务时透露的个人信息的隐私详情。
      
      如果您有任何疑问、意见或建议，欢迎通过以下方式与我们联系：
      
      <a href=\\"mailto:电子邮件：646705311@qq.com\\">电子邮件：646705311@qq.com</a>
      
      电话：<a href=\\"tel:18950187392\\">18950187392</a>
      电话：<a href=\\"tel:18950187392\\">18950187392</a>
      电话：<a href=\\"tel:18950187392\\">18950187392</a>
      电话：<a href=\\"tel:18950187392\\">18950187392</a>
          "
    `)
  })
})
