// docs/.vuepress/config.js

module.exports = {
  //   host: "0.0.0.0", // 生成网页地址（本地调试使用）
  //   port: "22333", // 生成网页端口（本地调试使用）
  title: "Tsanfer's Blog", // 显示在左上角的网页名称以及首页在浏览器标签显示的title名称
  description: "网络空间无限宽广", // meta 中的描述文字，用于SEO
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
        { icon: "reco-douban", link: "https://www.douban.com/people/219819109" },
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
            icon: "fa-hard-drive",
          },
          {
            text: "订阅转换器",
            link: "http://clouddisk.tsanfer.com:58080",
            icon: "fa-right-left",
          },
          {
            text: "目标检测",
            link: "http://hpc.tsanfer.com:8000",
            icon: "fa-solid fa-object-ungroup",
          },
          {
            text: "在线 XM 音乐播放器",
            link: "http://clouddisk.tsanfer.com:8081",
            icon: "fa-robot",
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
            text: "豆瓣",
            link: "https://www.douban.com/people/219819109",
            icon: "reco-douban",
          },
          {
            text: "网易云音乐",
            link: "https://music.163.com/#/user/home?id=69696518",
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
          children: [
            "Storage_hardware",
            "Windows_WSL_terminal_WebDAV_PartitionBackup",
            "C92_Openwrt_DNS_Swap"
          ],
        },
      ],
      "/views/Tool/": [
        {
          title: "工具", // 必要的
          sidebarDepth: 2, // 可选的, 默认值是 1
          children: ["Frp_Docker_SSH_RDP"],
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
    // displayAllHeaders: true, // 默认值：false
    subSidebar: "auto",

    record: "蜀ICP备20005033号-2",
    recordLink: "https://beian.miit.gov.cn/",
    cyberSecurityRecord: "川公网安备 51110202000301号",
    cyberSecurityLink: "http://www.beian.gov.cn/",
    startYear: "2020", // 项目开始时间，只填写年份
    lastUpdated: "最后更新时间", // string | boolean
    author: "Tsanfer",
    authorAvatar: "/avatar.svg", //作者头像
    // mode: "light", //默认显示白天模式
    mode: "auto", //默认显示白天模式
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
    ["flowchart"], // 支持流程图
    ["@vuepress/nprogress"], // 加载进度条
    ["reading-progress"], // 阅读进度条
    ["vuepress-plugin-code-copy", true], //一键复制代码插件
  ],
};
