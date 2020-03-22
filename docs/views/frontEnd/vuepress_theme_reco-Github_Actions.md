---
title: vuepress-theme-reco + Github Actions 构建静态博客，部署到第三方服务器
date: 2020-03-21
sidebar: 'auto'
categories:
 - 前端
tags:
 - VuePress
 - Github
 - 博客
---

::: tip

先下载主题模板，再根据自己的需要进行相应的修改，再根据自己的服务器配置Github Actions文件，最后上传到Github，触发Github Actions自动构建部署到服务器

:::

<!-- more -->

> [最新博客链接](https://tsanfer.xyz/views/frontEnd/vuepress_theme_reco-Github_Actions.html)

> [Github链接](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions)


<p align="center">
  <a href="https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions/actions"><img src="https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions/workflows/Github%20Actions/badge.svg" alt="Build Status"></a>
  <a href="https://creativecommons.org/licenses/by-sa/4.0/"><img src="https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg" alt="Coverage Status"></a>
</p>

::: tip 提示

查看此文档前应先了解，[vuepress基本操作](https://tsanfer.xyz/views/frontEnd/VuePress%20+%20GithubPages%20+%20TravisCI%20.html#%E6%9C%80%E7%BB%88%E6%95%88%E6%9E%9C)

:::

参考官方文档进行配置：

::: tip 提示

[vuepress-theme-reco](https://vuepress-theme-reco.recoluan.com/)

[VuePress](https://vuepress.vuejs.org/zh/)

[SamKirkland / FTP-Deploy-Action](https://github.com/marketplace/actions/ftp-deploy)

:::



## 最终效果

[最终效果链接](https://tsanfer.xyz/)

![](https://cdn-image.tsanfer.xyz/img/20200322150711.png)



## 思路

下载vuepress-theme-reco官方的主题模板（脚手架），再根据自己的需要进行相应的修改，再根据自己的服务器配置Github Actions文件，最后上传到Github，触发Github Actions自动构建部署到第三方服务器。以后就只需提交markdown文件到Github，Github Actions便可自动部署到第三方服务器



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

  通过GitHub action自动部署网页等操作

  



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
    "dev": "vuepress dev docs",
    "build": "vuepress build docs"
  },
  "dependencies": {
    "vuepress": "^1.4.0",
    "vuepress-theme-reco": "^1.3.2",
    "vuepress-plugin-flowchart": "^1.4.3",
    "@vuepress-reco/vuepress-plugin-bgm-player": "^1.1.2",
    "@vuepress/plugin-nprogress": "^1.4.0",
    "vuepress-plugin-reading-progress": "^1.0.8"
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
├── .git-ftp-include	// 用于最后指定需要部署的文件或文件夹
├── .gitattributes	// 用于统一文件内编码的换行符
├── .github
│   └── workflows
│       └── nodejs.yml	// Github Actions的配置文件
├── .gitignore	// 忽略上传到Github的文件或目录
├── LICENSE	// 许可证文件
├── README.md	// Github项目展示文件
├── docs	// VuePress项目根目录
│   ├── .vuepress	// 存放配置文件的文件夹
│   │   ├── config.js	// 整个工程的配置文件
│   │   ├── dist	// 最后生成的文件目录
│   │   ├── public	// 媒体文件夹（主要是图片）
│   │   └── styles	// 网页样式文件夹（里面空的，没有用）
│   ├── README.md	// 网页首页文件
│   └── views	// 存放markdown文件的文件夹（可以不要直接把markdown文件放在docs里面）
│       └── frontEnd	// 分类目录（也可以不要分类目录直接放在views里面）
├── package.json	// 指定依赖，项目脚本，Node.js项目描述文件
├── yarn-error.log	// 记录构建失败的日志文件
└── yarn.lock	// 变更依赖时自动生成和更新
```



### 添加博客配置

然后根据需要更改一些内容和设置，参考官方的文档，可自行取舍相应内容

::: tip 提示

[vuepress-theme-reco](https://vuepress-theme-reco.recoluan.com/)

[VuePress](https://vuepress.vuejs.org/zh/)

:::

```javascript {51,52}
// docs/.vuepress/config.js

module.exports = {

  // host: '0.0.0.0',  // 生成网页地址（本地调试使用）
  // port: '22335',  // 生成网页端口（本地调试使用）
  title: "Tsanfer's Blog",  // 显示在左上角的网页名称以及首页在浏览器标签显示的title名称
  description: '现居住于猎户臂上的一个碳基生命',  // meta 中的描述文字，用于SEO
  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],  //浏览器的标签栏的网页图标,基地址/docs/.vuepress/public
    ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }], //在移动端，搜索框在获得焦点时会放大
  ],

  theme: 'reco',  //选择主题‘reco’
  themeConfig: {
    type: 'blog', //选择类型博客
    blogConfig: {
      category: {
        location: 2, // 在导航栏菜单中所占的位置，默认2
        text: '分类' // 默认 “分类”
      },
      tag: {
        location: 3, // 在导航栏菜单中所占的位置，默认3
        text: '标签' // 默认 “标签”
      },
    },
    nav: [  //导航栏设置
      { text: '主页', link: '/', icon: 'reco-home' },
      { text: '时间线', link: '/timeline/', icon: 'reco-date' },
      { text: '联系', 
        icon: 'reco-message',
        items: [
          { text: 'GitHub', link: 'https://github.com/Tsanfer', icon: 'reco-github' },
          { text: 'CSDN', link: 'https://blog.csdn.net/qq_27961843/', icon: 'reco-csdn' },
          { text: 'BiliBili', link: 'https://space.bilibili.com/12167681', icon: 'reco-bilibili' },
          { text: 'QQ', link: 'tencent://AddContact/?fromId=50&fromSubId=1&subcmd=all&uin=1124851454', icon: 'reco-qq' },
          { text: 'twitter', link: 'https://twitter.com/a1124851454', icon: 'reco-twitter' },
          { text: 'Gmail', link: 'mailto:a1124851454@gmail.com', icon: 'reco-mail' },
        ]
      }
    ],
    sidebar: 'auto',  //在所有页面中启用自动生成侧栏
    record: '蜀ICP备20005033号-1',
    startYear: '2020', // 项目开始时间，只填写年份
    lastUpdated: '最后更新时间', // string | boolean
    author: 'Tsanfer',
    authorAvatar: '/avatar.svg',  //作者头像
    mode: 'light',  //默认显示白天模式
    // 评论设置
    valineConfig: {
      appId: process.env.LEANCLOUD_APP_ID,
      appKey: process.env.LEANCLOUD_APP_KEY,
    }
  },

  markdown: {
    lineNumbers: true //代码显示行号
  },
  // 搜索设置
  search: true,
  searchMaxSuggestions: 10,

  // 插件
  plugins: [
    ['flowchart'],  // 支持流程图
    [
      '@vuepress-reco/vuepress-plugin-bgm-player',  // BGM播放器
      {
        audios: [
          {name: 'Faster Than Light',artist: 'Andreas Waldetoft / Mia Stegmar',url: 'https://cdn-image.tsanfer.xyz/music/Andreas%20Waldetoft%2CMia%20Stegmar%20-%20Faster%20Than%20Light.mp3',cover: 'https://p1.music.126.net/Gxv6d9W4Yd9q9WNHPpi8rw==/1379887104073348.jpg'},
          {name: 'Dawn',artist: 'DDRKirby(ISQ)',url: 'https://cdn-image.tsanfer.xyz/music/Dawn%20-%20DDRKirby%28ISQ%29.mp3',cover: 'https://p2.music.126.net/IPnqMCk8YaN9inwYV2bdgQ==/18774161044446693.jpg'},
          {name: 'TRON Legacy (End Titles)',artist: 'Daft Punk',url: 'https://cdn-image.tsanfer.xyz/music/Daft%20Punk%20-%20TRON%20Legacy%20%28End%20Titles%29.mp3',cover: 'https://p2.music.126.net/qOOTIykbSLw9RHB0vI83GA==/737772302281958.jpg'},
          {name: 'Broken Boy',artist: 'Tonspender',url: 'https://cdn-image.tsanfer.xyz/music/Tonspender%20-%20Broken%20Boy.flac',cover: 'https://p2.music.126.net/4TnTRyHqa3-D2H1UnOa00w==/109951163666994621.jpg'},
          {name: 'Life Of Sin Pt. 4',artist: 'MitiS',url: 'https://cdn-image.tsanfer.xyz/music/MitiS%20-%20Life%20Of%20Sin%20Pt.%204.mp3',cover: 'https://p2.music.126.net/LmjTrSwvSLSNBsfFsQFO6g==/2533274793491743.jpg'},
          {name: 'Sea Of Voices (RAC Mix)',artist: 'Porter Robinson',url: 'https://cdn-image.tsanfer.xyz/music/Porter%20Robinson%20-%20Sea%20Of%20Voices%20%28RAC%20Mix%29.mp3',cover: 'https://p1.music.126.net/zjQROkEUokU7iS5eUvnVZQ==/3264450027161111.jpg'},
          {name: 'New Lipstick',artist: 'The Kissaway Trail',url: 'https://cdn-image.tsanfer.xyz/music/The%20Kissaway%20Trail%20-%20New%20Lipstick.flac',cover: 'https://p2.music.126.net/VjN74c1hoYgPCEZ9DngeQw==/109951163772624643.jpg'},
        ],
      },
    ],
    ['vuepress-plugin-smooth-scroll'],  // 平滑滚动
    ['@vuepress/nprogress'],  // 加载进度条
    ['reading-progress']  // 阅读进度条
  ]
}

```



## Github Actions配置

### 修改Github Actions配置文件

在Github网页上添加Github Actions配置文件，参考官方的文档，可自行取舍相应内容，其中需要保密的部分需要添加Github Secrets环境变量

::: tip 提示

[SamKirkland / FTP-Deploy-Action](https://github.com/marketplace/actions/ftp-deploy)

:::

```yml {22,23,32,33}
# .github/workflows/nodejs.yml

on: push  # 触发此文件运行的条件
name: Github Actions  # 此工作流程（workflow）的名字
jobs:
  FTP-Deploy-Action:
    name: FTP-Deploy-Action # 此任务（job）的名字
    runs-on: ubuntu-latest  # 运行环境
    steps:
    - uses: actions/checkout@master # 切换分支到master
      with:
        fetch-depth: 2

    - name: Use Node.js 12.x  
      uses: actions/setup-node@v1
      with:
        node-version: '12.x'
        
    - name: Build Project # 此步骤（step）的名字
      run: yarn && yarn build # 下载依赖和构建项目
      env:
        LEANCLOUD_APP_ID: ${{ secrets.LEANCLOUD_APP_ID }} # 评论系统的ID
        LEANCLOUD_APP_KEY: ${{ secrets.LEANCLOUD_APP_KEY }} # 评论系统的KEY

    - name: List output files
      run: ls -a docs/.vuepress/dist # 显示生成的目录文件
      
    - name: FTP-Deploy-Action
      uses: SamKirkland/FTP-Deploy-Action@3.0.0
      with:
        ftp-server: sftp://39.107.221.57:22 # 服务器地址和端口（可以填域名，不过我服务器做了全站加速会导向加速结点的IP，所以只能用服务器的IP）
        ftp-username: ${{ secrets.FTP_USERNAME }} # FTP用户名
        ftp-password: ${{ secrets.FTP_PASSWORD }} # FTP密码
        git-ftp-args: --insecure --remote-root /home/www/htdocs # 要部署到服务器的哪个位置（我这用的是SFTP，如果是FTP连接的话--insecure不用加）
        local-dir: docs/.vuepress/dist/ # 选择哪些文件要部署到服务器，这个选项在这里选了之后，要在.git-ftp-include中添加相应的路径
```

```
// .git-ftp-include

!docs/.vuepress/dist/
```





### 添加Github Token

为了保密，把重要信息用变量表示，在Github Secrets中添加相应的值

仓库的Settings --> Secrets --> Add a new secret

比如

- Name: FTP_USERNAME
- Value: admin



最后再把代码上传到Github便可自动触发构建，部署到第三方服务器

> 本文由[Tsanfer's Blog](https://tsanfer.xyz) 发布！ 
