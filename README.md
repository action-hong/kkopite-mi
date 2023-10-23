# @kkopite/mi

[![NPM version](https://img.shields.io/npm/v/@kkopite/mi?color=a1b858&label=)](https://www.npmjs.com/package/@kkopite/mi)

集成一些开发米家拓展程序时的一些操作

# @kkopite/mi

米家开发中一些常见操作命令行工具

### 安装

```bash
npm install -g @kkopite/mi
```


### word转化为markdown

你需要先了解下`markdown`的[基础语法](https://www.runoob.com/markdown/md-tutorial.html)

一般来说，客户提供的隐私、用户协议均为word文档，我们需要转化为`markdown`文件，才能上传到后台。

我们可以使用该工具来解决：

```bash
# 首先进入到隐私、用户协议的word文档所在的文件夹内
cd ./path/to/word/dircotry

# 执行该命令，会将该目录下所有的word文档转化为markdown文件
mi -c
```

这里的`word`转化为`markdown`文件实际上用到了[mammoth](https://www.npmjs.com/package/mammoth)这个库，可以参考文档看看该工具的使用场景和局限性。


- :warning: __该工具并不能完美地进行转化，转化后的文件会有一些小问题，因此你需要手动编辑微调生成的`markdown`文件，预览效果看是否正常(可以使用`vscode`自带的浏览功能查看`markdown`文件渲染后的显示效果)__
- 提供的word文档必须是`.docx`格式的，否则无法进行转化
- 你需要注意英文文档中，是否有中文内容（如编号一、二、三等等）
- 你需要手动给生成的文档中的邮件、电话号码加上相应标签、使其有超链接功能，如下：

```diff
- 电子邮件：123456789@qq\.com
+ 电子邮件：<a href="mailto:123456789@qq.com">123456789@qq\.com</a>

- 电话：13912345678
+ 电话：<a href="tel:13912345678">13912345678</a>
```

### 打包

正常我们使用米家sdk提供的打包命令：

```bash
npm run publish com.xiaomi.demo
```

需要我们手动去敲打`com.xiaomi.demo`等项目的目录，就比较麻烦。这里我们提供一个命令来封装如上的打包：

```base
cd /path/to/miot-plugin-sdk-10074

mi -p
```

该命令会输出该项目所有的插件列表，然后你可以通过上下移动选择要打包的插件，点击回车即可执行打包命令。这样就避免手动拼写输入插件包名

#### 配置

由于米家插件的一些规范，例如设置页面的“智能场景”需要根据实际情况进行显示，而往往开发时会忽略这点，因此这里提供一个功能，允许编写一些配置文件在打包前进行检查，一一确认后才会进行打包。

你需要再根目录上创建`mi.config.mjs`文件，然后配置你的检查规则即可：

```js
/**
 * @typedef ValidError
 * @type {object}
 * @property include {string[]} - 需要检查的项目，空数组即全部检查
 * @property excluce {string[]} - 排除检查的项目
 * @property text {string|string[]|((name: string, projectPath: string) => string|string[])} - 错误提示
 * @property [valid] {(name: string, projectPath: string) => boolean}
 */

/**
 * @type {ValidError[]}
 */
export default [

]
```

规则如下：

```ts
interface ValidError {
  /**
   * 默认或者返回true表示需要提示文案确认
   */
  valid?: (name: string, projectPath: string) => boolean
  /**
   * 提示文案
   */
  text: string | string[] | ((name: string, projectPath: string) => string | string[])
  /**
   * 默认为空数组，表示所有项目都需要检查，写项目名即可
   */
  include?: string[]
  /**
   * 表示排除在外的项目，写项目名
   */
  exclude?: string[]
}
```

### 多语言文本输出

该功能假设你使用模板提供的i18n框架来开发，如果不是的话，请不要使用该功能

对于开发者来说，改动`json`文档不会有太大的心智负担，但对于其他人来说就不一定了。特别的我们将中文文案提供给客户或第三方翻译，让他们编写提供一份英文的或其他语言的`json`文本，就有可能给他们造成比较大的心智负担。

通过该功能，可以将所有的语言`json`文件整合，生成一个excel文件，这样他们编辑起来就很容易了。

例如你有两份语言的`json`文件：

::: code-group

```json [./path/to/i17n/en.json]
// en.json
{
  "hello": "hello"
}
```

```json [./path/to/i18n/zh.json]
// zh.json
{
  "hello": "你好",
  "name": "卡卡普特"
}
```
:::

执行如下指令

```bash
# --src 指定json文件所在的文件目录
# --dst 指定生成的excel文件的路径，./表示在当前目录
mi -t --src=./path/to/i18n --dst=./
```

会生成如下内容的excel表格文件

|key|zh|en|
|:--:|:--:|:--:|
|hello|你好|hello|
|name|卡卡普特||

> 如果你的目录中还有其他语言的json文件，如`ko.json`，则生成的表格中会增加`ko`一列，表示韩语

将生成后的excel文件交给翻译人员，他们经过翻译了后，变成如下内容：

|key|zh|en|
|:--:|:--:|:--:|
|hello|你好|hello|
|name|卡卡普特|kkopite|

> 增加了`name`的英文翻译

然后我们执行如下命令：

```bash
# 这里的src为翻译人员编辑后的excel表格路径
# dst为上面指定json所在的目录
mi -t --src=./path/to/translate.xlsx --dst=./path/to/i18n
```

该命令会将excel表格的内容同步转为对应的`json`文本，避免我们手动从excel表格中复制粘贴文案到`json`文件：

::: code-group

```json [./path/to/i18n/en.json]
// en.json
{
  "hello": "hello",
  "name": "kkopite" // [!code ++]
}
```

```json [./path/to/i18n/zh.json]
// zh.json
{
  "hello": "你好",
  "name": "卡卡普特"
}
```

::: warning 警告
- 注意不要改动生成的excel表格的结构(只要在对应词条对应语言上填写翻译就行)，否则可能导致编辑后无法同步会`json`文本
- 为了避免同步`json`文本的时候发生不可预知的错误，请在执行同步命令前先提交项目的代码到`svn`或`git`仓库，以免代码丢失
:::


## License

[MIT](./LICENSE) License © 2021 [kkopite](https://github.com/action-hong)
