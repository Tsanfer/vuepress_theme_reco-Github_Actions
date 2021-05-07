---
title: 蓝桥杯单片机(CT107D)需要准备的一些文件的写法
date: 2020-03-02
sidebar: "auto"
categories:
  - MCU
tags:
  - 单片机
---

## 实物图

![CT107D实物图](https://img-blog.csdnimg.cn/20190902221159377.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzI3OTYxODQz,size_16,color_FFFFFF,t_70)

## 电路原理图

![CT107D电路原理图](https://img-blog.csdnimg.cn/20190219230002735.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzI3OTYxODQz,size_16,color_FFFFFF,t_70)

- [CT107D 电路原理图][2]

### **_[独立下载程序(可直接下载运行)\_CT107D 赛前准备][9]_**

### **_[独立下载程序(可直接下载运行)*CT107D 赛前准备*含 USB 转串口驱动][10]_**

#### 更新时间：2019-3-22

**[GitHub 链接][4]**

- **[所有文件(源代码)][1]**
  **`common.h` `main.c` `timer.c` `hc138.c` `led.c` `drivers.c` `digital_tube.c` `key.c` `ds18b20.c` `ds1302.c` `i2c.c` `sonic_infra.c`**

## 功能介绍

```c
K1:打印从串口接收到的信息，并显示在数码管上
K2:显示DS18B20温度值
K3:读取DS1302的时分秒值
K4:读取DS1302的星期的值
K5:读取DS1302的年月日的值
K6:从EEPROM中写入并读出数据(隔一秒加1)
K7:显示超声波的距离
K8:显示A/D管脚的输入AD值(AD0)
K9:显示光敏电阻的AD值(AD1)
K10:显示IN-/IN+的差分AD值(AD2)
K11:显示电位器的AD值(AD3)(Rb2)
K12:显示D/A管脚的输出DA值(127,2.5V)
K13:让接在MOT与VCC之间的电机以30%(1.5V)的速度旋转
连按两下任意按键，显示按键对应的值:
1,2,3,4,
5,6,7,8,
9,a,b,c,
d,e,f,.
长按任意按键，LED(L1-L8)显示对应的值二进制值(从左往右,L1->L2->L3->L4->L5->L6->L7->L8)
按键按下时有蜂鸣器提示音
波特率为2400

x^1=~x; X^0=X;
Px^x不可直接赋值,Pxx可直接赋值;
P4^2,不可直接赋值,P42=0,可直接赋值;
Can't shift a single PIN, but can shift the entire I/O port;
(不可移位单个PIN，可移位整个I/O口);
Declare variable first, then operate;  //uchar i;  TR0=0;
(先声明变量，后操作);
(数码管先段码再位码);
(数据总线在读写之前要释放)；
(协议传输中拉低拉高需要一定的时间，因查看相应的说明书)；// PCF8591的速度比I2C慢,SCL需要延迟5us
```

## 所有文件(all files)

### common.h

**`common.h`**

```c
#ifndef COMMON_H
#define COMMON_H

#include "stc15f2k60s2.h"
#include "intrins.h"

typedef unsigned char uchar;
typedef unsigned short int uint;

#define seg_tab_none 19
#define bit_tab_none 8

extern uchar disp_val[8];
extern uchar trg,cont,key_val;

extern void Timer0Init(void);
extern void Timer1Init(void);
extern void UartInit(void);
extern void hc138Init(void);
extern void hc138_led(void);
extern void hc138_drivers(void);
extern void hc138_bit(void);
extern void hc138_seg(void);
extern void hc138_none(void);
extern void ledInit(void);
extern void led_on_N(uchar led);
extern void relayInit(void);
extern void relay_off(void);
extern void motorInit(void);
extern void motor_on(void);
extern void motor_off(void);
extern void buzzInit(void);
extern void buzz_on(void);
extern void buzz_off(void);
extern void disp_scan(void);
extern void disp_val_none(void);
extern void key_scan(void);
extern void ds18b20Init(void);
extern uchar ds18b20_get(void);
extern void ds1302_burst_write(uchar *dat);
extern void ds1302_burst_read(uchar *dat);
extern void ds1302Init(void);
extern uint sonic_get(void);
//extern void e2_reset(void);
extern void e2_write(uchar word,uchar *dat,uchar len);
extern void e2_read(uchar word,uchar *dat,uchar len);
extern void adc_get(uchar *dat,uchar len);
extern void dac_set(uchar dat);

#endif
```

### main.c

**`main.c`**

```c
#include "common.h"

void SysInit(void)
{
 disp_val_none();
 Timer0Init();
 Timer1Init();
 UartInit();
 //Timer2Init();
 hc138Init();
 ledInit();
 buzzInit();
 motorInit();
 relayInit();
 ds18b20Init();
 ds1302Init();
 //e2_reset();
 EA=1;
 ET0=1;
 ET1=1;
 ES=1;
 //IE2|=0x04;
}

void main(void)
{
 SysInit();
 while(1);
}
```

### timer.c

**`timer.c`**

```c
#include "common.h"

static uchar page=1;
static uchar rxd_data=0;
static uchar temperature=0;
static uchar ds1302_time[7];
static uint sonic_distance=0;
static idata uchar e2_write_data[8]={0,1,2,3,4,5,6,7},e2_read_data[8];
static uchar adc_data[4];
static uchar dac_data=128;
static uchar trg_times,trg_clock,cont_clock;
static uchar pwm_clock,pwm_data=30;
static bit pwm_flag=0;
static uchar buzz=0;

void Timer0Init(void)  //10微秒@11.0592MHz
{
 AUXR &= 0x7F; //定时器时钟12T模式
 TMOD &= 0xF0; //设置定时器模式
 TL0 = 0xF7;  //设置定时初值
 TH0 = 0xFF;  //设置定时初值
 TF0 = 0;  //清除TF0标志
 TR0 = 1;  //定时器0开始计时
}

void Timer1Init(void)  //50毫秒@11.0592MHz
{
 AUXR &= 0xBF;  //定时器时钟12T模式
 TMOD &= 0x0F;  //设置定时器模式
 TL1 = 0x00;  //设置定时初值
 TH1 = 0x4C;  //设置定时初值
 TF1 = 0;  //清除TF1标志
 TR1 = 1;  //定时器1开始计时
}

void UartInit(void)  //2400bps@11.0592MHz
{
 SCON = 0x50;  //8位数据,可变波特率
 AUXR |= 0x01;  //串口1选择定时器2为波特率发生器
 AUXR &= 0xFB;  //定时器2时钟为Fosc/12,即12T
 T2L = 0xA0;  //设定定时初值
 T2H = 0xFF;  //设定定时初值
 AUXR |= 0x10;  //启动定时器2
}
void trg_run(void)
{
 if(trg)
 {
  if(++trg_times==1)
  {
   trg_clock=0;
  }
  buzz=1;
  switch(key_val)
  {
   case 1:page=1;break;
   case 2:page=2;break;
   case 3:page=3;break;
   case 4:page=4;break;
   case 5:page=5;break;
   case 6:page=6;break;
   case 7:page=7;break;
   case 8:page=8;break;
   case 9:page=9;break;
   case 10:page=10;break;
   case 11:page=11;break;
   case 12:page=12;break;
   case 13:page=13;break;
   case 14:page=14;break;
   case 15:page=15;break;
   case 16:page=16;break;
   default:break;
  }
 }
}
void trg_double_run(void)
{
 if(++trg_clock>=15)
 {
  trg_clock=0;
  trg_times=0;
 }
 if(trg_clock<15&&trg_times==2)
 {
  trg_clock=0;
  trg_times=0;
  disp_val_none();
  switch(key_val)
  {
   case 1:disp_val[0]=key_val;break;
   case 2:disp_val[0]=key_val;break;
   case 3:disp_val[0]=key_val;break;
   case 4:disp_val[0]=key_val;break;
   case 5:disp_val[0]=key_val;break;
   case 6:disp_val[0]=key_val;break;
   case 7:disp_val[0]=key_val;break;
   case 8:disp_val[0]=key_val;break;
   case 9:disp_val[0]=key_val;break;
   case 10:disp_val[0]=key_val;break;
   case 11:disp_val[0]=key_val;break;
   case 12:disp_val[0]=key_val;break;
   case 13:disp_val[0]=key_val;break;
   case 14:disp_val[0]=key_val;break;
   case 15:disp_val[0]=key_val;break;
   case 16:disp_val[0]=key_val;break;
   default:break;
  }
 }
}
void cont_run(void)
{
 if(cont)
 {
  if(++cont_clock>=20)
  {
   switch(key_val)
   {
    case 1:led_on_N(~key_val);break;
    case 2:led_on_N(~key_val);break;
    case 3:led_on_N(~key_val);break;
    case 4:led_on_N(~key_val);break;
    case 5:led_on_N(~key_val);break;
    case 6:led_on_N(~key_val);break;
    case 7:led_on_N(~key_val);break;
    case 8:led_on_N(~key_val);break;
    case 9:led_on_N(~key_val);break;
    case 10:led_on_N(~key_val);break;
    case 11:led_on_N(~key_val);break;
    case 12:led_on_N(~key_val);break;
    case 13:led_on_N(~key_val);break;
    case 14:led_on_N(~key_val);break;
    case 15:led_on_N(~key_val);break;
    case 16:led_on_N(~key_val);break;
    default:break;
   }
  }
 }
 else
 {
  cont_clock=0;
  led_on_N(0xff);
 }
}
void buzz_run(void)
{
 if(buzz==1)
 {
  buzz=2;
  relay_off();
  buzz_on();
 }
 else if(buzz==2)
 {
  buzz=0;
  relay_off();
  buzz_off();
 }
}
void uart_run(void)
{
 disp_val_none();
 disp_val[0]=rxd_data%10;
 disp_val[1]=rxd_data%100/10;
 disp_val[2]=rxd_data/100;
}
void ds18b20_run(void)
{
 disp_val_none();
 temperature=ds18b20_get();
 disp_val[0]=0x0c;
 disp_val[1]=18;
 disp_val[2]=temperature%10;
 disp_val[3]=temperature/10;
}
void ds1302_HHMMSS_run(void)
{
 disp_val_none();
 ds1302_burst_read(ds1302_time);
 disp_val[0]=ds1302_time[0]&0x0f;
 disp_val[1]=ds1302_time[0]>>4&0x0f;
 disp_val[2]=17;
 disp_val[3]=ds1302_time[1]&0x0f;
 disp_val[4]=ds1302_time[1]>>4&0x0f;
 disp_val[5]=17;
 disp_val[6]=ds1302_time[2]&0x0f;
 disp_val[7]=ds1302_time[2]>>4&0x0f;
}
void ds1302_week_run(void)
{
 disp_val_none();
 ds1302_burst_read(ds1302_time);
 disp_val[0]=17;
 disp_val[1]=17;
 disp_val[2]=17;
 disp_val[3]=17;
 disp_val[4]=ds1302_time[5]&0x0f;
 disp_val[5]=17;
 disp_val[6]=17;
 disp_val[7]=17;
}

void ds1302_YYMMDD_run(void)
{
 disp_val_none();
 ds1302_burst_read(ds1302_time);
 disp_val[0]=ds1302_time[3]&0x0f;
 disp_val[1]=ds1302_time[3]>>4&0x0f;
 disp_val[2]=17;
 disp_val[3]=ds1302_time[4]&0x0f;
 disp_val[4]=ds1302_time[4]>>4&0x0f;
 disp_val[5]=17;
 disp_val[6]=ds1302_time[6]&0x0f;
 disp_val[7]=ds1302_time[6]>>4&0x0f;
}
void sonic_run(void)
{
 disp_val_none();
 sonic_distance=sonic_get();
 disp_val[0]=sonic_distance%10;
 disp_val[1]=sonic_distance%100/10;
 disp_val[2]=sonic_distance%1000/100;
 disp_val[3]=sonic_distance%10000/1000;
 disp_val[4]=sonic_distance/10000;
}


void e2_run(void)
{
 static uchar i=0;
 disp_val_none();
 e2_write(0x00,e2_write_data,sizeof(e2_write_data));
 e2_read(0x00,e2_read_data,sizeof(e2_read_data));
 disp_val[0]=e2_read_data[0]%10;
 disp_val[1]=e2_read_data[0]%100/10;
 disp_val[2]=e2_read_data[0]/100;
 disp_val[3]=e2_read_data[1]%10;
 disp_val[4]=e2_read_data[1]%100/10;
 disp_val[5]=e2_read_data[1]/100;
 disp_val[6]=e2_read_data[2]%10;
 disp_val[7]=e2_read_data[2]%100/10;
 for(i=0;i<sizeof(e2_write_data);i++)
 {
  e2_write_data[i]++;
 }
}

void adc_run(void)
{
 disp_val_none();
 adc_get(adc_data,sizeof(adc_data));
 disp_val[0]=adc_data[page-8]%10;
 disp_val[1]=adc_data[page-8]%100/10;
 disp_val[2]=adc_data[page-8]/100;
 disp_val[3]=0x11;
 disp_val[4]=page-8;
 disp_val[5]=0x0d;
 disp_val[6]=0x0a;
 disp_val[7]=0x11;
}

void dac_run(void)
{
 disp_val_none();
 dac_set(dac_data);
 adc_get(adc_data,sizeof(adc_data));
 disp_val[0]=adc_data[0]%10;
 disp_val[1]=adc_data[0]%100/10;
 disp_val[2]=adc_data[0]/100;
 disp_val[3]=0x11;
 disp_val[4]=0x0c;
 disp_val[5]=0x0a;
 disp_val[6]=0x0d;
 disp_val[7]=0x11;
}
void pwm_run(void)
{
 static uint clock=0;
 if(pwm_flag)
 {
  if(++pwm_clock<=pwm_data)
  {
   relay_off();
   buzz_off();
   motor_on();
  }
  else if(pwm_clock>pwm_data&&pwm_clock<=100)
  {
   relay_off();
   buzz_off();
   motor_off();
  }
  else
  {
   pwm_clock=0;
   if(++clock==1000)
   {
    clock=0;
    disp_val_none();
    disp_val[0]=0x11;
    disp_val[1]=0x11;
    disp_val[2]=0x11;
    disp_val[3]=pwm_data%10;
    disp_val[4]=pwm_data%100/10;
    disp_val[5]=pwm_data/100;
    disp_val[6]=0x11;
    disp_val[7]=0x11;
   }
  }
 }
}
void Timer0_Routine(void) interrupt 1
{
 // 10us
 static uchar clock=0;
 TR0=0;
 if(++clock==100)
 {
  clock=0;
  disp_scan();
 }
 pwm_run();
 TR0=1;
}

void Timer1_Routine(void) interrupt 3
{
 // 50ms
 static uint clock=0;
 TR1=0;
 key_scan();
 trg_run();
 trg_double_run();
 cont_run();
 relay_off();
 buzz_off();
 motor_off();
 buzz_run();
 if(++clock==20)
 {
  clock=0;
  switch(page)
  {
   case 1:pwm_flag=0;uart_run();break;
   case 2:pwm_flag=0;ds18b20_run();break;
   case 3:pwm_flag=0;ds1302_HHMMSS_run();break;
   case 4:pwm_flag=0;ds1302_week_run();break;
   case 5:pwm_flag=0;ds1302_YYMMDD_run();break;
   case 6:pwm_flag=0;sonic_run();break;
   case 7:pwm_flag=0;e2_run();break;
   case 8:pwm_flag=0;adc_run();break;
   case 9:pwm_flag=0;adc_run();break;
   case 10:pwm_flag=0;adc_run();break;
   case 11:pwm_flag=0;adc_run();break;
   case 12:pwm_flag=0;dac_run();break;
   case 13:pwm_flag=1;break;
   default:break;
  }
 }
 TR1=1;
}

void Uart(void) interrupt 4
{
 REN=0;
 if(RI)
 {
  RI=0;
  rxd_data=SBUF;
  SBUF=rxd_data;
 }
 if(TI)
 {
  TI=0;
 }
 REN=1;
}

//void Timer2_Routine(void) interrupt 12
//{
// //50ms
// AUXR&=0xef;
//
// AUXR|=0x10;
//}
```

### hc138.c

**`hc138.c`**

```c
#include "common.h"

#define HC138 P2

void hc138Init(void)
{
 HC138&=0x1f;
}

void hc138_none(void)
{
 HC138&=0x1f;
}

void hc138_led(void)
{
 HC138&=0x1f;
 HC138|=0x80;
}

void hc138_drivers(void)
{
 HC138&=0x1f;
 HC138|=0xa0;
}

void hc138_bit(void)
{
 HC138&=0x1f;
 HC138|=0xc0;
}

void hc138_seg(void)
{
 HC138&=0x1f;
 HC138|=0xe0;
}
```

### led.c

**`led.c`**

```c
#include "common.h"

#define LED P0

void ledInit(void)
{
 LED=0xff;
 hc138_led();
 hc138_none();
}

void led_on_N(uchar led)
{
 LED=led;
 hc138_led();
 hc138_none();
}
```

### drivers.c

**`drivers.c`**

```c
#include "common.h"

sbit RELAY_PIN=P0^4;
sbit MOTOR_PIN=P0^5;
sbit BUZZ_PIN=P0^6;

void relayInit(void)
{
 RELAY_PIN=0;
 hc138_drivers();
 hc138_none();
}

void relay_off(void)
{
 RELAY_PIN=0;
 hc138_drivers();
 hc138_none();
}

void motorInit(void)
{
 MOTOR_PIN=0;
 hc138_drivers();
 hc138_none();
}

void motor_on(void)
{
 MOTOR_PIN=1;
 hc138_drivers();
 hc138_none();
}

void motor_off(void)
{
 MOTOR_PIN=0;
 hc138_drivers();
 hc138_none();
}

void buzzInit(void)
{
 BUZZ_PIN=0;
 hc138_drivers();
 hc138_none();
}

void buzz_on(void)
{
 BUZZ_PIN=1;
 hc138_drivers();
 hc138_none();
}

void buzz_off(void)
{
 BUZZ_PIN=0;
 hc138_drivers();
 hc138_none();
}
```

### digital_tube.c

**`digital_tube.c`**

```c
#include "common.h"

#define SEG P0
#define BIT P0

uchar seg_tab[20]={0xc0,0xf9,0xa4,0xb0,0x99,
            0x92,0x82,0xf8,0x80,0x90,
            0x88,0x83,0xc6,0xa1,0x86,0x8e,
            0x7f,0xbf,0x9c,0xff};//0~9,a~f,.,-,o,none
uchar bit_tab[9]={0x80,0x40,0x20,0x10,0x08,0x04,0x02,0x01,0x00};
uchar disp_val[8]={seg_tab_none,seg_tab_none,seg_tab_none,seg_tab_none,
          seg_tab_none,seg_tab_none,seg_tab_none,seg_tab_none,};

void disp_scan(void)
{
 static uchar pointer=0;
 SEG=seg_tab[seg_tab_none];
 hc138_seg();
 SEG=seg_tab[disp_val[pointer]];
 hc138_none();
 BIT=bit_tab[bit_tab_none];
 hc138_bit();
 BIT=bit_tab[pointer];
 hc138_none();
 if(++pointer==sizeof(disp_val))
 {
  pointer=0;
 }
}

void disp_val_none(void)
{
 uchar i;
 for(i=0;i<sizeof(disp_val);i++)
 {
  disp_val[i]=seg_tab_none;
 }
}
```

### key.c

**`key.c`**

```c
#include "common.h"

#define KEY P3

uchar trg,cont,trg_row,trg_column,cont_row,cont_column,key_val;

void key_scan(void)
{
 uchar readdata=0x00,P42_val,P44_val;
 KEY=0x0f;
 P42=0;
 P44=0;
 P42_val=P42;
 P44_val=P44;
 P42_val=P42_val<<6&0x40;
 P44_val=P44_val<<7&0x80;
 readdata=KEY&0x3f|P42_val|P44_val;
 readdata^=0x0f;
 trg_row=readdata&(readdata^cont_row);
 cont_row=readdata;
 KEY=0xf0;
 P42=1;
 P44=1;
 P42_val=P42;
 P44_val=P44;
 P42_val=P42_val<<6&0x40;
 P44_val=P44_val<<7&0x80;
 readdata=KEY&0x3f|P42_val|P44_val;
 readdata^=0xf0;
 trg_column=readdata&(readdata^cont_column);
 cont_column=readdata;
 trg=trg_row|trg_column;
 cont=cont_row|cont_column;
 switch(trg)
 {
  case 0x81:key_val=1;break;
  case 0x41:key_val=2;break;
  case 0x21:key_val=3;break;
  case 0x11:key_val=4;break;
  case 0x82:key_val=5;break;
  case 0x42:key_val=6;break;
  case 0x22:key_val=7;break;
  case 0x12:key_val=8;break;
  case 0x84:key_val=9;break;
  case 0x44:key_val=10;break;
  case 0x24:key_val=11;break;
  case 0x14:key_val=12;break;
  case 0x88:key_val=13;break;
  case 0x48:key_val=14;break;
  case 0x28:key_val=15;break;
  case 0x18:key_val=16;break;
  default:break;
 }
 KEY=0xff;
}
```

### ds18b20.c

**`ds18b20.c`**

```c
#include "common.h"

sbit DQ=P1^4;

void Delay500us()  //@11.0592MHz
{
 unsigned char i, j;

 _nop_();
 _nop_();
 i = 6;
 j = 93;
 do
 {
  while (--j);
 } while (--i);
}

void Delay50us()  //@11.0592MHz
{
 unsigned char i, j;

 _nop_();
 i = 1;
 j = 134;
 do
 {
  while (--j);
 } while (--i);
}

void ds18b20_start(void)
{
 DQ=1;
 DQ=0;
 Delay500us();
 DQ=1;
 Delay50us();
 while(~DQ);
}

void ds18b20_write(uchar dat)
{
 static uchar mask=0x00;
 DQ=1;
 for(mask=0x01;mask;mask<<=1)
 {
  DQ=0;
  DQ=dat&mask;
  Delay50us();
  Delay50us();
  DQ=1;
 }
 DQ=1;
}

uchar ds18b20_read(void)
{
 static uchar mask=0x00,val=0;
 DQ=1;
 for(mask=0x01;mask;mask<<=1)
 {
  DQ=0;
  DQ=1;
  if(DQ)
   val|=mask;
  else
   val&=~mask;
  Delay50us();
  Delay50us();
 }
 DQ=1;
 return val;
}

void ds18b20Init(void)
{
 ds18b20_start();
 ds18b20_write(0xcc);
 ds18b20_write(0x44);
}

uchar ds18b20_get(void)
{
 static uchar val=0,temp[2];
 ds18b20_start();
 ds18b20_write(0xcc);
 ds18b20_write(0x44);
 ds18b20_start();
 ds18b20_write(0xcc);
 ds18b20_write(0xbe);
 temp[0]=ds18b20_read();
 temp[1]=ds18b20_read();
 val=temp[0]>>4&0x0f|temp[1]<<4&0xf0;
 return val;
}
```

### ds1302.c (burst_mode)

**`ds1302.c`**

```c
#include "common.h"

sbit CE=P1^3;
sbit SCLK=P1^7;
sbit I_O=P2^3;

uchar ds1302_init_time[7]={0x50,0x08,0x21,0x22,0x03,0x05,0x19};

void ds1302_write_byte(uchar dat)
{
 static uchar mask=0x00;
 I_O=1;
 for(mask=0x01;mask;mask<<=1)
 {
  I_O=dat&mask;
  SCLK=1;
  SCLK=0;
 }
 I_O=1;
}

uchar ds1302_read_byte(void)
{
 static uchar mask=0x00,val=0;
 I_O=1;
 for(mask=0x01;mask;mask<<=1)
 {
  SCLK=1;
  if(I_O)
   val|=mask;
  else
   val&=~mask;
  SCLK=0;
 }
 I_O=1;
 return val;
}

void ds1302_address(uchar reg,bit read)
{
 reg<<=1;
 if(read)
  reg|=0x01;
 else
  reg&=0xfe;
 ds1302_write_byte(reg);
}

void ds1302_single_write(uchar reg,uchar dat)
{
 SCLK=0;
 I_O=0;
 CE=1;
 ds1302_address(reg,0);
 ds1302_write_byte(dat);
 CE=0;
}

uchar ds1302_single_read(uchar reg)
{
 static uchar val=0;
 SCLK=0;
 I_O=0;
 CE=1;
 ds1302_address(reg,1);
 val=ds1302_read_byte();
 CE=0;
 return val;
}

void ds1302_burst_write(uchar *dat)
{
 static uchar i=0;
 SCLK=0;
 I_O=0;
 CE=1;
 ds1302_write_byte(0xbe);
 for(i=0;i<8;i++)
  ds1302_write_byte(*dat++);
 CE=0;
}

void ds1302_burst_read(uchar *dat)
{
 static uchar i=0;
 SCLK=0;
 I_O=0;
 CE=1;
 ds1302_write_byte(0xbf);
 for(i=0;i<8;i++)
  *dat++=ds1302_read_byte();
 CE=0;
}

void ds1302Init(void)
{
 ds1302_single_write(7,0);
 if(ds1302_single_read(0)&0x80)
  ds1302_burst_write(ds1302_init_time);
}
```

### i2c.c (Page_Write, Random_Sequential_Read)

**`i2c.c`**

```c
//数据总线要释放
#include "common.h"

sbit SCL=P2^0;
sbit SDA=P2^1;

void Delay5us()  //@11.0592MHz
{
 unsigned char i;

 _nop_();
 i = 11;
 while (--i);
}

void i2c_start(void)
{
 SDA=1;
 Delay5us();
 SCL=1;
 Delay5us();
 SDA=0;
 Delay5us();
 SCL=0;
 Delay5us();
}

void i2c_stop(void)
{
 SCL=0;
 Delay5us();
 SDA=0;
 Delay5us();
 SCL=1;
 Delay5us();
 SDA=1;
 Delay5us();
}

bit i2c_write_byte(uchar dat)
{
 bit ack=1;
 static uchar mask=0x00;
 SDA=1;
 Delay5us();
 for(mask=0x80;mask;mask>>=1)
 {
  SDA=dat&mask;
  Delay5us();
  SCL=1;
  Delay5us();
  SCL=0;
  Delay5us();
 }
 SDA=1;
 Delay5us();
 SCL=1;
 Delay5us();
 ack=SDA;
 SCL=0;
 Delay5us();
 return ack;
}

uchar i2c_read_byte_ack(void)
{
 static uchar mask=0x00,val=0;
 SDA=1;
 Delay5us();
 for(mask=0x80;mask;mask>>=1)
 {
  SCL=1;
  Delay5us();
  if(SDA)
   val|=mask;
  else
   val&=~mask;
  Delay5us();
  SCL=0;
  Delay5us();
 }
 SDA=1;
 Delay5us();
 SDA=0;
 Delay5us();
 SCL=1;
 Delay5us();
 SCL=0;
 Delay5us();
 return val;
}

uchar i2c_read_byte_nack(void)
{
 static uchar mask=0x00,val=0;
 SDA=1;
 Delay5us();
 for(mask=0x80;mask;mask>>=1)
 {
  SCL=1;
  Delay5us();
  if(SDA)
   val|=mask;
  else
   val&=~mask;
  Delay5us();
  SCL=0;
  Delay5us();
 }
 SDA=1;
 Delay5us();
 SCL=1;
 Delay5us();
 SCL=0;
 Delay5us();
 return val;
}

bit i2c_device(uchar dev,bit read)
{
 bit ack=1;
 dev<<=1;
 if(read)
  dev|=0x01;
 else
  dev&=0xfe;
 ack=i2c_write_byte(dev);
 return ack;
}

void adc_get(uchar *dat,uchar len)
{
 do{
  i2c_start();
  if(~i2c_device(0x48,0))
   break;
  i2c_stop();
 }while(1);
 i2c_write_byte(0x44);
 i2c_start();
 i2c_device(0x48,1);
 i2c_read_byte_ack();
 while(len-->1)
  *dat++=i2c_read_byte_ack();
 *dat=i2c_read_byte_nack();
 i2c_stop();
}

void dac_set(uchar dat)
{
 do{
  i2c_start();
  if(~i2c_device(0x48,0))
   break;
  i2c_stop();
 }while(1);
 i2c_write_byte(0x44);
 i2c_write_byte(dat);
 i2c_stop();
}

void e2_write(uchar word,uchar *dat,uchar len)
{
 do{
  i2c_start();
  if(~i2c_device(0x50,0))
   break;
  i2c_stop();
 }while(1);
 i2c_write_byte(word);
 while(len--)
  i2c_write_byte(*dat++);
 i2c_stop();
}

void e2_read(uchar word,uchar *dat,uchar len)
{
 do{
  i2c_start();
  if(~i2c_device(0x50,0))
   break;
  i2c_stop();
 }while(1);
 i2c_write_byte(word);
 i2c_start();
 i2c_device(0x50,1);
 while(len-->1)
  *dat++=i2c_read_byte_ack();
 *dat=i2c_read_byte_nack();
 i2c_stop();
}

//void e2_reset(void)
//{
// static uchar i=0;
// for(i=0;i<255;i++)
// {
//  e2_write(i,0);
// }
//}
```

### sonic_infra.c

**`sonic_infra.c`**

```c
#include "common.h"

sbit TX=P1^0;
sbit RX=P1^1;

uchar sonic_times=8;

void Delay10us()  //@11.0592MHz
{
 unsigned char i;

 _nop_();
 i = 25;
 while (--i);
}

void sonic_emit(uchar times)
{
 // 50KHz
 while(times--)
 {
  TX=1;
  Delay10us();
  TX=0;
  Delay10us();
 }
}

uint sonic_echo(void)
{
 static uchar tl,th;
 static uint distance,time;
 tl=TL1;
 th=TH1;
 TH1=0x00;
 TL1=0x00;
 TF1=0;
 TR1=1;
 while(RX&&~TF1);
 TR1=0;
 if(TF1)
 {
  TF1=0;
  distance=9999;
  return distance;
 }
 else
 {
  time=TH1;
  time<<=8;
  time|=TL1;
 }
 TH1=th;
 TL1=tl;
 distance=(uint)(time*0.017); // x=t*v=time/1000000*340*100/2
 return distance;
}

uint sonic_get(void)
{
 static uint distance=0;
 sonic_emit(sonic_times);
 distance=sonic_echo();
 return distance;
}
```

</br>

- [x] common.h
- [x] main.c
- [x] timer.c
- [x] hc138.c ---> **[数据手册][3]**
- [x] led.c
- [x] drivers.c
- [x] digital_tube.c
- [x] key.c
- [x] ds18b20 ---> **[数据手册][5]**
- [x] ds1302 ---> **[数据手册][6]**
- [x] IIC ---> **[数据手册(AT24C02)][7],[数据手册(PCF8591)][8]**
- [ ] sonic_infra
- [x] pwm
- [ ] 客观题

[1]: https://github.com/Tsanfer/Lanqiao_Cup_MCU_Competition/archive/Sources.zip
[2]: https://github.com/Tsanfer/Lanqiao_Cup_MCU_Competition/raw/master/Schematic_Circuit_Diagram%20_(%E7%94%B5%E8%B7%AF%E5%9B%BE)/CT107D%E7%94%B5%E8%B7%AF%E5%8E%9F%E7%90%86%E5%9B%BE.pdf
[3]: https://assets.nexperia.com/documents/data-sheet/74HC_HCT138.pdf
[4]: https://github.com/Tsanfer/Lanqiao_Cup_MCU_Competition
[5]: https://datasheets.maximintegrated.com/en/ds/DS18B20.pdf
[6]: https://datasheets.maximintegrated.com/en/ds/DS1302.pdf
[7]: http://html.alldatasheet.com/html-pdf/56063/ATMEL/AT24C02/126/1/AT24C02.html
[8]: https://www.nxp.com/docs/en/data-sheet/PCF8591.pdf
[9]: https://github.com/Tsanfer/Lanqiao_Cup_MCU_Competition/raw/master/%E7%8B%AC%E7%AB%8B%E4%B8%8B%E8%BD%BD%E7%A8%8B%E5%BA%8F(%E5%8F%AF%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E8%BF%90%E8%A1%8C)_CT107D%E8%B5%9B%E5%89%8D%E5%87%86%E5%A4%87.exe
[10]: https://github.com/Tsanfer/Lanqiao_Cup_MCU_Competition/raw/master/%E7%8B%AC%E7%AB%8B%E4%B8%8B%E8%BD%BD%E7%A8%8B%E5%BA%8F(%E5%8F%AF%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E8%BF%90%E8%A1%8C)_CT107D%E8%B5%9B%E5%89%8D%E5%87%86%E5%A4%87_%E5%90%ABUSB%E8%BD%AC%E4%B8%B2%E5%8F%A3%E9%A9%B1%E5%8A%A8.exe
