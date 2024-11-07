---
title: 使用 vscode 简单配置 ESP32 连接 Wi-Fi 每日定时发送 HTTP 和 HTTPS 请求
date: 2024-11-07
sidebar: "auto"
categories:
  - MCU
tags:
  - 物联网
  - ESP32
  - 嵌入式
  - 单片机
---

> [最新博客文章链接](https://tsanfer.com/views/MCU/ESP32_Wi-Fi_schedule_HTTP(S).html)
> 

---

*文字更新时间：2024/11/07*

由于学校校园网，如果长时间不重新登陆的话，网速会下降，所以想弄个能定时发送 HTTP 请求的东西。由于不想给路由器刷系统，也麻烦。就开始考虑使用局域网内的服务器，不过由于服务器没有 Wi-Fi 模块，也不想搞 USB 无线 wifi 网卡，就想着干脆用单片机嵌入式。本着怎么便宜怎么来，开始想的是用 ESP8266，不过看其核心板的价格和 ESP32-C3 SuperMini 差不多，干脆就用了比较新的 ESP32（拼多多14块钱包邮）

## 大体思路

本着学东西，先看官网教程做个大致了解。于是就跟着官网的教程一步一步做了下来。[官方 vscode 插件教程](https://github.com/espressif/vscode-esp-idf-extension/blob/master/docs/tutorial/install.md)、[基本使用方法](https://github.com/espressif/vscode-esp-idf-extension/blob/master/docs/tutorial/basic_use.md)

1. 使用 ESP 的 vscode 插件，构建模板工程
2. 配置页面填写 wifi 名字和密码（需要保证 wifi 信号良好）
3. 编写 HTTP 与 HTTPS 报文
4. 设置 SNTP 时间同步
5. 构建（Build）
6. 插上板子找串口
7. 烧录（Flash）
8. 通过串口查看结果

配置的大部分时间都是鼠标点点点

虽说这里用的是 ESP32-C3，但是感觉所有的 ESP32 系列应该都适用此文章。

### 用到的东西

- [ESP32-C3 SuperMini](https://www.nologo.tech/product/esp32/esp32C3SuperMini.html)
    
    > **实物图**
    > 
    > 
    > ![https://www.nologo.tech/assets/img/esp32/esp32c3supermini/esp32c3.png](https://www.nologo.tech/assets/img/esp32/esp32c3supermini/esp32c3.png)
    > 
    > **产品参数**
    > 
    > - 强大的 CPU：ESP32-C3，32 位 RISC-V 单核处理器，运行频率高达 160 MHz
    > - WiFi：802.11b/g/n协议、2.4GhHz、支持Station模式、SoftAP模式、SoftAP+Station模式、混杂模式
    > - 蓝牙：Bluetooth 5.0
    > - 超低功耗：深度睡眠功耗约43μA
    > - 丰富的板载资源：400KB SRAM、384KB ROM 内置 4Mflash
    > - 芯片型号 ：ESP32C3FN4
    > - 超小尺寸：小至拇指 (22.52x18mm) 经典外形，适用于可穿戴设备和小型项目
    > - 可靠的安全功能：支持 AES-128/256、哈希、RSA、HMAC、数字签名和安全启动的加密硬件加速器
    > - 丰富的接口：1xI2C、1xSPI、2xUART、11xGPIO(PWM)、4xADC
    > - 单面元件、表面贴装设计
    > - 板载LED蓝灯：GPIO8引脚
    > 
    > **引脚图**
    > 
    > ![https://www.nologo.tech/assets/img/esp32/esp32c3supermini/esp32c3foot1.png](https://www.nologo.tech/assets/img/esp32/esp32c3supermini/esp32c3foot1.png)
    > 
    > **原理图**
    > 
    > ![https://www.nologo.tech/assets/img/esp32/esp32c3supermini/esp32c3schematicdiagram.png](https://www.nologo.tech/assets/img/esp32/esp32c3supermini/esp32c3schematicdiagram.png)
    > 
- [HTTP](https://www.cloudflare.com/zh-cn/learning/ddos/glossary/hypertext-transfer-protocol-http/)
    
    > 超文本传输协议 (HTTP) 是万维网的基础，通过超文本链接加载网页。HTTP 是一种应用程序层协议，旨在在联网设备之间传输信息，并在网络协议栈的其他层之上运行。HTTP 上的一个典型工作流程是客户端计算机向服务器发出请求，然后服务器发送响应消息。
    > 

---

## 安装官方 ESP-IDF 的 vscode 插件

[官方 vscode 插件安装教程](https://github.com/espressif/vscode-esp-idf-extension/blob/master/docs/tutorial/install.md)

在 vscode 插件市场中搜索 `ESP-IDF` 并安装，点开插件，选择第一个（express）快速配置项目。

![https://cdn.tsanfer.com/image/2024-10-25_22-39-55.png](https://cdn.tsanfer.com/image/2024-10-25_22-39-55.png)

选择要安装的版本，其他不动（如果 github 连不上的话，可以在第一个选项中选择其他的下载服务器）

![https://cdn.tsanfer.com/image/2024-10-25_22-41-53.png](https://cdn.tsanfer.com/image/2024-10-25_22-41-53.png)

等待安装完成

---

## 使用官方 https_request 例子工程

### 生成官方 https_request 例子工程

可以先看[官方的基础使用教程](https://github.com/espressif/vscode-esp-idf-extension/blob/master/docs/tutorial/basic_use.md)（LED 闪烁程序，笔者本人没弄成功），再看后面的部分。或者直接使用官方的 [https_request 例子工程](https://github.com/espressif/esp-idf/tree/v5.2.3/examples/protocols/https_request)

这里，先创建一个文件夹来放所有的 ESP 项目，插件会自动在这个文件夹里再创建一个子文件夹，https_request 模板工程就放在这个插件自动生成的文件夹里

点开插件，在 `COMMAND` 窗口中点击 `Show Examples` ，这时会弹出一个框架选择界面，默认即可

在新出现的例子选择页面中，搜索 https，找到 `https_request` ，然后点击 `Create project using example http_request` 创建例子工程，工程位置就选择自己创建的放所有的 ESP 项目的文件夹。

### 选择主控与调试类型

点开插件，在 `COMMAND` 窗口中点击 `Set Espressif Target (IDF_TARGET)` ，选择 `esp32c3` ，Debug 调试方式选择 `ESP32-C3 chip (via ESP-PROG)`。debug 的调试方式，笔者是随便选的，本人在调程序的时候没用 debug。

### 配置项目

点开插件，在 `COMMAND` 窗口中点击 `SDK Configuration Editor (menuconfig)` 

- 填写 wifi 信息：
    
    在配置中搜索 wifi，在 `Example Connection Configuration` 下的 `WiFi SSID` 和 `WiFi Password` 中填写 wifi名 和 wifi密码与断连重试次数（笔者这里设置的是重试 999999 次）
    

![https://cdn.tsanfer.com/image/2024-11-7_13-24-46.png](https://cdn.tsanfer.com/image/2024-11-7_13-24-46.png)

- （可选）日志启用 `debug` 输出
    
    用于输出日志中的 debug 信息，在配置中搜索 `debug`，在 `Component config` 下的 `Log output` 中的 `Default log verbosity` 选择 `Debug` 来启用日志 debug 输出。然后点击保存
    

---

## 编辑入口主文件

> 这里可以先不编辑报文内容，直接构建烧录测试一下，程序会默认测试与 `www.howsmyssl.com` 之间的 HTTPS 连接。
> 

> `./main/https_request_example_main.c` 文件完整代码见后文，此处仅截取片段讲解，做参考
> 

由于插件已经自动构建好 FreeRTOS、LwIP 以及时间同步的环境，之后就只用编辑入口文件 `./main/https_request_example_main.c` 中的内容了。

先确定程序调用关系，在此文件中主要是：

`app_main()` → `https_request_task()` → `https_get_request_using_crt_bundle()` → `https_get_request()`

HTTPS 请求就是在 `https_get_request()` 函数中执行的。

如果有设置 cookie 的需求的话，ESP32 本身没有直接设置 cookie 的 API，但可以通过 [esp_http_client_set_header](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/protocols/esp_http_client.html#_CPPv426esp_http_client_set_header24esp_http_client_handle_tPKcPKc) 向 HTTP 头里添加 cookie 等头数据的方式来设置 cookie。

### 配置服务器路径与 HTTPS 报文

建议先在电脑上用 postman，或者在线的 http 调试工具弄好后，再用工具转换成 HTTP 报文。笔者是调好后，输出为 cURL 格式，然后再转化成 HTTP 报文格式。

```c
// ./main/https_request_example_main.c 
// 文件中的部分配置内容

/*
*/

// 服务器域名
#define HTTPS_WEB_SERVER "www.baidu.com"
// HTTPS 端口为 443
#define HTTPS_WEB_PORT "443"
// 网页路径
#define HTTPS_WEB_URL "https://www.baidu.com"

// URL 最大长度，一般默认
#define SERVER_URL_MAX_SZ 256

// 输出提示信息的开头
static const char *HTTPS_TAG = "HTTPS";

static const char HTTPS_REQUEST[] = "GET " HTTPS_WEB_URL " HTTP/1.1\r\n"
                                    "Host: "HTTPS_WEB_SERVER":"HTTPS_WEB_PORT"\r\n"
                                    "User-Agent: esp-idf/1.0 esp32\r\n"
                                    "Accept: */*\r\n"
                                    "\r\n";
/*
*/
```

### 设置定时时间

使用 `tm` 结构体格式，设置定时时间，可实现类似 crontab 的定时任务

```c
// ./main/https_request_example_main.c 

/*
*/

static void https_request_task(void *pvparameters)
{
    ESP_LOGI(HTTPS_TAG, "Start https_request example");

#if CONFIG_MBEDTLS_CERTIFICATE_BUNDLE && CONFIG_EXAMPLE_USING_ESP_TLS_MBEDTLS

    time_t now;
    struct tm *timeinfo;

    while (1) {
        // 获取当前时间的时间戳
        now = time(NULL);
        // 将时间戳转换为当地时间结构
        timeinfo = localtime(&now);

        // 此处设置为每天 2:30:00 定时执行
        // 更多时间格式参考 tm 结构体定义
        // 打印当前时间
        ESP_LOGI(HTTPS_TAG, "Current time: %02d:%02d:%02d\n", timeinfo->tm_hour, timeinfo->tm_min, timeinfo->tm_sec);
        if (timeinfo->tm_hour == 2 && timeinfo->tm_min == 30 && timeinfo->tm_sec == 0)
        {
            https_get_request_using_crt_bundle();
            // 打印当前时间
            ESP_LOGI(HTTPS_TAG, "Current time: %02d:%02d:%02d\n", timeinfo->tm_hour, timeinfo->tm_min, timeinfo->tm_sec);
            // 打印堆使用情况
            ESP_LOGI(HTTPS_TAG, "Minimum free heap size: %" PRIu32 " bytes", esp_get_minimum_free_heap_size());
        }

        // 每秒检查一次时间
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
#endif
    // 后面的代码执行不到
    //
    ESP_LOGI(HTTPS_TAG, "Minimum free heap size: %" PRIu32 " bytes", esp_get_minimum_free_heap_size());
    ESP_LOGI(HTTPS_TAG, "Finish https_request example");
    vTaskDelete(NULL);
}

/*
*/
```

### 时间同步 SNTP

时间同步代码，修改自官方模板，系统启动连上互联网后，先同步系统时间

```c
// ./main/https_request_example_main.c 

/*
*/

#include "esp_netif_sntp.h"

/*
*/

static void obtain_time(void)
{
    ESP_LOGI(NTP_TAG, "Initializing and starting SNTP");

    esp_sntp_config_t config = ESP_NETIF_SNTP_DEFAULT_CONFIG("ntp.aliyun.com");

    esp_netif_sntp_init(&config);

    // wait for time to be set
    time_t now = 0;
    struct tm timeinfo = { 0 };
    int retry = 0;
    const int retry_count = 15;
    // while (esp_netif_sntp_sync_wait(2000 / portTICK_PERIOD_MS) == ESP_ERR_TIMEOUT && ++retry < retry_count) {
    //     ESP_LOGI(NTP_TAG, "Waiting for system time to be set... (%d/%d)", retry, retry_count);
    // }
    while (esp_netif_sntp_sync_wait(2000 / portTICK_PERIOD_MS) == ESP_ERR_TIMEOUT) {
        ESP_LOGI(NTP_TAG, "Waiting for system time to be set... (%d/%d)", retry, retry_count);
        // NTP 同步多次失败，重启系统
        if(++retry > retry_count){
            esp_restart();
        }
    }
    time(&now);
    localtime_r(&now, &timeinfo);

    // 将时区设置为中国标准时间
    setenv("TZ", "UTC-8", 1);
    tzset();

    esp_netif_sntp_deinit();
}

/*
*/
```

---

## HTTP 请求

HTTP 请求官方也有 [http_request](https://github.com/espressif/esp-idf/tree/v5.2.3/examples/protocols/http_request) 的例子工程，剪切其中的 http 请求代码到入口文件 `./main/https_request_example_main.c` 中，并添加相应宏定义。然后在入口函数 `app_main()` 末尾处，添加 HTTP 任务即可

![https://cdn.tsanfer.com/image/2024-10-26_01-03-58.png](https://cdn.tsanfer.com/image/2024-10-26_01-03-58.png)

---

## 入口文件完整代码示例

可同时分别执行 HTTP 与 HTTPS 请求，文件位置：`./main/https_request_example_main.c`

```c
// ./main/https_request_example_main.c 

/*
 * HTTPS GET Example using plain Mbed TLS sockets
 *
 * Contacts the howsmyssl.com API via TLS v1.2 and reads a JSON
 * response.
 *
 * Adapted from the ssl_client1 example in Mbed TLS.
 *
 * SPDX-FileCopyrightText: The Mbed TLS Contributors
 *
 * SPDX-License-Identifier: Apache-2.0
 *
 * SPDX-FileContributor: 2015-2023 Espressif Systems (Shanghai) CO LTD
 */

#include <string.h>
#include <stdlib.h>
#include <inttypes.h>
#include <time.h>
#include <sys/time.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/event_groups.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"
#include "esp_system.h"
#include "esp_timer.h"
#include "nvs_flash.h"
#include "nvs.h"
#include "protocol_examples_common.h"
#include "esp_netif_sntp.h"
#include "esp_sntp.h"
#include "esp_netif.h"

#include "lwip/err.h"
#include "lwip/sockets.h"
#include "lwip/sys.h"
#include "lwip/netdb.h"
#include "lwip/dns.h"

#include "esp_tls.h"
#include "sdkconfig.h"
#if CONFIG_MBEDTLS_CERTIFICATE_BUNDLE && CONFIG_EXAMPLE_USING_ESP_TLS_MBEDTLS
#include "esp_crt_bundle.h"
#endif
#include "time_sync.h"

/* Constants that aren't configurable in menuconfig */
#define HTTP_WEB_SERVER "www.catb.org"
#define HTTP_WEB_PORT "80"
#define HTTP_WEB_URL "http://www.catb.org/esr/writings/taoup/html/"

#define HTTPS_WEB_SERVER "www.baidu.com"
#define HTTPS_WEB_PORT "443"
#define HTTPS_WEB_URL "https://www.baidu.com"

#define SERVER_URL_MAX_SZ 256

static const char *HTTP_TAG = "HTTP";
static const char *HTTPS_TAG = "HTTPS";
static const char *NTP_TAG = "NTP";

/* Timer interval once every day (24 Hours) */
#define TIME_PERIOD (86400000000ULL)

static const char HTTP_REQUEST[] = "GET " HTTP_WEB_URL " HTTP/1.0\r\n"
                                    "Host: "HTTP_WEB_SERVER":"HTTP_WEB_PORT"\r\n"
                                    "User-Agent: esp-idf/1.0 esp32\r\n"
                                    "Accept: */*\r\n"
                                    "\r\n";

static const char HTTPS_REQUEST[] = "GET " HTTPS_WEB_URL " HTTP/1.1\r\n"
                                    "Host: "HTTPS_WEB_SERVER":"HTTPS_WEB_PORT"\r\n"
                                    "User-Agent: esp-idf/1.0 esp32\r\n"
                                    "Accept: */*\r\n"
                                    "\r\n";

/* Root cert for howsmyssl.com, taken from server_root_cert.pem

   The PEM file was extracted from the output of this command:
   openssl s_client -showcerts -connect www.howsmyssl.com:443 </dev/null

   The CA root cert is the last cert given in the chain of certs.

   To embed it in the app binary, the PEM file is named
   in the component.mk COMPONENT_EMBED_TXTFILES variable.
*/
extern const uint8_t server_root_cert_pem_start[] asm("_binary_server_root_cert_pem_start");
extern const uint8_t server_root_cert_pem_end[]   asm("_binary_server_root_cert_pem_end");

extern const uint8_t local_server_cert_pem_start[] asm("_binary_local_server_cert_pem_start");
extern const uint8_t local_server_cert_pem_end[]   asm("_binary_local_server_cert_pem_end");

static void https_get_request(esp_tls_cfg_t cfg, const char *WEB_SERVER_URL, const char *REQUEST);
#if CONFIG_MBEDTLS_CERTIFICATE_BUNDLE && CONFIG_EXAMPLE_USING_ESP_TLS_MBEDTLS
static void https_get_request_using_crt_bundle(void);
#endif
static void obtain_time(void);

static void https_request_task(void *pvparameters)
{
    ESP_LOGI(HTTPS_TAG, "Start https_request example");

#if CONFIG_MBEDTLS_CERTIFICATE_BUNDLE && CONFIG_EXAMPLE_USING_ESP_TLS_MBEDTLS

    time_t now;
    struct tm *timeinfo;

    while (1) {
        // 获取当前时间的时间戳
        now = time(NULL);
        // 将时间戳转换为当地时间结构
        timeinfo = localtime(&now);

        // 此处设置为每天 2:30:00 定时执行
        // 更多时间格式参考 tm 结构体定义
        // 打印当前时间
        ESP_LOGI(HTTPS_TAG, "Current time: %02d:%02d:%02d\n", timeinfo->tm_hour, timeinfo->tm_min, timeinfo->tm_sec);
        if (timeinfo->tm_hour == 2 && timeinfo->tm_min == 30 && timeinfo->tm_sec == 0)
        {
            https_get_request_using_crt_bundle();
            // 打印当前时间
            ESP_LOGI(HTTPS_TAG, "Current time: %02d:%02d:%02d\n", timeinfo->tm_hour, timeinfo->tm_min, timeinfo->tm_sec);
            // 打印堆使用情况
            ESP_LOGI(HTTPS_TAG, "Minimum free heap size: %" PRIu32 " bytes", esp_get_minimum_free_heap_size());
        }

        // 每秒检查一次时间
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
#endif
    // 后面的代码执行不到
    //
    ESP_LOGI(HTTPS_TAG, "Minimum free heap size: %" PRIu32 " bytes", esp_get_minimum_free_heap_size());
    ESP_LOGI(HTTPS_TAG, "Finish https_request example");
    vTaskDelete(NULL);
}

static void http_request_task(void *pvParameters)
{
    const struct addrinfo hints = {
        .ai_family = AF_INET,
        .ai_socktype = SOCK_STREAM,
    };
    struct addrinfo *res;
    struct in_addr *addr;
    int s, r;
    char recv_buf[64];

    time_t now;
    struct tm *timeinfo;

    while(1) {
        // 获取当前时间的时间戳
        now = time(NULL);
        // 将时间戳转换为当地时间结构
        timeinfo = localtime(&now);

        // 此处设置为每天 2:30:00 定时执行
        // 更多时间格式参考 tm 结构体定义
        // 打印当前时间
        ESP_LOGI(HTTP_TAG, "Current time: %02d:%02d:%02d\n", timeinfo->tm_hour, timeinfo->tm_min, timeinfo->tm_sec);
        if (timeinfo->tm_hour == 2 && timeinfo->tm_min == 30 && timeinfo->tm_sec == 0)
        {
            // 打印当前时间
            ESP_LOGI(HTTP_TAG, "Current time: %02d:%02d:%02d\n", timeinfo->tm_hour, timeinfo->tm_min, timeinfo->tm_sec);

            int err = getaddrinfo(HTTP_WEB_SERVER, HTTP_WEB_PORT, &hints, &res);

            if(err != 0 || res == NULL) {
                ESP_LOGE(HTTP_TAG, "DNS lookup failed err=%d res=%p", err, res);
                vTaskDelay(1000 / portTICK_PERIOD_MS);
                continue;
            }

            /* Code to print the resolved IP.

            Note: inet_ntoa is non-reentrant, look at ipaddr_ntoa_r for "real" code */
            addr = &((struct sockaddr_in *)res->ai_addr)->sin_addr;
            ESP_LOGI(HTTP_TAG, "DNS lookup succeeded. IP=%s", inet_ntoa(*addr));

            s = socket(res->ai_family, res->ai_socktype, 0);
            if(s < 0) {
                ESP_LOGE(HTTP_TAG, "... Failed to allocate socket.");
                freeaddrinfo(res);
                vTaskDelay(1000 / portTICK_PERIOD_MS);
                continue;
            }
            ESP_LOGI(HTTP_TAG, "... allocated socket");

            if(connect(s, res->ai_addr, res->ai_addrlen) != 0) {
                ESP_LOGE(HTTP_TAG, "... socket connect failed errno=%d", errno);
                close(s);
                freeaddrinfo(res);
                vTaskDelay(4000 / portTICK_PERIOD_MS);
                continue;
            }

            ESP_LOGI(HTTP_TAG, "... connected");
            freeaddrinfo(res);

            if (write(s, HTTP_REQUEST, strlen(HTTP_REQUEST)) < 0) {
                ESP_LOGE(HTTP_TAG, "... socket send failed");
                close(s);
                vTaskDelay(4000 / portTICK_PERIOD_MS);
                continue;
            }
            ESP_LOGI(HTTP_TAG, "... socket send success");

            struct timeval receiving_timeout;
            receiving_timeout.tv_sec = 5;
            receiving_timeout.tv_usec = 0;
            if (setsockopt(s, SOL_SOCKET, SO_RCVTIMEO, &receiving_timeout,
                    sizeof(receiving_timeout)) < 0) {
                ESP_LOGE(HTTP_TAG, "... failed to set socket receiving timeout");
                close(s);
                vTaskDelay(4000 / portTICK_PERIOD_MS);
                continue;
            }
            ESP_LOGI(HTTP_TAG, "... set socket receiving timeout success");

            /* Read HTTP response */
            do {
                bzero(recv_buf, sizeof(recv_buf));
                r = read(s, recv_buf, sizeof(recv_buf)-1);
                for(int i = 0; i < r; i++) {
                    putchar(recv_buf[i]);
                }
            } while(r > 0);

            // ESP_LOGI(HTTP_TAG, "\r\n\r\n校园网登陆已刷新\r\n");

            ESP_LOGI(HTTP_TAG, "Minimum free heap size: %" PRIu32 " bytes", esp_get_minimum_free_heap_size());
            
            ESP_LOGI(HTTP_TAG, "... done reading from socket. Last read return=%d errno=%d.", r, errno);
            close(s);

            ESP_LOGI(HTTP_TAG, "Starting again!");

            // 打印堆使用情况
            ESP_LOGI(HTTP_TAG, "Minimum free heap size: %" PRIu32 " bytes", esp_get_minimum_free_heap_size());
        }

        // 每秒检查一次时间
        vTaskDelay(1000 / portTICK_PERIOD_MS);
    }
}

void app_main(void)
{
    ESP_ERROR_CHECK( nvs_flash_init() );
    ESP_ERROR_CHECK(esp_netif_init());
    ESP_ERROR_CHECK( esp_event_loop_create_default() );

    ESP_ERROR_CHECK(example_connect());

    obtain_time();

    /* This helper function configures Wi-Fi or Ethernet, as selected in menuconfig.
     * Read "Establishing Wi-Fi or Ethernet Connection" section in
     * examples/protocols/README.md for more information about this function.
     */

    // if (esp_reset_reason() == ESP_RST_POWERON) {
    //     ESP_LOGI(HTTPS_TAG, "Updating time from NVS");
    //     ESP_ERROR_CHECK(update_time_from_nvs());
    // }

    const esp_timer_create_args_t nvs_update_timer_args = {
        .callback = (void *)&fetch_and_store_time_in_nvs,
    };

    esp_timer_handle_t nvs_update_timer;
    ESP_ERROR_CHECK(esp_timer_create(&nvs_update_timer_args, &nvs_update_timer));
    ESP_ERROR_CHECK(esp_timer_start_periodic(nvs_update_timer, TIME_PERIOD));

    xTaskCreate(&https_request_task, "https_get_task", 8192, NULL, 5, NULL);
    xTaskCreate(&http_request_task, "http_get_task", 8192, NULL, 5, NULL);
}

static void obtain_time(void)
{
    ESP_LOGI(NTP_TAG, "Initializing and starting SNTP");

    esp_sntp_config_t config = ESP_NETIF_SNTP_DEFAULT_CONFIG("ntp.aliyun.com");

    esp_netif_sntp_init(&config);

    // wait for time to be set
    time_t now = 0;
    struct tm timeinfo = { 0 };
    int retry = 0;
    const int retry_count = 15;
    // while (esp_netif_sntp_sync_wait(2000 / portTICK_PERIOD_MS) == ESP_ERR_TIMEOUT && ++retry < retry_count) {
    //     ESP_LOGI(NTP_TAG, "Waiting for system time to be set... (%d/%d)", retry, retry_count);
    // }
    while (esp_netif_sntp_sync_wait(2000 / portTICK_PERIOD_MS) == ESP_ERR_TIMEOUT) {
        ESP_LOGI(NTP_TAG, "Waiting for system time to be set... (%d/%d)", retry, retry_count);
        // NTP 同步多次失败，重启系统
        if(++retry > retry_count){
            esp_restart();
        }
    }
    time(&now);
    localtime_r(&now, &timeinfo);

    // 将时区设置为中国标准时间
    setenv("TZ", "UTC-8", 1);
    tzset();

    esp_netif_sntp_deinit();
}

#if CONFIG_MBEDTLS_CERTIFICATE_BUNDLE && CONFIG_EXAMPLE_USING_ESP_TLS_MBEDTLS
static void https_get_request_using_crt_bundle(void)
{
    ESP_LOGI(HTTPS_TAG, "https_request using crt bundle");
    esp_tls_cfg_t cfg = {
        .crt_bundle_attach = esp_crt_bundle_attach,
    };
    https_get_request(cfg, HTTPS_WEB_URL, HTTPS_REQUEST);
}
#endif // CONFIG_MBEDTLS_CERTIFICATE_BUNDLE && CONFIG_EXAMPLE_USING_ESP_TLS_MBEDTLS

static void https_get_request(esp_tls_cfg_t cfg, const char *WEB_SERVER_URL, const char *REQUEST)
{
    char buf[512];
    int ret, len;

    esp_tls_t *tls = esp_tls_init();
    if (!tls) {
        ESP_LOGE(HTTPS_TAG, "Failed to allocate esp_tls handle!");
        goto exit;
    }

    if (esp_tls_conn_http_new_sync(WEB_SERVER_URL, &cfg, tls) == 1) {
        ESP_LOGI(HTTPS_TAG, "Connection established...");
    } else {
        ESP_LOGE(HTTPS_TAG, "Connection failed...");
        int esp_tls_code = 0, esp_tls_flags = 0;
        esp_tls_error_handle_t tls_e = NULL;
        esp_tls_get_error_handle(tls, &tls_e);
        /* Try to get TLS stack level error and certificate failure flags, if any */
        ret = esp_tls_get_and_clear_last_error(tls_e, &esp_tls_code, &esp_tls_flags);
        if (ret == ESP_OK) {
            ESP_LOGE(HTTPS_TAG, "TLS error = -0x%x, TLS flags = -0x%x", esp_tls_code, esp_tls_flags);
        }
       goto cleanup;
    }

    size_t written_bytes = 0;
    do {
        ret = esp_tls_conn_write(tls,
                                 REQUEST + written_bytes,
                                 strlen(REQUEST) - written_bytes);
        if (ret >= 0) {
            ESP_LOGI(HTTPS_TAG, "%d bytes written", ret);
            written_bytes += ret;
        } else if (ret != ESP_TLS_ERR_SSL_WANT_READ  && ret != ESP_TLS_ERR_SSL_WANT_WRITE) {
            ESP_LOGE(HTTPS_TAG, "esp_tls_conn_write  returned: [0x%02X](%s)", ret, esp_err_to_name(ret));
            goto cleanup;
        }
    } while (written_bytes < strlen(REQUEST));

    ESP_LOGI(HTTPS_TAG, "Reading HTTP response...");
    do {
        len = sizeof(buf) - 1;
        memset(buf, 0x00, sizeof(buf));
        ret = esp_tls_conn_read(tls, (char *)buf, len);

        if (ret == ESP_TLS_ERR_SSL_WANT_WRITE  || ret == ESP_TLS_ERR_SSL_WANT_READ) {
            continue;
        } else if (ret < 0) {
            ESP_LOGE(HTTPS_TAG, "esp_tls_conn_read  returned [-0x%02X](%s)", -ret, esp_err_to_name(ret));
            break;
        } else if (ret == 0) {
            ESP_LOGI(HTTPS_TAG, "connection closed");
            break;
        }

        len = ret;
        ESP_LOGD(HTTPS_TAG, "%d bytes read", len);
        /* Print response directly to stdout as it is read */
        for (int i = 0; i < len; i++) {
            putchar(buf[i]);
        }
        putchar('\n'); // JSON output doesn't have a newline at end
    } while (1);

cleanup:
    esp_tls_conn_destroy(tls);
exit:
}
```

---

## 构建、烧录、查看效果

代码写完了，剩下的就是点点点了。

### 构建

点开插件，在 `COMMAND` 窗口中点击 `Build` 构建，第一次可能会久一点，后面就是增量更新了，时间会短一点。

### 查看芯片空间使用

可选步骤，点开插件，在 `COMMAND` 窗口中点击 `IDF Size` 查看空间使用率，笔者这里看 RAM 用了100KB左右（这个界面的右上角，点击 Flash 可以烧录程序）。

![https://cdn.tsanfer.com/image/2024-10-26_00-22-28.png](https://cdn.tsanfer.com/image/2024-10-26_00-22-28.png)

开发板跑起来之后，通过 `esp_get_minimum_free_heap_size()` 函数查看到的剩余堆空间，还有 160KB 左右。相当于只用了大约 50% 的内存。Flash 用了大约 1MB，只使用了 25% 左右。

![https://cdn.tsanfer.com/image/2024-10-26_21-03-43.png](https://cdn.tsanfer.com/image/2024-10-26_21-03-43.png)

主要是没啥需求，只是个 HTTPS 客户端，发发报文。如果是 HTTPS 服务器的话，估计占用要高些。这 14 块钱的 esp32，性能对笔者来说都过剩了（一天发一个包，没有压力测试需求）。

### 选择串口

点开插件，在 `COMMAND` 窗口中点击 `Select Serial Port` 选择串口。如果这里不确定是哪个口，可以一个一个试，看哪个口能烧录进去

### 烧录

点开插件，在 `COMMAND` 窗口中点击 `Flash` ，选择烧录类型为串口 `UART` 

### 查看效果

点开插件，在 `COMMAND` 窗口中点击 `Monitor`

这里会通过串口显示系统输出的信息，ESP32 会在这里输出服务器返回的报文。没问题的话，应该和在电脑上调试的结果一致。

![https://cdn.tsanfer.com/image/2024-10-26_19-42-45.png](https://cdn.tsanfer.com/image/2024-10-26_19-42-45.png)

---

## 结尾

现在的单片机嵌入式开发都这么方便了吗，环境配置安个插件就行，官方给的例子也多。不同主控，点击就能配置，构建和烧录也是点一下就行，没有出现问题（也有可能是因为笔者没用外设的原因）。终于不用忍受在 keil 和 stc-isp 上开发 stc 芯片的繁琐配置过程了。而且还能一键生成 FreeRTOS、LwIP、SNTP 环境

不过能在这之上再作进一步的抽象就好了，隐藏底层的细节，让开发者只关注业务。比如像笔者自己，就只想发个 HTTP 包，其他无所谓，要是连上板子，填入 wifi 信息后，能直接写 HTTP 报文就好了（要啥自行车）。

如果只是发个 HTTP 报文，不太要求硬件成本和设备使用环境的话，在通用性方面，感觉还是通用 PC 好一点。直接装个 linux 发行版，再装个服务器面板，用面板建个 systemd 定时任务，直接调用 shell 脚本执行 cURL 命令就完了，配置起来也更灵活。

> 本文由[Tsanfer's Blog](https://tsanfer.com) 发布！