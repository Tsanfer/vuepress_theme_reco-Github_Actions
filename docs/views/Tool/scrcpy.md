---
title: scrcpy使用
date: 2021-01-21
categories:
  - 工具
tags:
  - 设备控制
---

::: tip
This application provides display and control of Android devices connected on USB (or over TCP/IP). It does not require any root access. It works on GNU/Linux, Windows and macOS.
:::

<!-- more -->

## 工具简介

> This application provides display and control of Android devices connected on USB (or [over TCP/IP](https://www.genymotion.com/blog/open-source-project-scrcpy-now-works-wirelessly/)). It does not require any _root_ access. It works on _GNU/Linux_, _Windows_ and _macOS_.
>
> [_Github README_](https://github.com/Genymobile/scrcpy#translations)

> 本应用程序可以显示并控制通过 USB (或 [TCP/IP](https://www.genymotion.com/blog/open-source-project-scrcpy-now-works-wirelessly/)) 连接的安卓设备，且不需要任何 _root_ 权限。本程序支持 _GNU/Linux_, _Windows_ 和 _macOS_。
>
> —— [scrcpy 中文说明文档](https://github.com/Genymobile/scrcpy/blob/master/README.zh-Hans.md)

### 常用命令

```powershell
.\scrcpy.exe -m 600 -b 100M --max-fps 60 --window-title 'Pixel XL'  --always-on-top -Sw -t --push-target /sdcard/Download/From_computer/

E:\Stand_alone\scrcpy\scrcpy.exe --max-fps 60 --window-title 'Pixel XL'  --always-on-top -Sw -t --push-target /sdcard/Download/From_computer/

--max-size -m # short version high
--bit-rate -b
--max-fps
--stay-awake -w
--turn-screen-off -S
--show-touches -t
```

### Shortcuts

| Action                                      | Shortcut                      | Shortcut (macOS)             |
| ------------------------------------------- | ----------------------------- | ---------------------------- |
| Switch fullscreen mode                      | `Ctrl`+`f`                    | `Cmd`+`f`                    |
| Rotate display left                         | `Ctrl`+`←` _(left)_           | `Cmd`+`←` _(left)_           |
| Rotate display right                        | `Ctrl`+`→` _(right)_          | `Cmd`+`→` _(right)_          |
| Resize window to 1:1 (pixel-perfect)        | `Ctrl`+`g`                    | `Cmd`+`g`                    |
| Resize window to remove black borders       | `Ctrl`+`x` \| _Double-click¹_ | `Cmd`+`x` \| _Double-click¹_ |
| Click on `HOME`                             | `Ctrl`+`h` \| _Middle-click_  | `Ctrl`+`h` \| _Middle-click_ |
| Click on `BACK`                             | `Ctrl`+`b` \| _Right-click²_  | `Cmd`+`b` \| _Right-click²_  |
| Click on `APP_SWITCH`                       | `Ctrl`+`s`                    | `Cmd`+`s`                    |
| Click on `MENU`                             | `Ctrl`+`m`                    | `Ctrl`+`m`                   |
| Click on `VOLUME_UP`                        | `Ctrl`+`↑` _(up)_             | `Cmd`+`↑` _(up)_             |
| Click on `VOLUME_DOWN`                      | `Ctrl`+`↓` _(down)_           | `Cmd`+`↓` _(down)_           |
| Click on `POWER`                            | `Ctrl`+`p`                    | `Cmd`+`p`                    |
| Power on                                    | _Right-click²_                | _Right-click²_               |
| Turn device screen off (keep mirroring)     | `Ctrl`+`o`                    | `Cmd`+`o`                    |
| Turn device screen on                       | `Ctrl`+`Shift`+`o`            | `Cmd`+`Shift`+`o`            |
| Rotate device screen                        | `Ctrl`+`r`                    | `Cmd`+`r`                    |
| Expand notification panel                   | `Ctrl`+`n`                    | `Cmd`+`n`                    |
| Collapse notification panel                 | `Ctrl`+`Shift`+`n`            | `Cmd`+`Shift`+`n`            |
| Copy device clipboard to computer           | `Ctrl`+`c`                    | `Cmd`+`c`                    |
| Copy computer clipboard to device and paste | `Ctrl`+`Shift`+`v`            | `Cmd`+`Shift`+`v`            |
| Enable/disable FPS counter (on stdout)      | `Ctrl`+`i`                    | `Cmd`+`i`                    |

_¹Double-click on black borders to remove them._
_²Right-click turns the screen on if it was off, presses BACK otherwise._

> [官方教程](https://github.com/Genymobile/scrcpy)

> 本文由[Tsanfer's Blog](https://tsanfer.xyz) 发布！
