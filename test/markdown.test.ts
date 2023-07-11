/* eslint-disable no-tabs */
import { describe, expect, it } from 'vitest'
import { mdTransform } from '../src/markdown'

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
如果您无法通过上述链接访问这些个人信息，您可以随时发送电子邮件至646705311@qq.com。我们将在30天内回复您的访问请求。
    `

    expect(mdTransform(text, '隐私条款.docx')).toMatchInlineSnapshot(`
      "
          我们的隐私政策已于__2023 年 1 月 13 日__生效。这一隐私政策能够提供有关我们如何管理您在使用JITTGO智能马桶产品和服务时透露的个人信息的隐私详情。
      
      如果您有任何疑问、意见或建议，欢迎通过以下方式与我们联系：
      
      电子邮件：<a href=\\"mailto:646705311@qq.com\\">646705311@qq.com</a>
      
      电话：<a href=\\"tel:18950187392\\">18950187392</a>
      电话：<a href=\\"tel:18950187392\\">18950187392</a>
      电话：<a href=\\"tel:18950187392\\">18950187392</a>
      电话：<a href=\\"tel:18950187392\\">18950187392</a>
      如果您无法通过上述链接访问这些个人信息，您可以随时发送电子邮件至<a href=\\"mailto:646705311@qq.com\\">646705311@qq.com</a>。我们将在30天内回复您的访问请求。
          "
    `)
  })

  it('resolve list', () => {
    const text = `
•	您提供给我们或上传的信息：我们可能收集您提供给我们个人信息，例如小米账号信息、您反馈的消息内容。

•	设备相关信息：与您的设备相关的信息。例如设备 MAC 地址、固件版本、设备使用状态、设备制造商信息、设备型号、设备和主板识别号。

•	网络状态信息：我们可能收集并使用连接网络的信息。例如设备IP地址、网络信号、路由器的SSID、路由器BSSID、设备的RSSI和网络运营商。

•	位置信息（仅适用于特定服务/功能）：我们可能收集并使用您的位置相关的信息。

1、在获取明确同意的情况下共享：获得您的明确同意后，我们会与其他方共享您的个人信息。

2、我们可能会根据法律法规规定，或按政府主管部门的强制性要求，对外共享您的个人信息。

3、与我们的附属公司共享：您的个人信息可能会与厦门库梓的关联公司共享。我们只会共享必要的个人信息，且受本隐私政策中所声明目的的约束。关联公司如要改变个人信息的处理目的，将再次征求您的授权同意。

4、与授权合作伙伴共享：仅为实现本政策中声明的目的，我们的某些服务将由授权合作伙伴提供。我们可能会与合作伙伴共享您的某些个人信息，以提供更好的客户服务和用户体验。例如，在您上网购买我们的产品时，我们必须与物流服务提供商共享您的个人信息才能安排送货，或者安排合作伙伴提供服务。我们仅会出于合法、正当、必要、特定、明确的目的共享您的个人信息，并且只会共享提供服务所必要的个人信息。我们的合作伙伴无权将共享的个人信息用于任何其他用途。

1.我们如何收集和适用您的个人信息

2.我们如何共享、转让、公开披露您的个人信息

3.我们如何保护您的个人信息
3. 我们如何保护您的个人信息
`
    expect(mdTransform(text, 'test.docx')).toMatchInlineSnapshot(`
      "
      - 您提供给我们或上传的信息：我们可能收集您提供给我们个人信息，例如小米账号信息、您反馈的消息内容。
      
      - 设备相关信息：与您的设备相关的信息。例如设备 MAC 地址、固件版本、设备使用状态、设备制造商信息、设备型号、设备和主板识别号。
      
      - 网络状态信息：我们可能收集并使用连接网络的信息。例如设备IP地址、网络信号、路由器的SSID、路由器BSSID、设备的RSSI和网络运营商。
      
      - 位置信息（仅适用于特定服务/功能）：我们可能收集并使用您的位置相关的信息。
      
      1. 在获取明确同意的情况下共享：获得您的明确同意后，我们会与其他方共享您的个人信息。
      
      2. 我们可能会根据法律法规规定，或按政府主管部门的强制性要求，对外共享您的个人信息。
      
      3. 与我们的附属公司共享：您的个人信息可能会与厦门库梓的关联公司共享。我们只会共享必要的个人信息，且受本隐私政策中所声明目的的约束。关联公司如要改变个人信息的处理目的，将再次征求您的授权同意。
      
      4. 与授权合作伙伴共享：仅为实现本政策中声明的目的，我们的某些服务将由授权合作伙伴提供。我们可能会与合作伙伴共享您的某些个人信息，以提供更好的客户服务和用户体验。例如，在您上网购买我们的产品时，我们必须与物流服务提供商共享您的个人信息才能安排送货，或者安排合作伙伴提供服务。我们仅会出于合法、正当、必要、特定、明确的目的共享您的个人信息，并且只会共享提供服务所必要的个人信息。我们的合作伙伴无权将共享的个人信息用于任何其他用途。
      
      1. 我们如何收集和适用您的个人信息
      
      2. 我们如何共享、转让、公开披露您的个人信息
      
      3. 我们如何保护您的个人信息
      3. 我们如何保护您的个人信息
      "
    `)
  })

  it('resolve edge case', () => {
    const text = `
    请在使用我们的产品（或服务）前，仔细阅读并了解本《隐私政策》。
    `

    expect(mdTransform(text, '')).toMatchInlineSnapshot(`
      "请在使用我们的产品（或服务）前，仔细阅读并了解本《隐私政策》。
          "
    `)
  })

  it('resolve en order', () => {
    const text = `
    \\(五\\) The personal information subject cancels the account
    \\(七\\) The personal information subject cancels the account
    \\(七\\) Restrict the automatic decision\-making of the information system
    \\(A\\) Restrict the automatic decision\-making of the information system
    \\(旧\\) Restrict the automatic decision\-making of the information system
    `

    expect(mdTransform(text, 'en.docx')).toMatchInlineSnapshot(`
      "
          (E) The personal information subject cancels the account
          (G) The personal information subject cancels the account
          (G) Restrict the automatic decision-making of the information system
          (A) Restrict the automatic decision-making of the information system
          (旧) Restrict the automatic decision-making of the information system
          "
    `)
  })
})
