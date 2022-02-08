---
title: Windows 重装系统，配置 WSL，美化终端，部署 WebDAV 服务器，并备份系统分区
date: 2022-01-09
sidebar: "auto"
categories:
  - 计算机
tags:
  - 系统配置
  - WSL
  - 终端
  - WebDAV
  - 硬盘管理
  - DiskGenius
  - 系统备份
  - Docker
---

> [最新博客文章链接](https://tsanfer.com/views/Computer/Windows_WSL_terminal_WebDAV_PartitionBackup.html)

***

最近发现我 Windows11 上的 WSL 打不开了，一直提示我虚拟化功能没有打开，但我看了下配置，发现虚拟化功能其实是开着的。然后试了各种方法，重装了好几次系统，我一个软件一个软件的试，最后发现是 Spacedesk 与 WSL2 不兼容，只要不装 Spacedesk 就行了。我也正好趁这个机会，配置了一些其他的东西，比如终端的美化，WebDAV 服务器的搭建，硬盘分区的备份等。

## 大体思路

先做个U盘启动盘来装 Windows 11 系统，然后配置一下系统和安装各种软件。之后用 Oh My Posh 来美化 PowerShell 和 Linux 终端。然后在局域网内的另一台 Windows 上部署两个 WebDAV 服务，其分别挂载在本地以及阿里云盘。最后再备份了一下系统分区，作用和一键还原备份差不多。

### 用到的东西

配置时最好参考官方的教程

- [Ventoy](https://www.ventoy.net/)：
  > 简单来说，Ventoy 是一个制作**可启动U盘**的开源工具。
  > 
  > 有了 Ventoy 你就无需反复地格式化U盘，你只需要把 ISO/WIM/IMG/VHD(x)/EFI 等类型的文件直接拷贝到U盘里面就可以启动了，无需其他操作。
  > 
  > 你可以一次性拷贝很多个不同类型的镜像文件，Ventoy 会在启动时显示一个菜单来供你进行选择。
  > 
  > 安装之后，同一个U盘可以同时支持 BIOS 和多种 UEFI 模式。
  > 
  > 支持大部分常见类型的操作系统
- [WSL](https://docs.microsoft.com/zh-cn/windows/wsl/)：（Windows Subsystem for Linux）
  > 适用于 **Linux 的 Windows 子系统**可让开发人员按原样运行 GNU/Linux 环境 - 包括大多数命令行工具、实用工具和应用程序 - 且不会产生传统虚拟机或双启动设置开销。
- [Oh My Posh](https://ohmyposh.dev/)：
  > Oh My Posh is a custom prompt engine for any shell that has the ability to adjust the prompt string with a function or variable.
  > 
  > Oh My Posh 是一个可**自定义终端提示符**的软件，它支持任何种类的命令行环境，并能通过函数或变量来配置提示符的字符显示
- [Cloudreve](https://github.com/cloudreve/Cloudreve)：
  > Cloudreve 可以让您快速搭建起公私兼备的**网盘**系统。Cloudreve 在底层支持不同的云存储平台，用户在实际使用时无须关心物理存储方式。你可以使用 Cloudreve 搭建个人用网盘、文件分享系统，亦或是针对大小团体的公有云系统
- [aliyundrive-webdav](https://github.com/messense/aliyundrive-webdav)：
  > **阿里云盘 WebDAV** 服务，主要使用场景为配合支持 WebDAV 协议的客户端 App 如 Infuse、nPlayer 等实现在电视上直接观看云盘视频内容， 支持上传文件，但受限于 WebDAV 协议不支持文件秒传。
- [DiskGenius](https://www.diskgenius.cn/)：
  > DiskGenius 是一款专业级的**数据恢复**软件；支持文件恢复、分区恢复；文件预览、扇区编辑、加密分区恢复、Ext4分区恢复、RAID恢复等高级功能
  > 
  > DiskGenius 是一款经典的**硬盘分区**工具 。创建分区、删除分区、格式化分区、隐藏分区、分配盘符等基本功能外，DiskGenius 还提供快速分区、无损调整分区大小，分区表备份恢复等更多高阶功能。支持GPT分区格式，支持EXT4文件系统。
  > 
  > DiskGenius 还是一款强大的**备份**软件，可以方便的备份或克隆硬盘或分区；支持增量备份及多点还原、热备份、系统备份等众多特性。

## 系统重装

> [Ventoy 官网](https://www.ventoy.net/)

先做个U盘启动盘出来重装系统，顺便在U盘里放个 PE 系统镜像，方便以后配置电脑。

### 制作 Ventoy U盘

安装U盘启动盘时，整个U盘会被格式化，有重要数据的话，记得提前保存

![https://cdn.tsanfer.com/image/202216194621.png](https://cdn.tsanfer.com/image/202216194621.png)

安装完成之后，可以把 Ventoy U盘当成一般的U盘来使用，不会影响U盘的引导。

### 配置 Ventoy 插件（ VentoyPlugson ）

Ventoy 支持许多的插件，这里我只配置了“指定搜索目录”，主要是为了加快镜像的搜索速度。当然你也可以不配置，一般搜索镜像的速度都是比较快的。

> 指定搜索ISO文件的根目录。默认Ventoy会搜索U盘上的所有目录和子目录，当你U盘上有海量的文件时，这个过程会很慢。
这种情况下你可以把ISO文件单独放在某个目录下，然后通过这个变量来指定搜索路径，此时Ventoy就只会搜索该目录及其子目录。

![https://cdn.tsanfer.com/image/202216195527.png](https://cdn.tsanfer.com/image/202216195527.png)

Ventoy 插件里面有一个数据持久化插件，如果想在 Linux LiveCD 中保存数据的话，可以试试这个插件。

### 下载系统镜像

> [微软官网 下载 Windows 11](https://www.microsoft.com/zh-cn/software-download/windows11)

> [kubuntu 官网](https://kubuntu.org/)

Windows 和 Linux 的镜像都可以，不过如果要在 Windows 11 上用 QQ 的话，要用简体中文版的镜像。我开始用的英文版镜像，QQ 就一直说我文件损坏，后来改用简体中文版后才正常。

下完了镜像后，就直接把镜像文件复制到U盘里（任意位置都行），当然也可以在U盘里放一些软件安装包，方便装完系统后安装。

### 制作 PE 镜像

> [微PE 官网](https://www.wepe.com.cn/)

这里我做了个 PE 的镜像文件，放到U盘里，方便以后电脑有什么问题时，可以用U盘进 PE 系统解决。比如，可以用 PE 来修复系统引导，或者恢复系统盘数据等。

![https://cdn.tsanfer.com/image/202216215043.png](https://cdn.tsanfer.com/image/202216215043.png)

做好 PE 的 ISO 镜像后，和系统镜像一样，放到U盘里就行。

### 安装系统

1. 插上U盘，重启电脑，进入 BIOS 选择U盘启动。
2. 然后选择要安装的镜像，电脑问你要系统激活码可以跳过，我选的是 Windows 11 的 Pro 工作站版，感觉这个版本的功能要全一点。
3. 然后就是选择要装到哪个地方，可以先删除之前的分区，然后选择整个硬盘或者某个未分配的区域，来安装系统。
4. 之后就是电脑开始从U盘安装系统了，在电脑读取完了U盘的数据之后，就可以拔掉U盘了，然后等它重启。
5. 之后进入了设置界面，按步骤走就好，唯一要注意的就是账号的登陆。我这选择的是离线登陆，如果你这里选的是在线账号登陆的话，系统用户名就会变成你登陆账号的前几位，以后进命令行也是这个名字。离线登陆的话，进入系统后显示的用户名则是自己输入的名字。

### 配置系统

进了系统就是配置各种 Windows 设置里面的东西了，比如改改任务栏软件图标或者删一些不用的软件，最重要的是记得更新系统。当然你也可以对硬盘进行分区，我一般用 [DiskGenius](https://www.diskgenius.cn/) 来进行硬盘操作。

我之后重定位了，文档、下载、音乐、图片、视频的文件夹位置，这样就不用以后一个一个更改浏览器或者下载软件里的下载位置了

![https://cdn.tsanfer.com/image/202216222023.png](https://cdn.tsanfer.com/image/202216222023.png)

### 安装软件

然后就是安装软件了，比如 7z，运行库，Clash（代理软件），Docker 等。有些软件可能需要我们进 Windows 商店里面下载（比如，Ubuntu），我发现如果要进商店的话，要先把 Clash 代理关了，不然进不去。

要想添加开机自启程序的话，可以在文件浏览器的地址栏中输入 `startup` ，会自动跳转到开机自启文件夹，我的位置是 `C:\Users\Admin\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`

这里要特别注意某些软件可能和 WSL2 不兼容，比如 Spacedesk。如果想要用 WSL2 的话，就不要装 Spacedesk（我现在目前 Spacedesk 的最新版为 Beta RC v1.0.29）

### 安装 WSL

> [旧版 WSL 的手动安装步骤](https://docs.microsoft.com/zh-cn/windows/wsl/install-manual)

这里我是通过安装 docker 来安装 WSL 的， 不过 docker 安装的是 WSL1，在安装时 docker 会提示你需要升级到 WSL2，官方有教程。

以管理员身份打开 PowerShell 并运行：

1. 启用适用于 Linux 的 Windows 子系统：
   
    `dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart`
2. 启用虚拟机功能：
   
    `dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart`
3. 安装 [WSL2 Linux 内核更新包](https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi)
4. 将 WSL 2 设置为默认版本： `wsl --set-default-version 2`
5. 安装所选的 [Linux 分发](https://aka.ms/wslstore)，我这选的是 Ubuntu，安装好后打开，设置一下用户名和密码，就可以正常使用 WSL 了。

## 配置终端

> [Oh My Posh 官网](https://ohmyposh.dev/)

这里我用的终端是系统自带的 Windows Terminal，然后通过 Oh My Posh 来配置终端，主要是因为它同时支持 Windows 和 Linux。

先装一个 [Nerd Font 字体](https://github.com/ryanoasis/) 防止装完 Oh My Posh 后出现乱码，我装的是 [Hack Nerd Font](https://github.com/ryanoasis/nerd-fonts/blob/master/patched-fonts/Hack/Regular/complete/Hack%20Regular%20Nerd%20Font%20Complete%20Mono%20Windows%20Compatible.ttf)，然后记得更改一下 Windows Terminal 的默认字体就行了。

### Windows 终端配置

> [Oh My Posh | Installation | Windwos](https://ohmyposh.dev/docs/windows)

1. 安装 Oh My Posh ：`winget install JanDeDobbeleer.OhMyPosh`
2. 替换现有提示符，先用 `$PROFILE` 找到 PowerShell 启动时的脚本（没有就在对应位置新建一个同名文件）。比如我的：
   ```powershell
   PS C:\Users\Admin> $PROFILE
   D:\Document\PowerShell\Microsoft.PowerShell_profile.ps1
   ```
3. 在 `Microsoft.PowerShell_profile.ps1` 脚本文件中添加一行命令 ：
   
    `oh-my-posh --init --shell pwsh --config ~/jandedobbeleer.omp.json | Invoke-Expression`
   
    之后重启终端，就能看见新的提示符了。
   
    ![https://cdn.tsanfer.com/image/202216230801.png](https://cdn.tsanfer.com/image/202216230801.png)
4. 不过我这里自己更换了另一个更喜欢的主题 [craver](https://ohmyposh.dev/docs/themes#craver)，如果你不换主题的话，这一步就不用看了。我把刚刚那个 `Microsoft.PowerShell_profile.ps1` 脚本里的 `~/jandedobbeleer.omp.json` 更改为了 `~\AppData\Local\Programs\oh-my-posh\themes\craver.omp.json` ，然后再重启终端就行了。或者直接下载网上 json 文件并配置。
   
    ![https://cdn.tsanfer.com/image/202216234006.png](https://cdn.tsanfer.com/image/202216234006.png)

### WSL 终端配置

> [Oh My Zsh 官方安装教程](https://github.com/ohmyzsh/ohmyzsh/wiki)

WSL 的配置大体和 PowerShell 一样，不过我是在 oh-my-zsh 的基础上配置的，主要是为了加强终端的功能，这里我用的是 Ubuntu。

1. 先更新一下 Ubuntu 系统： `sudo apt update -y && sudo apt upgrade -y`
2. 安装 zsh, git, vim, unzip： `sudo apt install zsh git vim unzip -y`
3. 设置 zsh 为默认 shell: `chsh -s $(which zsh)` (或 chsh -s zsh)
4. 设置 WSL2 代理，后面从 Github 下载文件时可能会有 HTTP 的 443 错误，需要我们使用代理，这里我用的是 Clash，端口号默认为 7890。如果不使用代理的话，从 Github 上下载文件可能会很慢。
   
    在 `~/.zshrc` 文件最后添加如下脚本代码，以后每次 zsh 启动时都会执行下面的代码，可以用刚刚安装的 Vim 打开`~/.zshrc` 并添加代码。
   ```sh
   export hostip=$(cat /etc/resolv.conf |grep -oP '(?<=nameserver\ ).*')
   export https_proxy="http://${hostip}:7890"
   export http_proxy="http://${hostip}:7890"
   ```
5. 安装 oh-my-zsh:  
   
    `sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"`
6. 配置 oh-my-zsh 插件，比如：
   
    安装 zsh-autosuggestions （可以自动提示以前输过的命令）：
   
    `git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions`
   
    安装 zsh-syntax-highlighting（可以使命令行的命令高亮）：
   
    `git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting`
   
    然后在 `~/.zshrc` 文件已有的 plugins 的字段中添加插件名称，例如
   ```
   plugins=(
       git
       zsh-autosuggestions
       zsh-syntax-highlighting
   )
   ```
7. 同样的安装 Oh My Posh，就直接跟着官网的教程走就行。
   > [Oh My Posh | Installation | Linux](https://ohmyposh.dev/docs/linux)
   
    下载 oh my posh：
   ```sh
   sudo wget https://github.com/JanDeDobbeleer/oh-my-posh/releases/latest/download/posh-linux-amd64 -O /usr/local/bin/oh-my-posh
   sudo chmod +x /usr/local/bin/oh-my-posh
   ```
   
    下载主题：
   ```sh
   mkdir ~/.poshthemes
   wget https://github.com/JanDeDobbeleer/oh-my-posh/releases/latest/download/themes.zip -O ~/.poshthemes/themes.zip
   unzip ~/.poshthemes/themes.zip -d ~/.poshthemes
   chmod u+rw ~/.poshthemes/*.json
   rm ~/.poshthemes/themes.zip
   ```
8. 替换现有提示符，在 `~/.zshrc` 最后添加下面的代码：
   
    `eval "$(oh-my-posh --init --shell zsh --config ~/jandedobbeleer.omp.json)"`
   
    当然也可以把`jandedobbeleer` 改成其他喜欢的主题，比如我改成了：
   
    `eval "$(oh-my-posh --init --shell zsh --config ~/.poshthemes/craver.omp.json)"`
   
    然后重启终端就行了
   
    ![https://cdn.tsanfer.com/image/202217163854.png](https://cdn.tsanfer.com/image/202217163854.png)

## 部署局域网 WebDAV 服务器

我用局域网内的另外一台 Windows 来做下载器，在其上安装了 [Cloudreve](https://github.com/cloudreve/Cloudreve) 以及 [aliyundrive-webdav](https://github.com/messense/aliyundrive-webdav) 来实现 Webdav，操作则用 Windows 自带的远程桌面来控制。cloudreve 主要是用来在两台 Windows 之间传输文件的，aliyundrive-webdav 则是部署阿里云盘的 webdav 服务。webdav 的客户端的话，我则是用的是 [Raidrive](https://www.raidrive.com/)

### 配置 Windows 远程桌面

> [微软官方配置远程桌面教程](https://support.microsoft.com/zh-cn/windows/%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8%E8%BF%9C%E7%A8%8B%E6%A1%8C%E9%9D%A2-5fe128d5-8fb1-7a23-3b8a-41e636865e8c#ID0EDD=Windows_11)

先在被控制的电脑上打开远程控制，然后找到其的 IP 地址。比如我用 `ipconfig` 找到本地的 IPv4 地址为 `192.168.1.7` 。当然，你也可以不用远程控制，直接在另一台 Windows 电脑面前操作。

![https://cdn.tsanfer.com/image/202217174614.png](https://cdn.tsanfer.com/image/202217174614.png)

这里最好配置一下路由器的 DHCP ，为其静态分配一个固定的 IP 地址，以后连的时候就不用再看地址了。然后在控制端打开远程桌面连接，输入被控制电脑的 IP 地址，连上就行了。

![https://cdn.tsanfer.com/image/202217180038.png](https://cdn.tsanfer.com/image/202217180038.png)

### 配置 Cloudreve

>  [Cloudreve Github 地址](https://github.com/cloudreve/Cloudreve)

在被控制的电脑中打开 `cloudreve.exe` 即可，第一次启动时会提示一次用户名和密码，以后启动时就没有提示了，所以要注意保存。

![https://cdn.tsanfer.com/image/202217173410.png](https://cdn.tsanfer.com/image/202217173410.png)

然后在浏览器打开 `localhost:5212` 就能看见 Cloudreve 的前端网页了，之后添加一个 WebDAV 账号，它默认使用的是本地（被控制设备）存储，这样就能在两台电脑之间传输文件了。其实远程桌面连接，支持直接复制粘贴文件，不过每次都要打开远程桌面手动复制粘贴，有点麻烦。

Cloudreve 默认每个用户的容量为 1G，可以进 cloudreve 的后台更改用户组的容量设置。

![https://cdn.tsanfer.com/image/202217221623.png](https://cdn.tsanfer.com/image/202217221623.png)

之后就是在主控制端的 Windows 上装 Webdav 客户端了，我用的是 [Raidrive](https://www.raidrive.com/) 因为其可以挂载 One Drive 和 Google Drive 等的其他存储方式，而且配置功能也比较丰富。下面是刚刚配置的 Cloudreve 的 raidrive 配置，比如，端口 `5212`，路径默认`/dav` ，用户名默认 `admin@cloudreve.org` ，密码则是刚刚创建的 Webdav 新账号的密码

![https://cdn.tsanfer.com/image/202217181916.png](https://cdn.tsanfer.com/image/202217181916.png)

### 配置 aliyundrive-webdav

> [aliyundrive-webdav Github 地址](https://github.com/messense/aliyundrive-webdav)

我把阿里云盘的 webdav 服务放在了被控制的 windows 上一直开着，比较方便，而且局域网内的其他设备也可以用。下面跟着 Github 上的说明走就行，我是用 docker 部署的服务：

`docker run -d --name=aliyundrive-webdav --restart=unless-stopped -p 8080:8080 -v /etc/aliyundrive-webdav/:/etc/aliyundrive-webdav/ -e REFRESH_TOKEN='your refresh token' -e WEBDAV_AUTH_USER=admin -e WEBDAV_AUTH_PASSWORD=admin messense/aliyundrive-webdav`

等同于在 Powershell 中的

```powershell
docker run -d --name=aliyundrive-webdav --restart=unless-stopped -p 8080:8080 `
  -v /etc/aliyundrive-webdav/:/etc/aliyundrive-webdav/ `
  -e REFRESH_TOKEN='your refresh token' `
  -e WEBDAV_AUTH_USER=admin `
  -e WEBDAV_AUTH_PASSWORD=admin `
  messense/aliyundrive-webdav
```

- `-v` ：绑定的卷，这里的这个卷主要是用来存放阿里云盘的 refresh_token。
  
    前面的那个`/etc/aliyundrive-webdav/` 是 windows 里的地址（我随便改了个 `~/` 地址）
  
    后面的那个`/etc/aliyundrive-webdav/` 是 docker 容器里的地址
- `-e` ：环境变量
  
    `REFRESH_TOKEN` ：阿里云盘 refresh_token （获得方法的话，作者在 Github 上有说）
  
    `WEBDAV_AUTH_USER` ：想要设置的 WebDAV 服务的用户名（我直接默认的）
  
    `WEBDAV_AUTH_PASSWORD` ：想要设置的 WebDAV 服务的密码（我直接默认的）

![https://cdn.tsanfer.com/image/202217235135.png](https://cdn.tsanfer.com/image/202217235135.png)

被控制的 Windows 上的 docker 运行正常后，就可以在主控制端配置 webdav 了，我顺便还连上了 OneDrive 和 Google Drive

![https://cdn.tsanfer.com/image/202218154455.png](https://cdn.tsanfer.com/image/202218154455.png)

## 备份分区/磁盘

> [DiskGenius 官网](https://www.diskgenius.cn/)

这次配置系统，不知道出了多少的问题（主要是因为 Spacedesk 和 WSL2 不兼容的问题），还把机械硬盘弄成了动态卷，然后又一不小心把机械硬盘的分区弄坏了。后来用 DiskGenius 重建分区表都只恢复了部分分区，感觉以后随时都要注意备份分区和硬盘了。我前面弄的那个阿里云盘 webdav 主要也是为了方便保存一些数据和系统备份镜像，以免本地电脑出问题后花时间来重新配置系统。

这里备份的时候，有两种主要的方式：备份与克隆

备份只是生成一个镜像文件，不会覆盖其他分区的数据，而且镜像文件移动起来也比较方便。如果还嫌麻烦的话，就直接用各种一键还原的软件，还能自动的帮你装启动项和做U盘启动盘，貌似 DiskGenius 官方就有一个叫[易数一键还原](https://www.onekeyrestore.cn/)的工具。

克隆则是直接把一个分区（或硬盘）的所有数据复制到另一个分区（或硬盘），而且会覆盖掉另一个分区原有的数据。所以我个人认为，分区备份要方便一点，当然如果要进行系统迁移的话，还是最好用克隆硬盘的方式。

![https://cdn.tsanfer.com/image/202218172311.png](https://cdn.tsanfer.com/image/202218172311.png)

这以后如果在云端能做的事情，我就尽量在线上操作算了，这样就不用注意本地备份的问题了。

***

> 本文由 [Tsanfer's Blog](https://tsanfer.com/) 发布！
