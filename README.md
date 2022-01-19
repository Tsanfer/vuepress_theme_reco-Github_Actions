# vuepress-theme-reco + Github Actions 搭建静态博客，自动构建部署到第三方服务器

[![CI/CD](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions/workflows/CI/CD/badge.svg)](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions/actions)
[![Lint Code Base](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions/actions)
[![CodeFactor](https://www.codefactor.io/repository/github/tsanfer/vuepress_theme_reco-github_actions/badge)](https://www.codefactor.io/repository/github/tsanfer/vuepress_theme_reco-github_actions)
[![codecov](https://codecov.io/gh/Tsanfer/vuepress_theme_reco-Github_Actions/branch/master/graph/badge.svg)](https://codecov.io/gh/Tsanfer/vuepress_theme_reco-Github_Actions)
[![dependabot](https://img.shields.io/badge/Dependabot-enable-brightgreen?logo=Dependabot)](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions/blob/master/.github/dependabot.yml)
![GitHub repo size](https://img.shields.io/github/repo-size/Tsanfer/vuepress_theme_reco-Github_Actions?logo=Git)
[![GitHub license](https://img.shields.io/github/license/Tsanfer/vuepress_theme_reco-Github_Actions)](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions/blob/master/LICENSE)

[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions)

- > [最新博客链接](https://tsanfer.com/views/frontEnd/vuepress_theme_reco-Github_Actions.html)
- > [Github 链接](https://github.com/Tsanfer/vuepress_theme_reco-Github_Actions)

查看此文档前应先了解，[vuepress 基本操作](https://tsanfer.com/views/frontEnd/VuePress%20+%20GithubPages%20+%20TravisCI%20.html#%E6%9C%80%E7%BB%88%E6%95%88%E6%9E%9C)

参考官方文档进行配置：

- > [vuepress-theme-reco](https://vuepress-theme-reco.recoluan.com/)
- > [VuePress](https://vuepress.vuejs.org/zh/)
- > [SamKirkland / FTP-Deploy-Action](https://github.com/marketplace/actions/ftp-deploy)

## 最终效果

[最终效果链接](https://tsanfer.com/)

![最终效果](https://oss.tsanfer.com/image/20200322150711.png)

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
{
  "scripts": {
    "docs:dev": "vuepress dev docs",
    "docs:build": "vuepress build docs"
  },
  "dependencies": {
    "@vuepress-reco/vuepress-plugin-rss": "^1.0.2",
    "@vuepress/plugin-nprogress": "^1.8.2",
    "npm-check": "^5.9.2",
    "vue-class-component": "^7.2.6",
    "vue-router": "^3.5.2",
    "vuepress": "^1.8.2",
    "vuepress-plugin-code-copy": "^1.0.6",
    "vuepress-plugin-flowchart": "^1.4.3",
    "vuepress-plugin-meting": "^0.3.0",
    "vuepress-plugin-reading-progress": "^1.0.10",
    "vuepress-theme-reco": "^1.6.6"
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
├── .git-ftp-include // 用于最后指定需要部署的文件或文件夹
├── .gitattributes // 用于统一文件内编码的换行符
├── .github
│   └── workflows
│       └── nodejs.yml // Github Actions的配置文件
├── .gitignore // 忽略上传到Github的文件或目录
├── LICENSE // 许可证文件
├── README.md // Github项目展示文件
├── docs // VuePress项目根目录
│   ├── .vuepress // 存放配置文件的文件夹
│   │   ├── config.js // 整个工程的配置文件
│   │   ├── dist // 最后生成的文件目录
│   │   ├── public // 媒体文件夹（主要是图片）
│   │   └── styles // 网页样式文件夹（里面空的，没有用）
│   ├── README.md // 网页首页文件
│   └── views // 存放markdown文件的文件夹（可以不要直接把markdown文件放在docs里面）
│       └── frontEnd // 分类目录（也可以不要分类目录直接放在views里面）
├── package.json // 指定依赖，项目脚本，Node.js项目描述文件
├── yarn-error.log // 记录构建失败的日志文件
└── yarn.lock // 变更依赖时自动生成和更新
```

### 添加博客配置

然后根据需要更改一些内容和设置，参考官方的文档，可自行取舍相应内容

- > [vuepress-theme-reco](https://vuepress-theme-reco.recoluan.com/)
- > [VuePress](https://vuepress.vuejs.org/zh/)

```javascript
// docs/.vuepress/config.js

module.exports = {
//   host: "0.0.0.0", // 生成网页地址（本地调试使用）
//   port: "22333", // 生成网页端口（本地调试使用）
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
      socialLinks: [
        { icon: "reco-github", link: "https://github.com/Tsanfer" },
        { icon: "reco-bilibili", link: "https://space.bilibili.com/12167681" },
        { icon: "reco-qq", link: "tencent://message/?uin=1124851454" },
        { icon: "reco-twitter", link: "https://twitter.com/a1124851454" },
        { icon: "reco-mail", link: "mailto:a1124851454@gmail.com" },
      ],
    },
    nav: [
      //导航栏设置
      { text: "主页", link: "/", icon: "reco-home" },
      {
        text: "工具",
        icon: "reco-api",
        items: [
          {
            text: "个人网盘",
            link: "http://clouddisk.tsanfer.com:8080",
            icon: "fa-hdd",
          },
          {
            text: "订阅转换器",
            link: "http://clouddisk.tsanfer.com:58080",
            icon: "fa-exchange-alt",
          },
          {
            text: "目标检测",
            link: "http://hpc.tsanfer.com:8000",
            icon: "fa-object-ungroup",
          },
        ],
      },
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
            link: "tencent://message/?uin=1124851454",
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
        ],
      },
    ],
    sidebar: {
      "/views/frontEnd/": [
        {
          title: "前端", // 必要的
          sidebarDepth: 2, // 可选的, 默认值是 1
          children: [
            "vuepress_theme_reco-Github_Actions",
            "VuePress_GithubPages_TravisCI",
            "Sphinx_GitHub_ReadtheDocs",
          ],
        },
      ],
      "/views/MCU/": [
        {
          title: "MCU", // 必要的
          sidebarDepth: 2, // 可选的, 默认值是 1
          children: [
            "Linux_board_NFS",
            "First_Prepare_for_Lanqiao_Cup_MCU_Competition",
          ],
        },
      ],
      "/views/Computer/": [
        {
          title: "计算机", // 必要的
          sidebarDepth: 2, // 可选的, 默认值是 1
          children: ["Storage_hardware"],
        },
      ],
      "/views/Tool/": [
        {
          title: "工具", // 必要的
          sidebarDepth: 2, // 可选的, 默认值是 1
          children: ["ffmpeg", "scrcpy"],
        },
      ],
    },
    // displayAllHeaders: true, // 默认值：false
    subSidebar: "auto",

    record: "蜀ICP备20005033号-1",
    recordLink: "https://icp.chinaz.com/home/info?host=tsanfer.com",
    cyberSecurityRecord: "川公网安备 51110202000301号",
    cyberSecurityLink:
      "http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=51110202000301",
    startYear: "2020", // 项目开始时间，只填写年份
    lastUpdated: "最后更新时间", // string | boolean
    author: "Tsanfer",
    authorAvatar: "/avatar.svg", //作者头像
    mode: "light", //默认显示白天模式
    codeTheme: "okaidia", // default 'tomorrow'
    smooth: "true", //平滑滚动
    // 评论设置
    valineConfig: {
      appId: process.env.LEANCLOUD_APP_ID,
      appKey: process.env.LEANCLOUD_APP_KEY,
    },
  },
  markdown: {
    lineNumbers: true, //代码显示行号
  }, // 搜索设置
  search: true,
  searchMaxSuggestions: 10, // 插件
  plugins: [
    [
      "meting",
      {
        // metingApi: "https://meting.sigure.com/api/music",
        meting: {
          server: "netease",
          type: "playlist",
          mid: "4902520778",
        },
        aplayer: {
          lrcType: 3,
          theme: "#3489fd",
        },
      },
    ],
    [
      "@vuepress-reco/vuepress-plugin-rss", //RSS插件
      {
        site_url: "https://tsanfer.com", //网站地址
        copyright: "Tsanfer", //版权署名
      },
    ],
    ["flowchart"], // 支持流程图
    ["@vuepress/nprogress"], // 加载进度条
    ["reading-progress"], // 阅读进度条
    ["vuepress-plugin-code-copy", true], //一键复制代码插件
  ],
};

```

## Github Actions 配置

### 修改 Github Actions 配置文件

在 Github 网页上添加 Github Actions 配置文件，参考官方的文档，可自行取舍相应内容，其中需要保密的部分需要添加 Github Secrets 环境变量

> [SamKirkland / FTP-Deploy-Action](https://github.com/marketplace/actions/ftp-deploy)

```yml
# .github/workflows/nodejs.yml

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

      - name: Use Node.js 14.x
        uses: actions/setup-node@v2.4.1 # 使用node环境
        with:
          node-version: "14.x" # 版本14

      - name: Cache node modules
        id: cache # 缓存id
        uses: actions/cache@v2.1.6
        env:
          cache-name: cache-node-modules # 缓存名字
        with:
          path: node_modules # 缓存路径
          key: ${{ runner.os }}-build-${{ env.cache-name }}-${{ hashFiles('package.json') }} # 缓存标识

      - name: Install Dependencies
        if: steps.cache.outputs.cache-hit != 'true' # 如果没有缓存的话
        run: npm install # 安装依赖

      - name: Build project
        run: npm run docs:build # 构建项目和生成代码覆盖率报告
        env:
          LEANCLOUD_APP_ID: ${{ secrets.LEANCLOUD_APP_ID }} # 评 论系统的ID
          LEANCLOUD_APP_KEY: ${{ secrets.LEANCLOUD_APP_KEY }} # 评论系统的KEY

      # 如果FTP-Deploy-Action出现，Dirty repository: Having uncommitted changes. 问题时，使用以下注释步骤解决问题
      - name: reset git
        run: git reset --hard

      - name: 📂 Sync files
        uses: SamKirkland/FTP-Deploy-Action@4.1.0
        with:
          server: ${{ secrets.FTP_IP }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: docs/.vuepress/dist/ # 选择哪些文件要部署到服务器，这个选项在这里选了之后，要在.git-ftp-include中添加相应的路径
          server-dir: default/

#           ftp-server: sftp://${{ secrets.FTP_IP }}/home/www/htdocs # 服务器地址和端口（可以填域名，不过我服务器做了全站加速会导向加速结点的IP，所以只能用服务器的IP）
#           ftp-username: ${{ secrets.FTP_USERNAME }} # FTP用户名
#           ftp-password: ${{ secrets.FTP_PASSWORD }} # FTP密码
#           git-ftp-args: --insecure # （如果是FTP连接的话--insecure不用加）
#           local-dir: docs/.vuepress/dist/ # 选择哪些文件要部署到服务器，这个选项在这里选了之后，要在.git-ftp-include中添加相应的路径

      - name: upload-artifact
        uses: actions/upload-artifact@v2.2.4 #共享或保存action过程中产生的文件
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
