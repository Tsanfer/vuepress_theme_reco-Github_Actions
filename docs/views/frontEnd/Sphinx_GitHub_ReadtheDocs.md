---
title: 创建Sphinx + GitHub + ReadtheDocs托管文档
date: 2020-03-07
sidebar: "auto"
categories:
  - 前端
tags:
  - Github
  - 在线文档
---

::: tip
在本地配置好 Linux 环境（我用的 WSL），然后配置好 Sphinx 生成文档的样式，最后推送到 Github，并触发 Readthedocs 自动构建、生成在线文档
:::

<!-- more -->

🎵🎵🎵🎵🎼🎼🎼🎼🎧🎼🎼🎼🎼🎵🎵🎵🎵

<iframe
frameborder="no" border="0" marginwidth="0" marginheight="0" width=330 height=86
src="https://music.163.com/outchain/player?type=2&id=465675050&auto=0&height=66">
</iframe>

| [Sphinx](https://www.sphinx-doc.org/) |                                        [Github](https://github.com/)                                         |                               [Readthedocs](https://readthedocs.org/)                                |
| :-----------------------------------: | :----------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------: |
|                 <!--                  | [<img src="https://i.loli.net/2020/02/19/JP8td4QvCiY1L3g.png" width="300px" />](https://www.sphinx-doc.org/) | [<img src="https://i.loli.net/2020/02/19/j2Ad8meR5UF3O6P.png" width="300px" />](https://github.com/) | [<img src="https://i.loli.net/2020/02/19/oWvA34qxU9DQyYu.png" width="300px" />](https://readthedocs.org/) | --> |

## 最终效果

![最终效果](https://i.loli.net/2020/02/20/SmIoev5lCOQiXJw.png)

## Linux 配置

> Win10 Ubuntu 子系统路径：`%USERNAME%\AppData\Local\Packages\CanonicalGroupLimited.UbuntuonWindows_79rhkp1fndgsc\LocalState\rootfs`

### 更换 Ubuntu 源

#### step 1: 首先看看国内有哪些源

|   名称   |                     域名                      |
| :------: | :-------------------------------------------: |
|   阿里   |      `http://mirrors.aliyun.com/ubuntu/`      |
|   163    |       `http://mirrors.163.com/ubuntu/`        |
|  中科大  |     `https://mirrors.ustc.edu.cn/ubuntu/`     |
|   清华   | `http://mirrors.tuna.tsinghua.edu.cn/ubuntu/` |
| 电子科大 |     `http://ubuntu.dormforce.net/ubuntu/`     |

#### step 2: 获取 Ubuntu 代号

`lsb_release -a`

Ubuntu 18.04.1，查出来的代号就是 bionic.

#### step 3: 编辑源

![编辑源](https://cdn-image.tsanfer.xyz/img/20190121012630368.png)

红色边框：服务器地址

紫色边框：Ubuntu 的代号（Codename）

#### step 4: 修改源文件 sources.list

先备份

`sudo cp /etc/apt/sources.list /etc/apt/sources.list.bcakup`

再修改（如改为 163 源）

```bash
#163源
deb http://mirrors.163.com/ubuntu/ bionic main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ bionic-security main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ bionic-updates main restricted universe multiverse
deb http://mirrors.163.com/ubuntu/ bionic-proposed main restricted universe multiverse

##測試版源
deb http://mirrors.163.com/ubuntu/ bionic-backports main restricted universe multiverse

# 源碼
deb-src http://mirrors.163.com/ubuntu/ bionic main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ bionic-security main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ bionic-updates main restricted universe multiverse
deb-src http://mirrors.163.com/ubuntu/ bionic-proposed main restricted universe multiverse

##測試版源
deb-src http://mirrors.163.com/ubuntu/ bionic-backports main restricted universe multiverse
```

#### step 5: 更新软件列表和升级

更新软件列表（检测出可更新的软件）：

`sudo apt update`

更新软件：

`sudo apt upgrade`

### 安装 Python3、pip

```bash
# 安装python3
sudo apt install python3
# 安装pip
sudo apt install python3-pip
```

#### 更换 pip 源

pip 国内的一些镜像

|     名称     |                           域名                           |
| :----------: | :------------------------------------------------------: |
|    阿里云    |    [阿里云](https://mirrors.aliyun.com/pypi/simple/)     |
| 中国科技大学 | [中国科技大学](https://pypi.mirrors.ustc.edu.cn/simple/) |
|   清华大学   |  [清华大学](https://pypi.tuna.tsinghua.edu.cn/simple/)   |

修改 ~/.pip/pip.conf (没有就创建一个)， 内容如下：

```bash
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
trusted-host=mirrors.aliyun.com
```

## Github 配置

克隆 一个新的公共的空白仓库到本地 `~\Sphinx_GitHub_ReadtheDocs`

目录结构：

```bash
.
├── LICENSE
└── README.md
```

## Sphinx 配置

### 安装 Sphinx、及其插件

```bash
pip3 install sphinx sphinx_rtd_theme recommonmark sphinx-markdown-tables sphinxemoji
```

### 初始化 Sphinx

```bash
# 进入Git根目录
cd ~/Sphinx_GitHub_ReadtheDocs
# 开始快速配置sphinx
sphinx-quickstart

# 选择把源文件和删除文件分开（y）
> Separate source and build directories (y/n) [n]:y
# 项目名称
> Project name: Sphinx_GitHub_ReadtheDocs
# 作者姓名
> Author name(s): Tsanfer
# 版本号
> Project release []: 0.2
# 语言
> Project language [en]: zh_CN
```

目录结构：

```bash
.
├── LICENSE
├── Makefile
├── README.md
├── make.bat
└── source
    ├── _static
    ├── _templates
    ├── conf.py
    └── index.rst
```

验证配置是否正确：

```bash
cd ~/Sphinx_GitHub_ReadtheDocs
make html
```

浏览器打开`./build/index.html`查看

### 配置 Sphinx 主题，插件

配置`./source/conf.py`配置文件：

```python
# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.

extensions = [
        'recommonmark',
        'sphinx_markdown_tables',
        'sphinxemoji.sphinxemoji',
]

# -- Options for HTML output ------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
#
html_theme = 'sphinx_rtd_theme'

# The master toctree document.
master_doc = 'index'
```

添加`./requirements.txt` pip 要求文件（**Readthedocs 配置**时需要用到）

```text
# markdown suport
recommonmark
# markdown table suport
sphinx-markdown-tables
#emoji
sphinxemoji

# theme default rtd

# crate-docs-theme
sphinx-rtd-theme
```

### 更改标题，添加目录，添加文件

配置`./source/index.rst`文件：

```rst
创建Sphinx + GitHub + ReadtheDocs托管文档
=====================================================

.. toctree::
   :maxdepth: 2
   :numbered:

   Sphinx_GitHub_ReadtheDocs
```

创建`./source/Sphinx_GitHub_ReadtheDocs.md`文件

```md
# here is a test markdown file
```

然后同步到 Github

## Readthedocs 配置

导入代码库:
![导入代码库](https://i.loli.net/2020/02/18/OvZl5xmkRyiWn1U.png)

指定 pip 要求文件: `./requirements.txt`
![指定 pip 要求文件](https://i.loli.net/2020/02/18/FbK8JTxoN72M5G9.png)

### 完成

> 官方 Sphinx + Readthedocs 教程

<iframe
src="https://player.bilibili.com/player.html?aid=79278898&cid=135670902&page=1"
scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"
style="width: 640px; height: 430px; max-width: 100%">
</iframe>
