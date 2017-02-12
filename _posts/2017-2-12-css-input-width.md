---
layout: post
title: 分析由浏览器对input框默认宽度的不同所导致的问题 
categories: CSS
description: 浏览器对input框默认宽度的不同所导致的问题。
keywords: input, width
---

> 来源：最近后端同事让我帮他修改样式的兼容性，chrome与firefox下显示的不同（只兼容这两个浏览器），究其原因，应该是两个浏览器在input(不说类型的话，默认为text，下同)默认宽度不一致导致的。

* 先看效果
    * chrome下的显示(区块宽度为1673px)
![chrome父元素.png](http://upload-images.jianshu.io/upload_images/2741651-4e54f2116001ec31.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

    * firefox下的显示(区块宽度为978px)
![火狐父元素.png](http://upload-images.jianshu.io/upload_images/2741651-55beb3a250cf279e.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
* 父元素设置display:inline-block后，其宽度由内容（子元素）决定；子元素设置百分比  ，宽度由父元素确定，这样就导致了父元素的宽度由子元素决定，而子元素的宽度由父元素决定，说的简单点
  * 父元素（inline-block）的宽度 <=  子元素宽度
  * 子元素的宽度设置为百分比 <= 父元素的宽度
  * 通过在浏览器测试，先不设置子元素宽度百分比的情况
      * 代码 
	 ```html
	 <div style="display: inline-block;border: 1px solid red;">
	      <input type="text">
	</div>
	```

    * chrome展示效果
![chrome下未定义子元素宽度的展示.png](http://upload-images.jianshu.io/upload_images/2741651-1d6005f27375b547.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    * 子元素input的宽度
![chrome下未定义子元素宽度.png](http://upload-images.jianshu.io/upload_images/2741651-639f04fc8e720ece.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    * 父元素div的宽度
![chrome下父元素宽度.png](http://upload-images.jianshu.io/upload_images/2741651-26a2510156bfcd04.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

  * 设置子元素宽度百分比
    * 先看代码 
	 ```html
	 <div style="display: inline-block;border: 1px solid red;">
		<input type="text" style="width: 50%;background: black">
	</div>
	```
    * chrome的展示效果
![chrome下的展示效果.png](http://upload-images.jianshu.io/upload_images/2741651-3b245a1f22a2ca23.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    * 子元素input的宽度
![chrome下子元素的宽度.png](http://upload-images.jianshu.io/upload_images/2741651-3158c6aa553da782.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    * 父元素div的宽度
![chrome下设置子元素宽度百分比的父元素宽度.png](http://upload-images.jianshu.io/upload_images/2741651-b07163b32b7c1c8f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)
    * 由此可见，无论子元素是否设置宽度百分比，都不影响父元素的宽度。

* 根据子元素无论是否设置宽度百分比而不影响父元素的宽度（inline-block，宽度由内容决定），可以得出如下结论：

   * 先计算父元素的宽度，不考虑子元素宽度的百分比，这样父元素的宽度就通过子元素给撑开了；由于不同浏览器默认的Input框的宽度不一样，就导致了父元素的宽度不一样
   * 然后再根据父元素的宽度来及其子元素的百分比来设置子元素的宽度。
* 分析问题来源的原因
    * 其父元素设置了display:inline-block，宽度由内容决定
        * 内容中，由于input框没有定义宽度，所以显示其默认的宽度（在火狐与谷歌中是不一致的）=> 父元素的宽度不一致
    * 子元素设置了宽度百分比，由其父元素的宽度决定 => 子元素的宽度不一致
  
* 各个浏览器下对input框的默认宽度
    * 谷歌
![chrome下input的默认宽度.png](http://upload-images.jianshu.io/upload_images/2741651-cfd1d11434273581.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

    * 火狐
![firefox下input默认宽度.png](http://upload-images.jianshu.io/upload_images/2741651-f4fd0fb8c620dda4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

    * IE
![IE10下input的默认宽度.png](http://upload-images.jianshu.io/upload_images/2741651-afd1937ed8019ed8.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

* 解决方案
    * 重置input框的宽度为数值，不要用浏览器默认的宽度，否则可能会导致在各个浏览器的表现不一致
    * 重置input的宽度为百分比，而其父元素的宽度由内容决定（比如display:inline-block），就会出现本例中的情况，此时可以定义父元素的宽度，不让其宽度由内容决定