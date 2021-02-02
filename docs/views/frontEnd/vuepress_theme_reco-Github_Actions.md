---
title: vuepress-theme-reco + Github Actions 搭建静态博客，自动构建部署到第三方服务器
date: 2020-03-21
sidebar: "auto"
categories:
  - 前端
tags:
  - VuePress
  - Github
  - 博客
  - 持续集成
sticky: 1
publish: true
---

::: tip

先下载主题模板，再根据自己的需要进行相应的修改，再根据自己的服务器配置 Github Actions 文件，最后上传到 Github，触发 Github Actions 自动构建部署到服务器

:::

<!-- more -->

- > [最新博客链接](https://tsanfer.xyz/views/frontEnd/vuepress_theme_reco-Github_Actions.html)
- > [Github 链接](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions)

[![CI/CD](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions/workflows/CI/CD/badge.svg)](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions/actions)
[![Lint Code Base](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions/actions)
[![CodeFactor](https://www.codefactor.io/repository/github/tsanfer/vuepress_theme_reco-github_actions/badge)](https://www.codefactor.io/repository/github/tsanfer/vuepress_theme_reco-github_actions)
[![codecov](https://codecov.io/gh/Tsanfer/vuepress_theme_reco-Github_Actions/branch/master/graph/badge.svg)](https://codecov.io/gh/Tsanfer/vuepress_theme_reco-Github_Actions)
[![dependabot](https://img.shields.io/badge/Dependabot-enable-brightgreen?logo=Dependabot)](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions/blob/master/.github/dependabot.yml)
![GitHub repo size](https://img.shields.io/github/repo-size/Tsanfer/vuepress_theme_reco-Github_Actions?logo=Git)
[![GitHub license](https://img.shields.io/github/license/Tsanfer/vuepress_theme_reco-Github_Actions?logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB4bWw6bGFuZz0ienh4IiB2ZXJzaW9uPSIxLjEiCiAgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjU4MHB4IiB2aWV3Qm94PSIwIDAgMjk3IDIxNSIKICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCj4KPHRpdGxlPkxvZ28gb2YgV1RGUEw8L3RpdGxlPgoKPGRlc2M+QW4gb2ZmaWNpYWwgbG9nbyBmb3IgdGhlIFdURlBMIChEbyB3aGF0IHRoZSBmdWNrIHlvdSB3YW50IHRvIFB1YmxpYyBMaWNlbnNlKS48L2Rlc2M+Cgo8bWV0YWRhdGE+CjxyZGY6UkRGCiAgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIgogIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKPgoJPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiI+CgkJPGRjOnRpdGxlIHhtbDpsYW5nPSJqYSI+V1RGUEzjga7jg63jgrQ8L2RjOnRpdGxlPgoJCTxkYzp0aXRsZSB4bWw6bGFuZz0ieC1kZWZhdWx0Ij5Mb2dvIG9mIFdURlBMPC9kYzp0aXRsZT4KCQk8ZGM6Y3JlYXRvciByZGY6cmVzb3VyY2U9Imh0dHBzOi8vbWV0YS53aWtpbWVkaWEub3JnLz9jdXJpZD0xMDQ4NDQ3MCIvPgoJCTxkYzpzdWJqZWN0IHJkZjpyZXNvdXJjZT0iaHR0cHM6Ly93d3cud2lraWRhdGEub3JnL3dpa2kvUTc5NzE5Ii8+CgkJPGRjOmRlc2NyaXB0aW9uIHhtbDpsYW5nPSJqYSIgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgoJCQk8ZGM6Zm9ybWF0IHJkZjpkYXRhdHlwZT0iaHR0cDovL3B1cmwub3JnL2RjL3Rlcm1zL0lNVCI+dGV4dC94LXdpa2k8L2RjOmZvcm1hdD4KCQkJPHJkZjp2YWx1ZT48IVtDREFUQVsKW1t3OmphOldURlBMfFdURlBMXV3vvIjjganjgYbjgajjgafjgoLli53miYvjgavjgZfjgoTjgYzjgozjgq/jgr3jg4Pjgr/jg6zjg7vlhazooYbliKnnlKjoqLHoq77mm7jvvInjga7lhazlvI/jg63jgrTjgIIKXV0+PCEtLSAgLS0+PC9yZGY6dmFsdWU+CgkJPC9kYzpkZXNjcmlwdGlvbj4KCQk8ZGM6ZGVzY3JpcHRpb24geG1sOmxhbmc9IngtZGVmYXVsdCIgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgoJCQk8ZGM6Zm9ybWF0IHJkZjpkYXRhdHlwZT0iaHR0cDovL3B1cmwub3JnL2RjL3Rlcm1zL0lNVCI+dGV4dC94LXdpa2k8L2RjOmZvcm1hdD4KCQkJPHJkZjp2YWx1ZT48IVtDREFUQVsKQW4gb2ZmaWNpYWwgbG9nbyBmb3IgdGhlIFtbdzpXVEZQTHxdXSAoRG8gd2hhdCB0aGUgZnVjayB5b3Ugd2FudCB0byBQdWJsaWMgTGljZW5zZSkuCl1dPjwhLS0gIC0tPjwvcmRmOnZhbHVlPgoJCTwvZGM6ZGVzY3JpcHRpb24+CgkJPGRjOmNvbnRyaWJ1dG9yIHJkZjpyZXNvdXJjZT0iaHR0cDovL3d3dy53dGZwbC5uZXQvIi8+CgkJPGRjOmRhdGUgcmRmOmRhdGF0eXBlPSJodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYWRhdGUiPjIwMTItMTItMjg8L2RjOmRhdGU+CgkJPGRjOnR5cGUgcmRmOmRhdGF0eXBlPSJodHRwOi8vcHVybC5vcmcvZGMvdGVybXMvRENNSVR5cGUiPlN0aWxsSW1hZ2U8L2RjOnR5cGU+CgkJPGRjOmZvcm1hdCByZGY6ZGF0YXR5cGU9Imh0dHA6Ly9wdXJsLm9yZy9kYy90ZXJtcy9JTVQiPmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KCQk8ZGM6c291cmNlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3d3dy53dGZwbC5uZXQvd3AtY29udGVudC91cGxvYWRzLzIwMTIvMTIvd3RmcGwuc3ZnIi8+CgkJPGRjOmxhbmd1YWdlIHJkZjpkYXRhdHlwZT0iaHR0cDovL3B1cmwub3JnL2RjL3Rlcm1zL0lTTzYzOS0yIj56eHg8L2RjOmxhbmd1YWdlPgoJCTxkYzpyaWdodHM+wqkgMjAxMiBXVEZQTCDigJMgRG8gV2hhdCB0aGUgRnVjayBZb3UgV2FudCB0byBQdWJsaWMgTGljZW5zZS48L2RjOnJpZ2h0cz4KCQk8ZGM6cmlnaHRzIHJkZjpyZXNvdXJjZT0iaHR0cDovL3d3dy53dGZwbC5uZXQvYWJvdXQvIi8+Cgk8L3JkZjpEZXNjcmlwdGlvbj4KPC9yZGY6UkRGPgo8L21ldGFkYXRhPgoKPHBhdGgKICBkPSJNIDEwOC40MDYyNSw1LjkwNjI1CiAgICAgQyAgNTIuMzA2MDU1LDUuOTA2MjUgICAgNi44NDM3NSw1MS4zOTk4MDUgICAgNi44NDM3NSwxMDcuNQogICAgICAgICA2Ljg0Mzc1LDE2My42MDAxOSAgNTIuMzA2MDU1LDIwOS4wOTM3NSAxMDguNDA2MjUsMjA5LjA5Mzc1CiAgICAgICAxMjIuNjEzMjksMjA5LjA5Mzc1IDEzNi4xMjc3NSwyMDYuMTQyMTYgIDE0OC40MDYyNSwyMDAuODc1CiAgICAgICAxNjAuNjg0NzUsMjA2LjE0MjE2IDE3NC4xOTkyMSwyMDkuMDkzNzUgIDE4OC40MDYyNSwyMDkuMDkzNzUKICAgICAgIDI0NC41MDY0NCwyMDkuMDkzNzUgMjkwLDE2My42MDAxOSAgICAgICAgMjkwLDEwNy41CiAgICAgICAyOTAsNTEuMzk5ODA1ICAgICAgIDI0NC41MDY0NCw1LjkwNjI1ICAgIDE4OC40MDYyNSw1LjkwNjI1CiAgICAgICAxNzQuMTk5MjEsNS45MDYyNSAgIDE2MC42ODQ3NSw4Ljg1Nzg0MTQgIDE0OC40MDYyNSwxNC4xMjUKICAgICAgIDEzNi4xMjc3NSw4Ljg1Nzg0MTQgMTIyLjYxMzI5LDUuOTA2MjUgICAgMTA4LjQwNjI1LDUuOTA2MjUgICAgegogICAgIE0gMTA2LjQwNjI1LDM3LjgxMjUKICAgICBDIDEyMS43MzU4NywzNy44MTI1ICAgMTM1LjkxNjQ3LDQyLjczMzM5NCAgMTQ3LjQ2ODc1LDUxLjA2MjUKICAgICAgIDE1OS4wMjEwMyw0Mi43MzMzOTQgMTczLjE3MDM4LDM3LjgxMjUgICAgMTg4LjUsMzcuODEyNQogICAgICAgMjI3LjMyMTgzLDM3LjgxMjUgICAyNTguODEyNSw2OS4yNzE5MjMgICAyNTguODEyNSwxMDguMDkzNzUKICAgICAgIDI1OC44MTI1LDE0Ni45MTU1OCAgMjI3LjMyMTgzLDE3OC40MDYyNSAgMTg4LjUsMTc4LjQwNjI1CiAgICAgICAxNzMuMTcyNzQsMTc4LjQwNjI1IDE1OS4wMjAwNiwxNzMuNDgzMDIgIDE0Ny40Njg3NSwxNjUuMTU2MjUKICAgICAgIDEzNS45MTc0NCwxNzMuNDgzMDIgMTIxLjczMzUxLDE3OC40MDYyNSAgMTA2LjQwNjI1LDE3OC40MDYyNQogICAgICAgIDY3LjU4NDQyMywxNzguNDA2MjUgMzYuMTI1LDE0Ni45MTU1OCAgICAgMzYuMTI1LDEwOC4wOTM3NQogICAgICAgIDM2LjEyNSw2OS4yNzE5MjMgICAgNjcuNTg0NDIzLDM3LjgxMjUgICAxMDYuNDA2MjUsMzcuODEyNSAgICB6IgovPgo8cGF0aAogIHN0cm9rZS13aWR0aD0iMC4yIgogIGQ9Im0gMTE2LjgyNTQ2LDY2LjE5Mjk3MyAtMzMuNDE5NTI1LDAKICAgICBjIC0yMi41NDc2Nyw0Ni42ODk2MTcgIC0zLjY3OTUwNSw3OC40NjkzNzcgIDExLjIzMDAxOCw4NS4wNjcyMjcKICAgICAgICAxNC45MDk1MjcsNi41OTc4NiAgIDM5LjI5Nzg5NywxMC43ODkyMyAgIDUyLjg0MzYyNywtMTMuNjQwNzEKICAgICAgICAxMS4xMjcsMjAuOTEwMzkgICAgIDM2LjQxMDE4LDIyLjEyMDIyICAgIDUzLjIyMTgxLDE0LjM3Njk2CiAgICAgICAgMTYuODExNjMsLTcuNzQzMjcgICAzMy4xMjMxMSwtNDMuMTE1NDcgICAxMS43MzA0NywtODUuODAzNDc3CiAgICAgbCAtMzMuOTkyMjcsMi43ZS01CiAgICAgYyAgMTEuNTAxNTksMjYuNDE5NDkyICAxMS43MzI1Nyw2Mi40NjIgICAgICAgMC4wMDksNjMuNTMyNjQKICAgICAgIC0xMS43MjM3OCwxLjA3MDYzICAgLTE1LjA5Njk0LC0yLjg0OTgxICAgLTEzLjc2NDQ2LC00NC4yODUyMzEKICAgICBsIC0zMy4zMDksLTAuMTQ5NjAyCiAgICAgYyAgIDIuNDg5MTEsNDAuOTAwMjczICAtNS4wODg4Myw0OC4wMDIwMDMgIC0xNS4zMzg2NSw0My41MTQzNjMKICAgICAgIC0xMC4yNDk4MiwtNC40ODc2MyAgIC05Ljc5NDY4LC0yOC4xMzA0MiAgICAwLjc4OTE4LC02Mi42MTIxOTcgeiIKLz4KPC9zdmc+Cg==)](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions/blob/master/LICENSE)

[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions)

::: tip 提示

查看此文档前应先了解，[vuepress 基本操作](https://tsanfer.xyz/views/frontEnd/VuePress%20+%20GithubPages%20+%20TravisCI%20.html#%E6%9C%80%E7%BB%88%E6%95%88%E6%9E%9C)

:::

参考官方文档进行配置：

::: tip 提示

[vuepress-theme-reco](https://vuepress-theme-reco.recoluan.com/)

[VuePress](https://vuepress.vuejs.org/zh/)

[SamKirkland / FTP-Deploy-Action](https://github.com/marketplace/actions/ftp-deploy)

:::

## 最终效果

[最终效果链接](https://tsanfer.xyz/)

![最终效果链接](https://cdn-image.tsanfer.xyz/img/20200322150711.png)

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
sudo yarn global add @vuepress-reco/theme-cli
theme-cli init my-blog

# 安装
cd my-blog
sudo yarn install
```

#### 更改最新依赖

```json
// package.json

{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  },
  "dependencies": {
    "vuepress": "^1.5.2",
    "vuepress-theme-reco": "^1.4.6",
    "vuepress-plugin-flowchart": "^1.4.3",
    "@vuepress-reco/vuepress-plugin-bgm-player": "^1.1.3",
    "@vuepress/plugin-nprogress": "^1.5.0",
    "vuepress-plugin-reading-progress": "^1.0.9",
    "vuepress-plugin-code-copy": "^1.0.6",
    "vuepress-plugin-social-share": "^0.3.0",
    "vue-class-component": "^7.2.3",
    "@vuepress-reco/vuepress-plugin-rss": "^1.0.1"
  }
}
```

然后，安装依赖

```bash
sudo yarn
```

### 目录结构

```bash

.
├── .git-ftp-include  // 用于最后指定需要部署的文件或文件夹
├── .gitattributes  // 用于统一文件内编码的换行符
├── .github
│   └── workflows
│       └── nodejs.yml  // Github Actions的配置文件
├── .gitignore  // 忽略上传到Github的文件或目录
├── LICENSE // 许可证文件
├── README.md // Github项目展示文件
├── docs  // VuePress项目根目录
│   ├── .vuepress // 存放配置文件的文件夹
│   │   ├── config.js // 整个工程的配置文件
│   │   ├── dist  // 最后生成的文件目录
│   │   ├── public  // 媒体文件夹（主要是图片）
│   │   └── styles  // 网页样式文件夹（里面空的，没有用）
│   ├── README.md // 网页首页文件
│   └── views // 存放markdown文件的文件夹（可以不要直接把markdown文件放在docs里面）
│       └── frontEnd  // 分类目录（也可以不要分类目录直接放在views里面）
├── package.json  // 指定依赖，项目脚本，Node.js项目描述文件
├── yarn-error.log  // 记录构建失败的日志文件
└── yarn.lock // 变更依赖时自动生成和更新

```

### 添加博客配置

然后根据需要更改一些内容和设置，参考官方的文档，可自行取舍相应内容

::: tip 提示

[vuepress-theme-reco](https://vuepress-theme-reco.recoluan.com/)

[VuePress](https://vuepress.vuejs.org/zh/)

:::

```javascript
// docs/.vuepress/config.js

module.exports = {
  // host: '0.0.0.0',  // 生成网页地址（本地调试使用）
  // port: '22335',  // 生成网页端口（本地调试使用）
  title: "Tsanfer's Blog", // 显示在左上角的网页名称以及首页在浏览器标签显示的title名称
  description: "现居住于猎户臂上的一个碳基生命", // meta 中的描述文字，用于SEO
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

  theme: "reco", //选择主题‘reco’
  themeConfig: {
    type: "blog", //选择类型博客
    fullscreen: true,
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: "分类", // 默认 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: "标签", // 默认 “标签”
      },
    },
    nav: [
      //导航栏设置
      { text: "主页", link: "/", icon: "reco-home" },
      { text: "时间线", link: "/timeline/", icon: "reco-date" },
      { text: "订阅", link: "https://tsanfer.xyz/rss.xml", icon: "reco-rss" },
      {
        text: "联系",
        icon: "reco-message",
        items: [
          {
            text: "GitHub",
            link: "https://github.com/Tsanfer",
            icon: "reco-github",
          },
          {
            text: "CSDN",
            link: "https://blog.csdn.net/qq_27961843/",
            icon: "reco-csdn",
          },
          {
            text: "BiliBili",
            link: "https://space.bilibili.com/12167681",
            icon: "reco-bilibili",
          },
          {
            text: "QQ",
            link:
              "tencent://AddContact/?fromId=50&fromSubId=1&subcmd=all&uin=1124851454",
            icon: "reco-qq",
          },
          {
            text: "Twitter",
            link: "https://twitter.com/a1124851454",
            icon: "reco-twitter",
          },
          {
            text: "Gmail",
            link: "mailto:a1124851454@gmail.com",
            icon: "reco-mail",
          },
          {
            text: "个人网盘",
            link: "http://clouddisk.tsanfer.xyz:8080",
            icon: "reco-account",
          },
        ],
      },
    ],
    sidebar: "auto", //在所有页面中启用自动生成侧栏
    record: "蜀ICP备20005033号-1",
    recordLink: "https://icp.chinaz.com/tsanfer.xyz",
    cyberSecurityRecord: "川公网安备 51110202000301号",
    cyberSecurityLink:
      "http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51110202000301",
    startYear: "2020", // 项目开始时间，只填写年份
    lastUpdated: "最后更新时间", // string | boolean
    author: "Tsanfer",
    authorAvatar: "/avatar.svg", //作者头像
    mode: "light", //默认显示白天模式
    // 评论设置
    valineConfig: {
      appId: process.env.LEANCLOUD_APP_ID,
      appKey: process.env.LEANCLOUD_APP_KEY,
    },
  },

  markdown: {
    lineNumbers: true, //代码显示行号
  },
  // 搜索设置
  search: true,
  searchMaxSuggestions: 10,

  // 插件
  plugins: [
    [
      "@vuepress-reco/vuepress-plugin-bgm-player", // BGM播放器
      {
        audios: [
          {
            name: "Faster Than Light",
            artist: "Andreas Waldetoft / Mia Stegmar",
            url:
              "https://cdn-image.tsanfer.xyz/music/Andreas%20Waldetoft%2CMia%20Stegmar%20-%20Faster%20Than%20Light.mp3",
            cover:
              "https://p1.music.126.net/Gxv6d9W4Yd9q9WNHPpi8rw==/1379887104073348.jpg",
          },
          {
            name: "Dawn",
            artist: "DDRKirby(ISQ)",
            url:
              "https://cdn-image.tsanfer.xyz/music/Dawn%20-%20DDRKirby%28ISQ%29.mp3",
            cover:
              "https://p2.music.126.net/IPnqMCk8YaN9inwYV2bdgQ==/18774161044446693.jpg",
          },
          {
            name: "TRON Legacy (End Titles)",
            artist: "Daft Punk",
            url:
              "https://cdn-image.tsanfer.xyz/music/Daft%20Punk%20-%20TRON%20Legacy%20%28End%20Titles%29.mp3",
            cover:
              "https://p2.music.126.net/qOOTIykbSLw9RHB0vI83GA==/737772302281958.jpg",
          },
          {
            name: "Reconfig",
            artist: "Shortwire",
            url:
              "https://cdn-image.tsanfer.xyz/music/Reconfig%20-%20Shortwire.mp3",
            cover:
              "https://p2.music.126.net/2oouVh_rHOv1nZXYapF41A==/109951163606358209.jpg",
          },
          {
            name: "Broken Boy",
            artist: "Tonspender",
            url:
              "https://cdn-image.tsanfer.xyz/music/Tonspender%20-%20Broken%20Boy.flac",
            cover:
              "https://p2.music.126.net/4TnTRyHqa3-D2H1UnOa00w==/109951163666994621.jpg",
          },
          {
            name: "Forever",
            artist: "PIKASONIC",
            url: "https://cdn-image.tsanfer.xyz/music/forever%20mst.mp3",
            cover:
              "https://p1.music.126.net/LjXufn3OaIgf8OwaEP_xcQ==/109951164419438501.jpg",
          },
          {
            name: "Life Of Sin Pt. 4",
            artist: "MitiS",
            url:
              "https://cdn-image.tsanfer.xyz/music/MitiS%20-%20Life%20Of%20Sin%20Pt.%204.mp3",
            cover:
              "https://p2.music.126.net/LmjTrSwvSLSNBsfFsQFO6g==/2533274793491743.jpg",
          },
          {
            name: "Sea Of Voices (RAC Mix)",
            artist: "Porter Robinson",
            url:
              "https://cdn-image.tsanfer.xyz/music/Porter%20Robinson%20-%20Sea%20Of%20Voices%20%28RAC%20Mix%29.mp3",
            cover:
              "https://p1.music.126.net/zjQROkEUokU7iS5eUvnVZQ==/3264450027161111.jpg",
          },
          {
            name: "New Lipstick",
            artist: "The Kissaway Trail",
            url:
              "https://cdn-image.tsanfer.xyz/music/The%20Kissaway%20Trail%20-%20New%20Lipstick.flac",
            cover:
              "https://p2.music.126.net/VjN74c1hoYgPCEZ9DngeQw==/109951163772624643.jpg",
          },
        ],
      },
    ],
    [
      "social-share", //分享插件
      {
        networks: ["qq", "weibo", "twitter", "facebook", "email"], //分享类型
        email: "a1124851454@gmail.com", //email地址
        twitterUser: "a1124851454", //Twitter账号
      },
    ],
    [
      "@vuepress-reco/vuepress-plugin-rss", //RSS插件
      {
        site_url: "https://tsanfer.xyz", //网站地址
        copyright: "Tsanfer", //版权署名
      },
    ],
    ["flowchart"], // 支持流程图
    ["vuepress-plugin-smooth-scroll"], // 平滑滚动
    ["@vuepress/nprogress"], // 加载进度条
    ["reading-progress"], // 阅读进度条
    ["vuepress-plugin-code-copy", true], //一键复制代码插件
  ],
};
```

## Github Actions 配置

### 修改 Github Actions 配置文件

在 Github 网页上添加 Github Actions 配置文件，参考官方的文档，可自行取舍相应内容，其中需要保密的部分需要添加 Github Secrets 环境变量

::: tip 提示

[SamKirkland / FTP-Deploy-Action](https://github.com/marketplace/actions/ftp-deploy)

:::

```yml
# .github/workflows/nodejs.yml

on: push # 触发此文件运行的条件
name: Github Actions # 此工作流程（workflow）的名字
jobs:
  FTP-Deploy-Action:
    name: FTP-Deploy-Action # 此任务（job）的名字
    runs-on: ubuntu-latest # 运行环境
    steps:
      - uses: actions/checkout@master # 切换分支到master
        with:
          fetch-depth: 2

      - name: Use Node.js 12.x
        uses: actions/setup-node@v1
        with:
          node-version: "12.x"

      - name: Build Project # 此步骤（step）的名字
        run: yarn install && yarn docs:build # 下载依赖和构建项目
        env:
          LEANCLOUD_APP_ID: ${{ secrets.LEANCLOUD_APP_ID }} # 评论系统的ID
          LEANCLOUD_APP_KEY: ${{ secrets.LEANCLOUD_APP_KEY }} # 评论系统的KEY

      - name: FTP-Deploy-Action
        uses: SamKirkland/FTP-Deploy-Action@3.1.1
        with:
          ftp-server: sftp://${{ secrets.FTP_IP }}/home/www/htdocs # 服务器地址和端口（可以填域名，不过我服务器做了全站加速会导向加速结点的IP，所以只能用服务器的IP）
          ftp-username: ${{ secrets.FTP_USERNAME }} # FTP用户名
          ftp-password: ${{ secrets.FTP_PASSWORD }} # FTP密码
          git-ftp-args: --insecure # （如果是FTP连接的话--insecure不用加）
          local-dir: docs/.vuepress/dist/ # 选择哪些文件要部署到服务器，这个选项在这里选了之后，要在.git-ftp-include中添加相应的路径
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

> 本文由[Tsanfer's Blog](https://tsanfer.xyz) 发布！
