---
title: 常用存储硬件标准
date: 2021-01-21
categories:
  - 计算机
tags:
  - 硬件
  - 存储设备
---

::: tip
SSD? HDD? SATA? M.2? PCIe? AHCI? NVME? USB?
:::

<!-- more -->

## 硬盘

### 类型

#### SSD

| **颗粒** |                   |                |
| -------- | ----------------- | -------------- |
| 简称     | 全称              | 规格           |
| SLC      | Single-Level Cell | 1 bit per cell |
| MLC      | Multi-Level Cell  | 2 bit per cell |
| TLC      | Triple-Level Cell | 3 bit per cell |
| QLC      | Quad-Level Cell   | 4 bit per cell |

#### HDD

RPM (Revolutions per minute)

- 5400 RPM
- 7200 RPM
- 10000 RPM

### 接口

- SATA
- M.2
  - B key / Socket2
  - M key / Socket3
  - B & M key

![M2_Edge_Connector_Keying](http://image-hosting-tsanfer.oss-accelerate.aliyuncs.com/img/M2_Edge_Connector_Keying.svg)

- PCIe

### 总线

| **SATA** |          |
| -------- | -------- |
| 版本     | 理论速度 |
| SATA 3.0 | 600MB/S  |
| SATA 2.0 | 300MB/S  |
| SATA 1.0 | 150MB/S  |

| **PCIe** |       |          |          |          |          |      |
| -------- | ----- | -------- | -------- | -------- | -------- | ---- |
| 版本     | 带宽  | Column 0 | Column 1 | Column 2 | Column 3 | Note |
|          | x1    | x2       | x4       | x8       | x16      |      |
| 3        | 1GB/s | 2GB/s    | 4GB/s    | 8GB/s    | 16GB/s   | 硬盘 |
| 4        | 2GB/s | 4GB/s    | 8GB/s    | 16GB/s   | 32GB/s   | 硬盘 |
| 5        | 4GB/s | 8GB/s    | 16GB/s   | 32GB/s   | 64GB/s   |      |
| 6        | 8GB/s | 16GB/s   | 32GB/s   | 64GB/s   | 128GB/s  |      |

### 协议

- AHCI
- NVME

### 尺寸

- 2.5 英寸（无需单独供电）
- 3.5 英寸（需单独供电）

::: tip
硬盘速率快慢主要看总线速度
:::

---

## USB

### 物理接口

<center>
<img src="http://image-hosting-tsanfer.oss-accelerate.aliyuncs.com/img/USB_Micro-B.svg" width=200>
<img src="http://image-hosting-tsanfer.oss-accelerate.aliyuncs.com/img/USB_Type-A.svg" width=200>
<img src="http://image-hosting-tsanfer.oss-accelerate.aliyuncs.com/img/USB_3.0_Type-A_blue.svg" width=200>
<img src="http://image-hosting-tsanfer.oss-accelerate.aliyuncs.com/img/USB_Type-C_receptacle.svg" width=200>
</center>

### 协议

| **协议** |                      |                 |
| -------- | -------------------- | --------------- |
| 协议     | 速度                 | 别名            |
| USB 2.0  | 60MB/s               |                 |
| USB 3.0  | 500MB/S (5Gbps)      | USB 3.2 Gen 1   |
| USB 3.1  | 1212.12MB/s (10Gbps) | USB 3.2 Gen 2   |
| USB 3.2  | 2424.24MB/s (20Gbps) | USB 3.2 Gen 2x2 |
| USB4     | 5GB/s (40Gbps)       |                 |

> 本文由[Tsanfer's Blog](https://tsanfer.xyz) 发布！
