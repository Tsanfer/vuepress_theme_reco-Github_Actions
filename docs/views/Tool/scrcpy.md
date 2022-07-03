---
title: 手机控制工具 scrcpy 的使用
date: 2021-01-21
categories:
  - 工具
tags:
  - 设备控制
---

<!-- 文件位置：docs/views/Tool/scrcpy.md -->

::: tip
This application provides display and control of Android devices connected on USB (or over TCP/IP). It does not require any root access. It works on GNU/Linux, Windows and macOS.
:::

<!-- more -->

[Scrcpy 官方使用说明（最新）](https://github.com/Genymobile/scrcpy)

[Scrcpy 官方使用说明（简体中文）](https://github.com/Genymobile/scrcpy/blob/master/README.zh-Hans.md)

### 安装 scrcpy 和 adb

我是通过 Chocolatey 安装的，所以要先安装 Chocolatey

通过 Windows 自带的 PowerShell 安装 Chocolatey:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
```

安装 scrcpy 和 adb

```powershell
choco install scrcpy
choco install adb
```

### **本地调试** scrcpy

> [Scrcpy 官方使用说明（简体中文）](https://github.com/Genymobile/scrcpy/blob/master/README.zh-Hans.md)

配置其实官方写得很详细了，可以进行参考。

- **连接手机**

我一般用 Wifi 无线连手机，所以第一步是配置 scrcpy 的远程控制。

先把手机插在电脑上，然后查看一下，电脑连接的安卓设备

```powershell
adb devices
```

因为我电脑连了两个安卓设备，所以 adb 命令的结果是

```powershell
➜ adb devices
List of devices attached
33007175cd0362d9        device
39685b53        device # 要连接的手机
```

然后使用 scrcpy 自动配置手机的远程连接

```powershell
scrcpy --tcpip -s 39685b53
```

运行上面这条命令，电脑会自动完成相关远程连接的配置，并自动连接上手机，然后就可以把线拔了。只要电脑和手机不关机，之后就能随时远程连接手机。不过有时手机锁屏久了，会连不上，需要重新打开。还有就是解锁屏幕的时候也会断开，不过只要重新连接一下就好了。

- **连接选项**

> [Scrcpy 官方使用说明（简体中文）](https://github.com/Genymobile/scrcpy/blob/master/README.zh-Hans.md)

在运行 scrcpy 进行连接时，可以配置一些参数，来适应需求，这里是我常用的配置

`scrcpy --max-size=1080 --bit-rate=100M --max-fps 60 --turn-screen-off --stay-awake --show-touches --power-off-on-close --window-title="Android" --select-tcpip --push-target /sdcard/Download/From_computer/`

- `--max-size` : 屏幕最大的长或宽（保持显示比例）
- `--bit-rate` : 比特率
- `--max-fps` : 最大 FPS
- `--turn-screen-off` : 连接后关闭手机屏幕显示（不会关闭电脑中的手机屏幕）
- `--stay-awake` : 防止手机休眠
- `--show-touches` : 显示触摸
- `--power-off-on-close` : 退出 scrcpy 时关闭设备屏幕
- `--select-tcpip` : 选择连接远程设备
- `--window-title` : 电脑上的窗口标题
- `--push-target /sdcard/Download/From_computer/` : 手机接收电脑文件位置
- **scrcpy 操作快捷键**

> [官方快捷键说明](http://github.com/Genymobile/scrcpy/blob/master/README.zh-Hans.md#快捷键)

这里是我常用的快捷键

| 操作                                  | 快捷键          |
| ------------------------------------- | --------------- |
| 点击                                  | 鼠标左键        |
| 返回                                  | 鼠标右键        |
| HOME 键                               | 鼠标中键        |
| 左/右旋转屏幕                         | Alt+←/→         |
| 消除屏幕黑边                          | 双击黑边        |
| 音量加                                | Alt+↑           |
| 音量减                                | Alt+↓           |
| 打开屏幕                              | 鼠标右键        |
| 关闭设备物理屏幕 (但继续在电脑上显示) | Alt+o           |
| 打开设备物理屏幕                      | Alt+Shift+o     |
| 缩放内容                              | Ctrl+左键拖动   |
| 从电脑安装 APK 文件                   | 拖放 APK 文件   |
| 将文件推送至设备                      | 拖放非 APK 文件 |

> 本文由[Tsanfer's Blog](https://tsanfer.com) 发布！
