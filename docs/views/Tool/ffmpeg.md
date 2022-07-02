---
title: 音视频编解码工具 FFmpeg 的使用
date: 2021-01-21
categories:
  - 工具
tags:
  - 多媒体
  - 转码
---
<!-- 文件位置：docs/views/Tool/ffmpeg.md -->

::: tip
![FFmpeg_Logo_new](https://cdn.tsanfer.com/image/FFmpeg_Logo_new.svg)
:::

<!-- more -->

## 工具简介

> FFmpeg is the leading multimedia framework, able to **decode**, **encode**, **transcode**, **mux**, **demux**, **stream**, **filter** and **play** pretty much anything that humans and machines have created. It supports the most obscure ancient formats up to the cutting edge. No matter if they were designed by some standards committee, the community or a corporation. It is also highly portable: FFmpeg compiles, runs, and passes our testing infrastructure [FATE](http://fate.ffmpeg.org) across Linux, Mac OS X, Microsoft Windows, the BSDs, Solaris, etc. under a wide variety of build environments, machine architectures, and configurations.
>
> [_About FFmpeg_](https://www.ffmpeg.org/about.html)

> **FFmpeg** 是一个[开放源代码](https://zh.wikipedia.org/wiki/開放原始碼)的[自由软件](https://zh.wikipedia.org/wiki/自由軟體)，可以运行音频和视频多种格式的录影、转换、流功能[[1\]](https://zh.wikipedia.org/wiki/FFmpeg#cite_note-1)，包含了 libavcodec——这是一个用于多个项目中音频和视频的解码器库，以及 libavformat——一个音频与视频格式转换库。
>
> —— [维基百科词条：FFmpeg](https://zh.wikipedia.org/wiki/FFmpeg)

### 常用命令

```powershell
# 命令

# 合并
FFmpeg -f concat -safe 0 -i list.txt -c copy concat.mp4
-f fmt # force
-i url # input
-c # codec (copy (output only) to indicate that the stream is not to be re-encoded.)

# 剪切
ffmpeg -ss 00:01:30 -t 00:00:20 -i input.mp4 -c copy output.mp4
# 等价于
# ffmpeg -ss 00:01:30 -t 00:01:50 -i input.mp4 -c copy output.mp4
-ss position # seeks
-t duration # time
-to position # to


# 压缩
ffmpeg -i input.mp4 -vf scale=-1:1080 -b:v 6000k -c:v libx265 -c:a copy output_1080.mp4
-vf # -filter:v
-b # bitrate
-c:v # -codec:v
-c:a # -codec:a

# 提取音频
ffmpeg -i input.mp4 -vn -c:a copy output.m4a
# 合并音视频，并替换原视频的音频
ffmpeg -i video.mp4 -i audio.m4a -c copy -strict experimental -map 0:v:0 -map 1:a:0 output.mp4

# 转换格式
ffmpeg -i input.avi -c copy output_1080.mp4
# 转换格式（兼容）
ffmpeg -i input.avi -c:v h264 -c:a aac output_1080.mp4

# 外挂字幕转内嵌
# （字幕文件需为 UTF-8 格式）
ffmpeg -i input.mp4 -vf "subtitles=subtitle.srt" output.mp4 # srt格式字幕
ffmpeg -i input.mp4 -vf "ass=subtitle.ass" output.mp4 # ass格式字幕

ffmpeg -i subtitle.srt subtitle.ass # srt字幕转ass字幕
```

> 本文由[Tsanfer's Blog](https://tsanfer.com) 发布！
