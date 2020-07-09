---
title: 设置嵌入式Linux开发板的NFS服务，开机自动挂载NFS服务
date: 2020-03-03
sidebar: "auto"
categories:
  - MCU
tags:
  - 嵌入式
---

## NFS 简介

---

网络文件系统 **(NFS,Network File System)** 是一种将远程主机上的分区（目录）经网络挂载到本地系统的一种机制，通过对网络文件系统的支持，用户可以在本地系统上像操作本地分区一样来**远程操作**主机的共享分区（目录）

在嵌入式 Linux 的开发过程中，开发者需要在 Linux 服务器上进行所有的软件开发，**交叉编译**，可以通过建立 NFS，把 Linux 服务器上的特定分区共享到待调试的嵌入式目标系统上，就可以直接在嵌入式目标系统上操作 Linux 服务器，同时可以在线对程序进行**调试和修改**，大大的方便了软件的开发。因此，NFS 的是嵌入式 Linux 开发的一个重要的组成部分。

嵌入式 Linux 的 NFS 开发环境的实现包括**两个方面**：一是 Linux**服务器端**的 NFS 服务器支持；二是嵌入式目标系统的 NFS**客户端**的支持。因此，NFS 开发环境的建立需要配置 linux 服务器端和嵌入式目标系统端。

## 开发环境

---

|          |        开发主机        |                   开发板                   |
| :------: | :--------------------: | :----------------------------------------: |
| 发行版本 | Deepin GNU/Linux 15.11 | Freescale i.MX Release Distro 4.1.15-2.1.0 |
| 内核版本 |       4.15.0-30        |      4.1.15-2.1.0-00171-g7a6e9c2dea71      |

设置主机和开发板在同一网段(192.168.0.0/24),主机(192.168.0.1),开发板(192.168.0.2)

## 主机设置

---

### 设置主机静态 IP 地址

#### 添加有线连接

| 项目     | 值            |
| -------- | ------------- |
| IP       | 192.168.0.1   |
| 子网掩码 | 255.255.255.0 |

### 主机开启 NFS 服务

#### 安装 NFS 服务

```bash
sudo apt-get install nfs-kernel-server
```

#### 查看用户 ID

```bash
id
```

![id命令](https://img-blog.csdnimg.cn/20191130171307387.png)
**记录 UID 和 GID**

#### 配置 NFS 配置文件

**添加内容到`/etc/exports`文件末尾**

```bash
/home/tsanfer/share
192.168.0.0/24(rw,sync,all_squash,anonuid=1000,anongid=1000,no_subtree_check)
```

> - **/home/tsanfer/share：要共享的开发主机目录**
> - **192.168.0.0/24：配置谁可以访问，其中的/24 是掩码**
> - **rw: 表示客户机的权限，rw 表示可读写**
> - **sync：资料同步写入到内存与硬盘中。**
> - **anonuid=1000：将客户机上的用户映射成指定的本地用户 ID 的用户**
> - **anongid=998： 将客户机上的用户映射成属于指定的本地用户组 ID**
> - **no_subtree_check：不检查子目录权限，默认配置**

#### 创建共享目录`/home/tsanfer/share`

#### 更新 exports 配置

```bash
sudo exportfs -arv
```

> - **-a：全部 mount 或 umount 文件/etc/exports 中的内容。**
> - **-r：重新 mount 文件/etc/exports 中的共享内容。**
> - **-u：umount 目录。**
> - **-v：在 exportfs 的时候，将详细的信息输出到屏幕上。**

![更新 exports 配置](https://img-blog.csdnimg.cn/20191130172333936.png)

#### 查看 NFS 共享情况

```bash
showmount -e
```

![查看 NFS 共享情况](https://img-blog.csdnimg.cn/20191130172514648.png)

## 开发板设置

---

### 开发板设置静态 IP 地址

#### 临时设置静态 IP 地址

```bash
ifconfig eth0 192.168.0.2
```

#### 开机自动设置静态 IP 地址

**添加内容到`/etc/init.d/rc`文件末尾**

```bash
ifconfig eth0 192.168.0.2
```

重新启动后即可生效更改

#### 查看 IP 地址

```bash
ifconfig
```

![查看IP地址](https://img-blog.csdnimg.cn/20191130173029427.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzI3OTYxODQz,size_16,color_FFFFFF,t_70)

### 开发板挂载 NFS 服务

#### 创建挂载点目录

`/home/root/share`

#### 挂载 NFS 文件系统

#### 临时挂载

```bash
mount -o vers=4 192.168.0.1:/home/tsanfer/share /home/root/share
```

> - **-o vers=4：表示使用 NFS 文件系统第 4 版本**
> - **192.168.0.1：目标主机的 IP 地址**
> - **/home/tsanfer/share：远端的主机共享目录。**
> - **/home/root/share：本地挂载点，即要把远端共享的目录映射到本地(开发板)的哪个目录**

#### 开机自动挂载

**添加内容到`/etc/init.d/rc`文件末尾**

```bash
mount -o vers=4 192.168.0.1:/home/tsanfer/share /home/root/share
```

重新启动后即可生效更改

## 测试

- 开发板进行操作：

```bash
touch /home/root/share/test_file
```

开发板查看结果
![开发板查看结果](https://img-blog.csdnimg.cn/20191130194843584.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzI3OTYxODQz,size_16,color_FFFFFF,t_70)

- 主机查看结果：![主机查看结果](https://img-blog.csdnimg.cn/20191130195137821.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzI3OTYxODQz,size_16,color_FFFFFF,t_70)
