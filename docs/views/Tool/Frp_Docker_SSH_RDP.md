---
title: 使用 Frp 和 Docker 通过远程桌面和 SSH 来远程控制 Windows（反向代理）
date: 2021-01-19
sidebar: "auto"
categories:
  - 工具
tags:
  - Frp
  - 反向代理
  - 内网穿透
  - Docker
publish: true
---

> [最新博客链接](https://tsanfer.com/views/frontEnd/Frp_Docker_SSH_RDP.html)

## 大体思路

使用 Docker 容器，在云服务器上部署 Frps 容器来中转流量，在被控制的 Windows 上部署 Frpc 容器来暴露内网的服务，在主控制端的 Windows 上直接运行 Frpc，来连接要访问的服务到本地。

||主控制端|中转服务器|被控制端|
|:--:|:--:|:--:|:--:|
|Frp 类型|Frpc|Frps|Frpc|
|SSH 端口|6000||22|
|远程桌面端口|3390||3389|
|转发 IP|127.0.0.1（本地 IP）||192.168.1.7（容器外部宿主，局域网 IP）|

### 用到的东西

- 反向代理
  > 反向代理在电脑网络中是代理服务器的一种。服务器根据客户端的请求，从其关系的一组或多组后端服务器（如Web服务器）上获取资源，然后再将这些资源返回给客户端，客户端只会得知反向代理的IP地址，而不知道在代理服务器后面的服务器集群的存在。
- [Frp](https://gofrp.org/)：
  > frp 采用 C/S 模式，将服务端部署在具有公网 IP 的机器上，客户端部署在内网或防火墙内的机器上，通过访问暴露在服务器上的端口，反向代理到处于内网的服务。 在此基础上，frp 支持 TCP, UDP, HTTP, HTTPS 等多种协议，提供了加密、压缩，身份认证，代理限速，负载均衡等众多能力。
  > 
  > ![](https://oss.tsanfer.com/image/2022119165912.png)

<br/>

## Frp 配置文件

主要是参考[官方教程](https://gofrp.org/)，根据需要增删内容

先是去[官方的 Github 仓库](https://github.com/fatedier/frp/releases)下载相应版本的 Frp 软件，然后解压

### 服务器端配置文件

记得在云服务器后台，放行相应的端口

```ini
# frps.ini

# 固定段落，用于配置通用参数
[common]
# 服务器监听端口
bind_port = 7000
bind_udp_port = 7000
token = 123456
# 服务器 dashboard
dashboard_port = 7500
dashboard_user = admin
dashboard_pwd = admin
# 每个客户端的连接数量上限
max_pool_count = 5
# kcp 绑定的是 udp 端口，可以和 bind_port 一样(kcp 可能会连接不上)
# kcp_bind_port = 7000
```

### 客户端（被控制端）配置文件

```ini
# frpc.ini（被控制端）

[common]
server_addr = x.x.x.x
server_port = 7000
token = 123456
# 客户端指定，预创建的连接数量
pool_count = 1
# server_port 指定为 frps 的 kcp_bind_port
# server_port = 7000
# 使用kcp协议（kcp 可能会连接不上）
# protocol = kcp
use_encryption = true
use_compression = true

# 代理名称（必须唯一）
[secure_ssh]
# 协议类型
# stcp 或 sudp 协议可以不在服务器暴露端口，
# 所以可以省略 remote_port 选项
type = stcp
# 安全角色(用于stcp、sudp)(只能填 server 或 visitor)
role = server
# 安全角色密钥
sk = abcdefg
# 指定远程登陆地址为，被控制主机的局域网 IP 地址
#（如果 frpc 没有部署在 docker 上则可使用 127.0.0.1）
local_ip = 192.168.1.7
local_port = 22

# 远程桌面 tcp 端口
[remote_tcp]
type = stcp
role = server
sk = abcdefg
local_ip = 192.168.1.7
local_port = 3389

# 远程桌面 udp 端口
[remote_udp]
type = sudp
role = server
sk = abcdefg
local_ip = 192.168.1.7
local_port = 3389
```

### 客户端（主控制端）配置文件

```ini
# frpc.ini(主控制的机器)

[common]
server_addr = x.x.x.x
server_port = 7000
token = 123456
# 本地绑定地址
bind_addr = 127.0.0.1
use_encryption = true
use_compression = true

[secure_ssh_visitor]
type = stcp
# 要访问的代理名称
server_name = secure_ssh
sk = abcdefg
role = visitor
# 本地绑定端口
bind_port = 6000

[remote_tcp_visitor]
type = stcp
server_name = remote_tcp
sk = abcdefg
role = visitor
bind_port = 3390

# UDP 连接可能会卡顿，估计是容易被运营商 QoS
# [remote_udp_visitor]
# type = sudp
# server_name = remote_udp
# sk = abcdefg
# role = visitor
# bind_port = 3390
```

<br/>

## 其他配置和部署连接

在配置时可以用 `docker logs frps` 或 `docker logs frpc` 来查看调试信息

![](https://cdn-oss.tsanfer.xyz/image/2022119192840.png)

### 被控制端本地 SSH 设置

[微软官方 |  通过 SSH 进行 PowerShell 远程处理](https://docs.microsoft.com/zh-cn/powershell/scripting/learn/remoting/ssh-remoting-in-powershell-core?view=powershell-7.2)

[微软官方 |  安装 OpenSSH](https://docs.microsoft.com/zh-cn/windows-server/administration/openssh/openssh_install_firstuse)

1. 先安装最新的 [PowerShell](https://www.microsoft.com/store/productId/9MZ1SNWT0N5D) ，可以直接去 Windows 商店里下载
2. 然后安装 OpenSSH，“设置”->“应用”->“应用和功能”->“可选功能”->“添加功能”，安装“OpenSSH 客户端”和“OpenSSH 服务器”
3. 将 SSH 默认 shell 改为 powershell.exe
   
   `New-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShell -Value "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -PropertyType String -Force` 
4. 我没有给电脑设置登录密码，所以要开启免密登陆
   
   把 `C:\ProgramData\ssh\sshd_config` 中的 `PermitEmptyPasswords` 选项，取消注释并设置为 `PermitEmptyPasswords yes` 
5. 最后再重启 sshd 服务 `Restart-Service sshd`

### 配置 Windows 远程桌面

[微软官方 | 如何使用远程桌面](https://support.microsoft.com/zh-cn/windows/%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8%E8%BF%9C%E7%A8%8B%E6%A1%8C%E9%9D%A2-5fe128d5-8fb1-7a23-3b8a-41e636865e8c)

在被控制的电脑上开启远程桌面，然后在主控制端连接

### 部署 Frp

在服务器端部署 frps 容器，服务器的配置文件我放在了 `~/frp/frps.ini` 。

`docker run --network host --restart=always -d -v ~/frp/frps.ini:/etc/frp/frps.ini --name frps snowdreamtech/frps` 

在客户端（被控制端）部署 frpc 容器，被控制端的配置文件我放在了 `C:\Stand_alone\frp\frpc.ini` 。

`docker run --network host --restart=always -d -v C:\Stand_alone\frp\frpc.ini:/etc/frp/frpc.ini --name frpc snowdreamtech/frpc` 

### 连接 Frp

在客户端（主控制端）运行 frpc，主控制端的配置文件我放在了 `C:\Stand_alone\frp\frpc.ini` 。

`C:\Stand_alone\frp\frpc.exe -c C:\Stand_alone\frp\frpc.ini` 

最后就可以直接访问 SSH（`localhost:6000`） 和远程桌面（`localhost:3389`）了

![](https://oss.tsanfer.com/image/2022119192306.png)

![](https://oss.tsanfer.com/image/2022119192519.png)

> 本文由[Tsanfer's Blog](https://tsanfer.com) 发布！