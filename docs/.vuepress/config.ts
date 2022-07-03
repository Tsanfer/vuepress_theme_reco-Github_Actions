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
          {
            text: "Hack",
            icon: "bug",
            link: "/categories/Hack/1/",
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
