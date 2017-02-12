---
layout: post
title: 从天猫首页右侧工具栏分析自定义滚动条
categories: CSS
description: 用CSS的方式自定义滚动条
keywords: 滚动条, scrollbar
---

# 一、先看自定义滚动条在各个浏览器的效果
* 先看chrome 下的样式

![](http://upload-images.jianshu.io/upload_images/2741651-5c577c2180d3c8bb.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

* IE下

![](http://upload-images.jianshu.io/upload_images/2741651-2d026b3f0b849b3b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

* 火狐下

![](http://upload-images.jianshu.io/upload_images/2741651-8c450c1ef3322a85.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

# 二、审查元素看代码
* 在webkit内核中是按照这么设置的

![chrome代码.png](http://upload-images.jianshu.io/upload_images/2741651-4ce9e9079337def9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

通过  -webkit-scrollbar来设置滚动条的宽度，通过-webkit-scrollbar-thumb来设置滚动块的颜色，最后通过-webkit-scrollbar-track来设置整个滚动轨道的颜色，当然其他方面的具体设置，可以参考下面的博客。
* IE 下的代码

![IE代码.png](http://upload-images.jianshu.io/upload_images/2741651-fe8d4c3987f73ec5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

通过在IE中观察发现，这句代码的作用就是鼠标未hover上去的时候，滚动条不可见，hover上去后，滚动轨道的背景色有一定的透明度，这样可以保证滚动条的风格与它所在的区块保持一致。

当然IE下对滚动条也有其他别的方面的设置，但目前发现都是基于颜色的设置，而没有宽度的设置。

具体滚动条属性的讲解中，我参考了这两篇博客，如果对滚动条的具体属性感兴趣的，可以参考下面的博客
http://www.w3cways.com/1670.html
http://www.lyblog.net/detail/314.html
* 火狐及其他浏览器中CSS设置滚动条是不起作用的

# 三、最后
除了CSS设置滚动条外，还可以通过Js来实现，或者直接用别人写的插件。
第一次写博客，有不足之处，大家多多指出。