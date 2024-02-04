---
title: 升腾C92 刷 OpenWrt 作旁路由设置 DNS 服务、扩容分区、设置 swap
date: 2024-02-04
sidebar: "auto"
categories:
  - 计算机
tags:
  - 系统配置
  - OpenWrt
  - DNS
  - Swap
  - BIOS
  - DHCP
---

> [最新博客文章链接](https://tsanfer.com/views/Computer/C92_Openwrt_DNS_Swap.html)
> 

---

*文字更新时间：2024/02/04*

一直知道 OpenWrt 经常拿来做软路由软件。最近买了个二手小主机升腾 C92 来做旁路由服务器，其被归为瘦客户机一类，感觉和工控机差不多，现价百元以内。想就着这个机会，了解体验一下 OpenWrt。

## 大体思路

下载预设置好的固件，制作U盘启动盘，设置好升腾 C92 的 BIOS，刷入 OpenWrt 固件。为了方便局域网设备互联，主路由配置好 IP-MAC 绑定和 DHCP，然后旁路由 OpenWrt 配置 DNS 服务器。最后，扩容 OpenWrt 系统分区，设置 swap 交换分区。

### 用到的东西

> [OpenWrt](https://openwrt.org/):
> 
> 
> OpenWrt是适用于嵌入式设备的一个Linux发行版。
> 
> 相对原厂固件而言，OpenWrt不是一个单一、静态的固件，而是提供了一个可添加软件包的可写的文件系统。这使用户可以自由的选择应用程序和配置，而不必受设备提供商的限制，并且可以使用一些适合某方面应用的软件包来定制你的设备。对于开发者来说，OpenWrt是一个框架，开发者不必麻烦地构建整个固件就能得到想要的应用程序；对于用户来说，这意味着完全定制的能力，与以往不同的方式使用设备，OPKG包含超过3500个软件。 默认使用LuCI作为web交互界面。
> 

| 项目 | 参数 |
| --- | --- |
| 旁路由 | 升腾 C92 |
| OpenWrt 类型 | haiibo/OpenWrt |
| OpenWrt 固件版本 | R24.01.27 |
| CPU 型号 | Intel(R) Celeron(R) CPU J1800 |
| CPU 频率 | 2.41GHz |
| CPU 线程数 | 2C2T |
| CPU 工艺 | 22纳米 |
| CPU TDP | 10 W |
| 内存 | 2G DDR3L 1333MHz |
| 硬盘 | Centerm SSD 14.75GB |
| 网卡 | Intel I211 Gigabit Network Connection |
| 主路由 | 移动 X333 定制路由器 |

原版 OpenWrt 不大好用，很多功能都没有预装，要手动配置比较麻烦。于是选择了提前配置好的 OpenWrt 版本，我用的是 [haiibo/OpenWrt](https://github.com/haiibo/OpenWrt)，里面集成了 LuCI 面板、Docker 和各种常用插件

### 局域网系统拓扑图

![局域网系统拓扑图](https://cdn.tsanfer.com/image/2024-2-4_18-43-07.png)
局域网系统拓扑图

---

## U盘准备

### 制作 Ventoy U盘

[Ventoy 使用手册](https://www.ventoy.net/cn/doc_start.html)

Ventoy 版本：1.0.97

1. 制作 Ventoy 启动盘：
    
    打开 `Ventoy2Disk.exe` ，设置分区类型为 `GPT` 格式（为了让升腾C92能进行 UEFI 引导）,找到需要格式化的U盘（注意保存数据），其他默认，安装即可
    
2. 加速镜像搜索过程：
    
    在U盘根目录下创建 `Images` 文件夹，需要将镜像文件复制到此文件夹下。
    
    打开 `VentoyPlugson.exe` ，启动服务，在打开的网页中选择 **全局控制插件** → **VTOY_DEFAULT_SEARCH_ROOT —— 指定搜索目录** 设置为 Images 的绝对路径（比如：`H:\Images`）
    

### 下载处理 OpenWrt 镜像

[镜像 GitHub 仓库](https://github.com/haiibo/OpenWrt/)

- 方式一（简单）：使用预先构建好的固件：
    
    OpenWrt 仓库 release 版本：R2024-01-27 06:51:01 for X86_64
    
    1. 下载 OpenWrt 镜像
        
        因为硬件就是一个 x86 的小电脑，所以下载 [x86 版本的 OpenWrt 镜像](https://github.com/haiibo/OpenWrt/releases/tag/X86_64)，我使用的是 `openwrt-x86-64-generic-squashfs-combined-efi.img.gz` 类型的镜像（squashfs 是一种用于 Linux 的压缩的只读文件系统，可以还原系统）
        
    2. 解压镜像压缩包
        
        下载的是镜像的压缩文件，需要解压，实测 7z 解压不了，用 [Gzip](https://gnuwin32.sourceforge.net/packages/gzip.htm) 和 [WinRAR](https://www.win-rar.com/download.html) 可以解压，比如：使用 gzip 解压：
        
        ```powershell
        .\gzip\bin\gzip.exe -dkv .\openwrt-x86-64-generic-squashfs-combined-efi.img.gz
        ```
        
        等待片刻后，解压得到 .img 后缀的镜像文件
        
- 方式二（自定义）：自定义构建固件：
    
    [定制固件步骤](https://github.com/haiibo/OpenWrt#%E5%AE%9A%E5%88%B6%E5%9B%BA%E4%BB%B6-)
    
    可以删除一些不用的软件。分区格式可以改为 ext4，方便在装机时，在 PE 系统内进行分区扩容。
    

### 制作微PE镜像

[微PE 官网](https://www.wepe.com.cn/)

微PE 版本：2.3

打开微PE，生成可启动 ISO 镜像，放入U盘 Images 文件夹

### 下载硬盘烧录工具

[physdiskwrite 官网](https://m0n0.ch/wall/physdiskwrite.php)

physdiskwrite 版本：0.5.3

用于烧录系统镜像，放入U盘根目录方便实用

### U盘文件结构

```
.
├── Images # 镜像文件夹
│   ├── WePE_64_V2.3.iso # 微PE镜像
│   └── openwrt-x86-64-generic-squashfs-combined-efi.img # OpenWrt镜像
├── VentoyPlugson.log # Ventoy插件记录
├── physdiskwrite.exe # 镜像烧录工具
└── ventoy # Ventoy配置文件目录
    ├── ventoy.json # Ventoy配置文件
    └── ventoy_backup.json # Ventoy配置文件备份
```

---

## 安装 OpenWrt

### 主板 BIOS 设置

我手中的升腾 C92 可以使用 USB 引导，省去了刷 BIOS 的步骤：

升腾 C92 进入 BIOS 的方法是开机按 `F2` 键（按 `F12` 可选择启动设备）

1. 设置设备引导方式
    
    在 BIOS 的 **Advanced** → **CSM Configuration** 中，将 **Boot option filter** 和 **Video** 都设置为 `Legacy only` ，将 **Storage** 设置为 `UEFI only` （如果觉得 Ventoy 镜像选项界面显示异常，看着不舒服的话，可设置为 Legacy only 解决）
    
    ![BIOS 内设备引导方式](https://cdn.tsanfer.com/image/2024-2-3_16-06-57.png)
    BIOS 内设备引导方式
    
2. 设置 BIOS 设备启动优先级
    
    在 BIOS 的 **Boot** → **Boot Option Priorities** 中，将U盘设置为第一启动设备，将硬盘设置为第二启动设备
    
3. 按 `F10` 保存并退出 BIOS

### 安装 OpenWrt 镜像到硬盘

1. 设置好 BIOS，开机进入 Ventoy 后选择从 WePE 启动 PE 系统
2. 用硬盘分区工具删除硬盘的所有分区
3. 烧录镜像：
    
    打开命令行，使用 physdiskwrite 烧录 OpenWrt 镜像到硬盘，比如：
    
    ```
    U:\physdiskwrite.exe -u U:\Images\openwrt-x86-64-generic-squashfs-combined-efi.img
    ```
    
    输入数字选择要烧录到的设备（我这里选择的是 `0` ，烧录到硬盘）
    
4. 关机拔下U盘后再开机

---

## 初始化配置 OpenWrt

### 设置 root 密码

```bash
passwd
```

### 设置 OpenWrt IP 地址

设置 OpenWrt 的 IP 地址为 DHCP 动态分配：

```bash
vim /etc/config/network
```

将其中的 `lan` 相关选项改为 `dhcp` 模式，比如：

```
config interface 'lan'
        option type 'bridge'
        option ifname 'eth0'
        option proto 'dhcp'
        option ip6assign '60'
```

重启网络：

```bash
/etc/init.d/network restart
```

或者通过网页面板在 **网络** → **接口** 中选择 **LAN** → **修改** 选择 **一般配置** → **基本设置** → **协议** 设置为 `DHCP客户端`。

然后在路由器中设置好 DHCP 服务，让升腾 C92 能分配到固定的 IP，之后即可通过 IP 地址访问 OpemWrt

---

## 主路由配置

各个路由器厂商，不同的路由器型号，其的后台配置大同小异。此处以我手头上的移动 X333 定制路由器为例，其后台地址、用户名和密码都贴在路由器外壳上。输入后台地址，进入 **高级设置界面**。

### IP-MAC 绑定

**网络服务功能** → **MAC-Based 指定**

### DHCP 服务器配置

1. 先设置路由器自身的 IP 地址：**局域网** → **IP地址**（比如：`192.168.0.1`）
2. 后设置 DHCP 服：**网络服务功能** → **DHCP 设置**
    - IP池范围：旁路由的IP只能在这个范围内设置（比如：`192.168.0.2` - `192.168.0.254`）（有些路由器可在范围外设置）
    - 网关地址：路由器本身 IP（比如：`192.168.0.1`）
    - DNS 选项：手动设置 OpenWrt 的 IP 为首选，其他公共 DNS 为次选（比如：首选 `192.168.0.2`，次选 `223.5.5.5`）
    
    （因为我的手机 MIUI 的传统艺能，不支持 IPv6，所以只好关闭主路由器的 `IPv6` 功能）
    

![主路由器 DHCP 设置](https://cdn.tsanfer.com/image/2024-2-3_17-17-19.png)
主路由器 DHCP 设置

---

## LuCI 面板设置 OpenWrt

在同一局域网内其他设备上，浏览器输入 OpenWrt 的 IP 地址，进入 LuCI 面板，以 GUI 的方式继续设置 OpenWrt

### DNS 服务器配置

比如：要解析 `server.mydns` 到 `192.168.0.2`

1. 添加 DNS 顶级域名：
    
    在 **网络** → **DHCP/DNS** 中的 **服务器设置** → **基本设置** 中添加 **本地服务器** 和 **本地域名** （比如：本地服务器填 `/mydns/` ，本地域名填 `mydns` ）
    
2. 添加主机名：
    
    在 **网络** → **主机名** 中进行添加主机名（比如：主机名填 `server` ，IP地址填 `192.168.0.2` ）（系统会自动添加自定义挟持域名）
    

### 磁盘扩容设置 swap 分区

此步骤用于 squashfs 格式的分区扩容（使用 overlay），ext4格式的分区扩容可在装机时手动设置。

1. 扩展分区
    - 方式一：使用[官方分区扩展脚本](https://openwrt.org/docs/guide-user/advanced/expand_root)（扩展根目录），也许需要先手动新建分区。
        
        ```bash
        wget -U "" -O expand-root.sh "https://openwrt.org/_export/code/docs/guide-user/advanced/expand_root?codeblock=0"
        . ./expand-root.sh
        ```
        
    - 方式二：手动扩展分区（挂载到根目录下的 overlay 文件夹）
        
        使用新的分区替代原有 `/overlay` 的挂载点：
        
        这里扩展10G的空间到 /overlay，然后将剩余的磁盘空间都用作 swap 分区。
        
        1. 新建 ext4 分区
            
            打开 **系统** → **磁盘管理** 找到需要进行操作的磁盘，点击 **修改** 后在空闲空间处新建一个10G的新分区，在 **终止扇区** 处填写 `+10g`，然后再 **格式化** 为 `ext4` 格式（系统会自动挂载新的分区）
            
        2. 复制原有 /overlay 内的数据到新分区中：比如：
            
            ```bash
            cp -r /overlay/* /mnt/sda3
            ```
            
        
        打开 **系统** → **挂载点**，添加挂载点，让新的分区（比如：`/dev/sda3`）挂载到 `/overlay` 然后重启生效，需要注意设置 docker, istore, opkg 等软件的根路径，以及下载文件的路径。让扩展到 /overlay 下的分区得到使用。
        
    
    如果没问题，打开软件包界面，可以发现空闲空间变大了
    
2. 新建 swap 分区
    
    操作与新建 ext4 分区类似，终止扇区默认到磁盘尾部，格式选择 `swap`。然后在 **系统** → **挂载点** 处启用 **自动挂载未配置的 Swap 分区**
    
3. 重启

---

其实后面还有其他的一些功能配置，比如 Docker，下载软件，网盘文件软件等，不过我最后没有继续使用 OpetWrt，而是换成了 Ubuntu，其原因有二：

1. 本人水平有限，设置的 swap 功能无法触发（swap 分区使用的空间极少，接近0），导致内存使用率一高系统就会变的卡顿。
2. 安装 opkg 和 ipk安装包 之外的软件较麻烦，多需要手动进行编译和调试。

感觉相比于一般通用的 Linux 发行版来说，OpenWrt 适合在功能较固定的路由器上使用。因为可定制固件，所以适合在硬件受到限制的嵌入式设备上使用。

---

> 本文由 [Tsanfer's Blog](https://tsanfer.com/) 发布！
>