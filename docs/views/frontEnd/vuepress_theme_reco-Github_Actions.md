---
title: vuepress-theme-reco v2 + Github Actions 搭建静态博客，自动构建部署到第三方服务器
date: 2020-03-21
categories:
  - 前端
tags:
  - VuePress
  - Github
  - 博客
  - 持续集成
publish: true
---

<!-- 文件位置：docs/views/frontEnd/vuepress_theme_reco-Github_Actions.md -->

::: tip

先下载主题模板，再根据自己的需要进行相应的修改，再根据自己的服务器配置 Github Actions 文件，最后上传到 Github，触发 Github Actions 自动构建部署到服务器

:::

<!-- more -->

> [最新博客链接](https://tsanfer.com/views/frontEnd/vuepress_theme_reco-Github_Actions.html)

> [Github 链接](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions)

[![CI/CD](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions/workflows/CI/CD/badge.svg)](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions/actions)
![GitHub repo size](https://img.shields.io/github/repo-size/Tsanfer/vuepress_theme_reco-Github_Actions?logo=Git)
[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions)
[![Cloud Studio Template](https://cs-res.codehub.cn/common/assets/icon-badge.svg)](https://cloudstudio.net/templates/hhU6TQfvlFW)

::: tip 提示

查看此文档前应先了解，[vuepress 基本操作](https://tsanfer.com/views/frontEnd/VuePress%20+%20GithubPages%20+%20TravisCI%20.html#%E6%9C%80%E7%BB%88%E6%95%88%E6%9E%9C)

:::

参考官方文档进行配置：

::: tip 提示

[vuepress-theme-reco](https://vuepress-theme-reco.recoluan.com/)

[VuePress](https://vuepress.vuejs.org/zh/)

[SamKirkland / FTP-Deploy-Action](https://github.com/marketplace/actions/ftp-deploy)

:::

## 最终效果

[最终效果链接](https://tsanfer.com/)

![最终效果链接](https://cdn.tsanfer.com/image/20200322150711.png)

## 思路

下载 vuepress-theme-reco 官方的主题模板（脚手架），再根据自己的需要进行相应的修改，再根据自己的服务器配置 Github Actions 文件，最后上传到 Github，触发 Github Actions 自动构建部署到第三方服务器。以后就只需提交 markdown 文件到 Github，Github Actions 便可自动部署到第三方服务器

### 用到的东西

- vuepress-theme-reco

- VuePress

- Github Actions

- SamKirkland / FTP-Deploy-Action

### 相关

- vuepress-theme-reco:

  一款简洁而优雅的 vuepress 博客 & 文档 主题。

- Github Actions:

  GitHub 操作 帮助您在您存储代码的同一位置自动执行软件开发工作流程，并协作处理拉取请求和议题。 您可以写入个别任务，称为操作，并结合它们创建一个自定义的工作流程。 工作流程是您可以在仓库中创建的自定义自动化流程，用于在 GitHub 上构建、测试、封装、发行或部署任何代码项目。

  通过 GitHub 操作 可直接在仓库中构建端到端持续集成 (CI) 和持续部署 (CD) 功能。

- SamKirkland / FTP-Deploy-Action:

  Automate deploying websites and more with this GitHub action

  通过 GitHub action 自动部署网页等操作

## 博客主题配置

### 快速开始

#### 使用模板

```bash
# 初始化
npm install @vuepress-reco/theme-cli@1.0.7 -g
theme-cli init
cd init
```

#### 更改最新依赖

```json
{
  "scripts": {
    "dev": "vuepress dev ./docs",
    "start": "vuepress dev ./docs",
    "build": "vuepress build ./docs"
  },
  "dependencies": {
    "vuepress": "2.0.0-beta.48",
    "vuepress-theme-reco": "2.0.0-beta.19"
  }
}
```

安装运行

```bash
npm install
npm run dev
```

### 目录结构

```bash
.
├── .git-ftp-include // 用于最后指定需要部署的文件或文件夹
├── .gitattributes // 用于统一文件内编码的换行符
├── .github
│   └── workflows
│       └── nodejs.yml // Github Actions的配置文件
├── .gitignore // 忽略上传到Github的文件或目录
├── .gitpod.yml // gitpod 初始化文件
├── LICENSE // 许可证文件
├── README.md // Github项目展示文件
├── package.json  // 指定依赖，项目脚本，Node.js项目描述文件
└── docs // VuePress项目根目录
    ├── .vuepress  // 存放配置文件的文件夹
    │   ├── config.ts // 整个工程的配置文件
    │   ├── dist // 最后生成的文件目录
    │   └── public // 媒体文件夹（主要是图片）
    ├── README.md // 网页首页文件
    └── views // 存放markdown文件的文件夹（可以不要直接把markdown文件放在docs里面）
        ├── Computer // 分类目录（也可以不要分类目录直接放在views里面）
        ├── Hack
        ├── MCU
        ├── Tool
        ├── frontEnd
        └── others
```

### 添加博客配置

然后根据需要更改一些内容和设置，参考官方的文档，可自行取舍相应内容

::: tip 提示

[vuepress-theme-reco](https://vuepress-theme-reco.recoluan.com/)

[VuePress](https://vuepress.vuejs.org/zh/)

:::

```javascript
// 文件位置 docs/.vuepress/config.ts

import { defineUserConfig } from "vuepress"; // 导入 vuepress 用户自定义
import recoTheme from "vuepress-theme-reco"; // 导入 reco 主题

export default defineUserConfig({
  // host: "0.0.0.0", // 生成网页地址（本地调试使用）
  // port: "22333", // 生成网页端口（本地调试使用）
  // 用户自定义设置
  title: "Tsanfer's Blog",
  description: "网络空间无限宽广",
  head: [
    ["link", { rel: "icon", href: "/favicon.svg" }], //浏览器的标签栏的网页图标,基地址/docs/.vuepress/public
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ], //在移动端，搜索框在获得焦点时会放大
  ],
  theme: recoTheme({
    // 主题设置
    style: "@vuepress-reco/style-default", // 风格设置
    logo: "./favicon.svg",
    // author: "Tsanfer",
    // authorAvatar: "./avatar.svg",
    // lastUpdatedText: "lastUpdatedText",
    series: {
      // 文章系列分组
      "/views/frontEnd/": [
        {
          text: "前端",
          sidebarDepth: 2, // 侧边栏深度
          children: [
            // 系列具体内容
            "vuepress_theme_reco-Github_Actions",
            "VuePress_GithubPages_TravisCI",
            "Sphinx_GitHub_ReadtheDocs",
          ],
        },
      ],
      "/views/MCU/": [
        {
          text: "MCU",
          sidebarDepth: 2,
          children: [
            "Linux_board_NFS",
            "First_Prepare_for_Lanqiao_Cup_MCU_Competition",
          ],
        },
      ],
      "/views/Computer/": [
        {
          text: "计算机",
          sidebarDepth: 2,
          children: [
            "Storage_hardware",
            "Windows_WSL_terminal_WebDAV_PartitionBackup",
          ],
        },
      ],
      "/views/Tool/": [
        {
          text: "工具",
          sidebarDepth: 2,
          children: ["ffmpeg", "scrcpy", "Frp_Docker_SSH_RDP"],
        },
      ],
      "/views/Hack/": [
        {
          text: "Hack",
          sidebarDepth: 2,
          children: ["Cheat_engine-Kingdom_rush"],
        },
      ],
    },
    navbar: [
      // 最上面导航栏
      { text: "主页", icon: "Home", link: "/" },
      {
        text: "分类",
        icon: "BrandWindows",
        children: [
          {
            text: "工具",
            icon: "Tool",
            link: "/categories/gongju/1/",
          },
          {
            text: "计算机",
            icon: "DeviceLaptop",
            link: "/categories/jisuanji/1/",
          },
          {
            text: "前端",
            icon: "AppWindow",
            link: "/categories/qianduan/1/",
          },
          {
            text: "MCU",
            icon: "Cpu",
            link: "/categories/MCU/1/",
          },
        ],
      },
      {
        text: "在线应用",
        icon: "Box",
        children: [
          {
            text: "个人网盘",
            icon: "Database",
            link: "http://clouddisk.tsanfer.com:8080",
          },
          {
            text: "订阅转换器",
            icon: "Exchange",
            link: "http://clouddisk.tsanfer.com:58080",
          },
          {
            text: "目标检测",
            icon: "AspectRatio",
            link: "http://hpc.tsanfer.com:8000",
          },
        ],
      },
      {
        text: "联系",
        icon: "Message",
        children: [
          {
            text: "GitHub",
            icon: "BrandGithub",
            link: "https://github.com/Tsanfer",
          },
          {
            text: "CSDN",
            icon: "Code",
            link: "https://blog.csdn.net/qq_27961843/",
          },
          {
            text: "BiliBili",
            icon: "DeviceTv",
            link: "https://space.bilibili.com/12167681",
          },
          {
            text: "QQ",
            icon: "Message",
            link: "tencent://message/?uin=1124851454",
          },
          {
            text: "Twitter",
            icon: "BrandTwitter",
            link: "https://twitter.com/a1124851454",
          },
          {
            text: "Gmail",
            icon: "Mail",
            link: "mailto:a1124851454@gmail.com",
          },
        ],
      },
    ],
    valineConfig: {
      // 评论设置
      appId: process.env.LEANCLOUD_APP_ID,
      appKey: process.env.LEANCLOUD_APP_KEY,
      verify: true, // 验证码
      recordIP: true, // 记录 IP
    },
  }),
  // debug: true,
});
```

## Github Actions 配置

### 修改 Github Actions 配置文件

在 Github 网页上添加 Github Actions 配置文件，参考官方的文档，可自行取舍相应内容，其中需要保密的部分需要添加 Github Secrets 环境变量

::: tip 提示

[SamKirkland / FTP-Deploy-Action](https://github.com/marketplace/actions/ftp-deploy)

:::

```yml
# 文件位置：.github/workflows/nodejs.yml

on: push # 触发此文件运行的条件
name: CI/CD # 此工作流程（workflow）的名字
jobs:
  FTP-Deploy-Action:
    name: CI&CD # 此任务（job）的名字
    runs-on: ubuntu-latest # 运行环境
    steps:
      - uses: actions/checkout@master # 切换分支到master
        with:
          fetch-depth: 2

      - name: Use Node.js 16.x
        uses: actions/setup-node@v3 # 使用node环境
        with:
          node-version: "16.x" # 版本14

      - name: Cache node modules
        id: cache # 缓存id
        uses: actions/cache@v3
        env:
          cache-name: cache-node-modules # 缓存名字
        with:
          path: ./node_modules/ # 缓存路径
          key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('package.json') }} # 缓存标识

      - name: Install Dependencies
        if: steps.cache.outputs.cache-hit != 'true' # 如果没有缓存的话
        run: npm install # 安装依赖

      - name: Build project
        run: npm run build # 构建项目和生成代码覆盖率报告
        env:
          LEANCLOUD_APP_ID: ${{ secrets.LEANCLOUD_APP_ID }} # 评 论系统的ID
          LEANCLOUD_APP_KEY: ${{ secrets.LEANCLOUD_APP_KEY }} # 评论系统的KEY

      # 如果FTP-Deploy-Action出现，Dirty repository: Having uncommitted changes. 问题时，使用以下注释步骤解决问题
      - name: reset git
        run: git reset --hard

      - name: 📂 Sync files
        uses: SamKirkland/FTP-Deploy-Action@4.3.0
        with:
          server: ${{ secrets.FTP_IP }}
          port: 21
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./docs/.vuepress/dist/ # 选择哪些文件要部署到服务器，这个选项在这里选了之后，要在.git-ftp-include中添加相应的路径
          server-dir: /

      #           ftp-server: sftp://${{ secrets.FTP_IP }}/home/www/htdocs # 服务器地址和端口（可以填域名，不过我服务器做了全站加速会导向加速结点的IP，所以只能用服务器的IP）
      #           ftp-username: ${{ secrets.FTP_USERNAME }} # FTP用户名
      #           ftp-password: ${{ secrets.FTP_PASSWORD }} # FTP密码
      #           git-ftp-args: --insecure # （如果是FTP连接的话--insecure不用加）
      #           local-dir: docs/.vuepress/dist/ # 选择哪些文件要部署到服务器，这个选项在这里选了之后，要在.git-ftp-include中添加相应的路径

      - name: upload-artifact
        uses: actions/upload-artifact@v3 #共享或保存action过程中产生的文件
        with:
          name: static_web_file
          path: ./docs/.vuepress/dist/ # or path/to/artifact
```

```txt
// .git-ftp-include

!docs/.vuepress/dist/
```

### 添加 Github Token

为了保密，把重要信息用变量表示，在 Github Secrets 中添加相应的值

仓库的 Settings --> Secrets --> Add a new secret

比如

- Name: FTP_USERNAME
- Value: admin

最后再把代码上传到 Github 便可自动触发构建，部署到第三方服务器

[![WTFPL License](https://upload.wikimedia.org/wikipedia/commons/0/0a/WTFPL_badge.svg)](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions/blob/master/LICENSE)

> 本文由[Tsanfer's Blog](https://tsanfer.com) 发布！
