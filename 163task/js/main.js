//$不是用的JQuery库，而是我自己封装了getElementById函数
//myJsLib.js为我自己的库函数
/**************************************************************/ 
var bar = $('bar'); //顶部通知条的元素
var shutImg = getElementsByClassName('bar-shut')[0]; //顶部通知条的关闭图片
var follow = getElementsByClassName('follow')[0]; //关注按钮元素
var hasFollowed = getElementsByClassName('hasFollowed')[0]; //关注成功后的元素
var actInt = $('account'); //登陆框账号输入框的元素
var psdInt = $('password');//密码输入框的元素
var btnSmt = $('submit');//提交按钮的元素
var	userName = MD5.md5(actInt.value); //账号数据加密
var	password = MD5.md5(psdInt.value); //密码数据加密

/**************************************************************/ 
//轮播图的图片src和a标签的href，分别存在一个数组里，通过数组下标的改变来切换图片和超链接
var srcs = ["images/banner1.jpg", "images/banner2.jpg", "images/banner3.jpg"];
var hrefs = ["http://open.163.com/", "http://study.163.com/", "http://www.icourse163.org/"];
var index = 1; //轮播图的下标,默认为0，下一个就是1，所以初始化为1
var img = getElementsByClassName('banner1')[0]; //轮播图的img标签
var anchor = getElementsByClassName('banner1')[1];	//轮播图的a标签	
var intervalImg = setInterval(takeTurns, 5000); //每隔5秒切换轮播图
var circles = getElementsByClassName('circle'); //获得图片中的三个小圆点

/**************************************************************/ 
//以下是登录框的相关元素
var login = $('login'); //登陆元素
var shutLogin = login.getElementsByTagName('div')[0]; //关闭登录框的元素
var mask = getElementsByClassName('mask')[0]; //登陆时的遮罩元素

/**************************************************************/ 
//顶部右侧导航元素
var banRights = getElementsByClassName('ban-right', getElementsByClassName('banner')[0])[0];
var bRAnchors = banRights.getElementsByTagName('a'); //顶部右侧导航超链接元素
var bRImg = banRights.getElementsByTagName('img')[0];//顶部右侧导航的图片hover元素

/**************************************************************/ 
//以下为有关课程的相关变量
var psize = 20; //每一页的课程数
var type = 10; //课程类型
var flag = 0; //1表示已经调整为窄屏布局.0表示还未调整到窄屏布局
if (window.innerWidth < 1205) {
	//如果浏览器窗口小于1205，则重新初始化参数
	psize = 15;
	flag = 1;
}
var courseParent = getElementsByClassName('course-parent')[0]; //整个课程的祖辈元素
var course = getElementsByClassName('course')[0];//课程框的爷爷元素
var tabLi = getElementsByClassName('tab', course)[0].getElementsByTagName('li');//课程类型切换元素
var courseList = getElementsByClassName('course-list')[0];  //课程框所直属的div元素
var courseUl = courseList.getElementsByTagName('ul')[0]; //课程框li标签所属的ul标签
var courseLi = [];//课程框数组，用来存放课程框
var courseLi_P = []; //课程框里面的p标签元素
var liImg = []; //整个课程框里面的img标签数组
var result; //从后台获取课程的数据
var courseTimer; //用来显示浮动框课程的计时器
var floatCourse = getElementsByClassName('floatCourse', course)[0]; //获取浮动框课程的标签

/**************************************************************/ 
//以下是分页功能的参数
var pageVol = 8; //总页数
var pagePre = $('page-pre'); //前一页
var pageNext = $('page-next');//下一页
var pageSle = 1; //当前页
var pageList = pagePre.parentNode.getElementsByTagName('li'); //包含每个页码的数组

/**************************************************************/ 
//以下是机构介绍
var orgIntro = getElementsByClassName('orgIntro')[0]; //机构介绍的祖辈元素
var orgImg = orgIntro.getElementsByTagName('img')[0]; //获取机构介绍的图片
var orgVideo = orgIntro.getElementsByTagName('video')[0]; //获取机构介绍的视频
var orgVideoPar = orgVideo.parentNode; //viedo标签的父元素
var videoImg = orgVideoPar.getElementsByTagName('img')[0]; //视频里面的关闭图标

/**************************************************************/ 
//以下是热门列表参数定义
var hotResult; //从后台获取热门列表的数据
var hotRank = getElementsByClassName('hotRank')[0]; //获取热门列表的祖辈元素
var hotImg = hotRank.getElementsByTagName('img');//热门列表的图片元素数组
var hotP = hotRank.getElementsByTagName('p');//热门列表的p标签数组


/**************************************************************/ 
//顶部通知条关闭的点击事件，生成一个本地cookie
//没有设置失效日期的话，则在本次会话结束后失效
//addEvent为我自己封装好的事件注册函数库
addEvent(shutImg, 'click', function() {	
	setCookie('top', 'shut');
	bar.style.display = 'none';
});

//检测当地是否有顶部通知条关闭的cookie，
//若有，则顶部通知条不再提示
//addLoadEvent为我自己封装好的window.onload事件
addLoadEvent(function() {
	var res = getCookie('top');
	if (res != -1) {
		bar.style.display = 'none';
	} 
});

/**************************************************************/ 
//顶部右侧导航的网易公开课，网易云课堂，中国大学Mooc的hover效果
addLoadEvent(function() {
	for (var i = 0; i < 3; i++) {
		bRAnchors[i].onmouseover = function () {
			bRImg.className = 'searchHover';
		};
		bRAnchors[i].onmouseout = function () {
			bRImg.className = 'search';
		}
	}
});

/**************************************************************/ 
//点击关注按钮事件注册
addEvent(follow, 'click', function () {
	var loginSuc = getCookie('loginSuc');
	//检测是否设置了登陆cookie
	if (loginSuc == -1) {
		//则弹出登录框，使用给定的用户名和密码（需要表单验证)
		ejectLogin();
	} else {
		//设置了的话，则直接显示关注后的按钮
		followedAfter();
	}
});

//登录框的关闭按钮点击事件注册
addEvent(shutLogin, 'click', function () {
	login.style.display = 'none';
	mask.style.display = 'none';
});

//登录框的提交按钮点击事件注册
addEvent(btnSmt, 'click', function() {
	var xhr = new XMLHttpRequest();
	//Md5加密
	userName = MD5.md5(actInt.value);
    password = MD5.md5(psdInt.value);
	xhr.open('GET', 'http://study.163.com/webDev/login.htm?userName=' + userName + '&password=' + password, true);
	xhr.send();	
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {				
				if (xhr.responseText == 1) {
					//返回的是1的话，调用关注函数
					followAPI();
				} else {
					// 否则登陆失败
					loseLogin();
				}
			} else {
				alert('网络错误：' + xhr.status);
			}
		}
	}
});

//弹出登录框
function ejectLogin() {	
	login.style.display = 'block';
	mask.style.display = 'block';
};

//设置关注API
function followAPI() {
	alert('登录成功！');
	setCookie('userName', actInt.value);
	setCookie('password', psdInt.value);
	//设置登陆cookie
	setCookie('loginSuc', 'true');
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://study.163.com/webDev/attention.htm', true);
	xhr.send();
	xhr.onreadystatechange = function() {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {
				if (xhr.responseText == 1) {
					alert('关注成功');
					//设置关注cookie
					setCookie('followSuc', 'true');
					login.style.display = 'none';
					mask.style.display = 'none';
					followedAfter();//关注成功后，显示关注成功的界面
				}
			} else {
				alert('网络错误：' + xhr.status)
			}
		}
	}
};

//登陆失败函数
function loseLogin() {
	alert('用户名或者密码错误！');
};

//关注成功后显示关注成功后的按钮
function followedAfter() {
	hasFollowed.style.display = 'inline-block';
	follow.style.display = 'none';
};


/**************************************************************/ 
//以下为轮播图的设置
//鼠标进入轮播图的时候，则暂停图片轮播
addEvent(anchor, 'mouseover', function () {
	clearInterval(intervalImg);
});

//鼠标离开轮播图的时候，则继续轮播
addEvent(anchor, 'mouseout', function () {
	intervalImg = setInterval(takeTurns, 5000);
});

//为图片中三个小圆圈添加鼠标移入事件和鼠标移出事件
for (var i = 0; i < circles.length; i++) {
	circles[i].onmouseover = imgChange(i);
	circles[i].onmouseout = function () {
		intervalImg = setInterval(takeTurns, 5000);
	}
};

//把轮播图的src和链接地址存到数组里面了，通过分别循环数组下标
//来达到轮播的目的
function takeTurns () {
	img.setAttribute('src', srcs[index]);
	anchor.setAttribute('href', hrefs[index]);
	//把小圆圈里面cir-selected类选择器去除
	for (var j = 0; j < circles.length; j++) {
		removeClassName(circles[j], 'cir-selected');
	}
	//把当前的小圆圈加上cir-selected类选择器
	circles[index].className += ' cir-selected';
	//index存放下一张要播放的图片和链接的索引
	index = (index + 1) % 3;
	//淡入函数在我myJsLib库里面
	//第一个参数为淡入元素，第二个参数为相邻两次改变透明度的间隔时间，
	//第三个参数为总共的时间
	fadein(img, 17, 500);
};

//鼠标移入事件侦听器
function imgChange(i) {
	return function () {
		// 如果鼠标指向的小圆圈不是当前页的话，则更换页面
		// 同时取消轮播，因为index存放的是下一个要播放的图片，所以i+1
		if ( (i + 1) % 3 != index) {
			index = i;
			takeTurns();
		} 
		clearInterval(intervalImg);
	}
};

/**************************************************************/ 
//创建每个课程的标签,就是产品设计或者编程语言里面的每个课程框的标签
//其中包含一个li标签，每个li标签里面又包含一个img标签和四个p标签，用来
//存放相关数据
for (var i = 0; i < psize; i++) {
	courseLi[i] = document.createElement('li');
	courseUl.appendChild(courseLi[i]);
	liImg[i] = document.createElement('img');
	courseLi[i].appendChild(liImg[i]);
	for (var j = 0; j < 4; j++) {
		var liP = document.createElement('p');
		courseLi[i].appendChild(liP);
	}
};

//课程分类切换事件注册
(function tabChanged (nodes) {
	var helper = function(i) {
		return function() {
			//如果说点击的是当前类别的话，则不做处理
			if (this.className.indexOf('tab-selected') != -1)
				return;	
			//另外一个标签设置为非当前模式，本身设置为当前模式
			tabLi[(i + 1) % tabLi.length].className = '';
			this.className = 'tab-selected';
			//课程类别的改变
			type = (i + 1) * 10;
			//获取第一页元素
			getCourse(1);			
			pageList[pageSle].className = ''; //之前的当前页的选中效果取消
			pageSle = 1; //当前页设置为1			
			pageList[pageSle].className = 'page-selected'; //当前页设置为选中效果
		};
	};
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].onclick = helper(i); //事件注册函数，必须传入参数进去，形成自己的函数作用域，否则i一直为2
	}
}) (tabLi);	


//window登陆事件注册，默认产品设计显示第一页的课程
addLoadEvent(function () {
	//获取第一页课程
	getCourse(1);
	//每个课程框都设置mouseover事件，mouseout事件,
	//来显示浮动框和取消浮动框
	//我设置了进入后隔500ms显示浮动框，若在这之内又离开了课程框
	//则就不显示浮动框了
	for (var i = 0; i < courseLi.length; i++) {
		courseLi[i].onmouseover = mouseroverCourse(i);
		courseLi[i].onmouseout = mouseoutCourse(i);
	}
	//浮动框本身的mouseover mouseout事件
	floatCourse.onmouseover = function () {
		floatCourse.style.display = 'block';
	}
	//离开浮动框的时候取消浮动框
	floatCourse.onmouseout = function () {
		floatCourse.style.display = 'none';			
	}		
});



//鼠标离开课程框，取消hover效果，并清除setTimeout
function mouseoutCourse (i) {
	return function () {
		courseLi[i].getElementsByTagName('p')[0].style.color = '';	
		clearTimeout(courseTimer);
	}
};
//鼠标进入课程框,因为要传入参数进来，形成自己的变量作用域,所以是返回一个函数
function mouseroverCourse (i) {
	return function () {
		//获取浮动框的元素
		var floatP = floatCourse.getElementsByTagName('p');
		var floatImg = floatCourse.getElementsByTagName('img');
		//设置课程框的hover效果
		courseLi[i].getElementsByTagName('p')[0].style.color = '#39a030';
		//500ms后显示浮动框
		courseTimer = setTimeout(function () {
			//把课程框相对于视窗的left与top传入进去，好对浮动框课程元素进行定位
			displayCourse(courseLi[i].offsetLeft, courseLi[i].offsetTop);			
		}, 500);
		//浮动框相关数据的设置，还有添加类名，进行样式设置
		floatImg[0].src = result.list[i].middlePhotoUrl;
		floatP[0].innerHTML = result.list[i].name;
		floatP[0].className = 'title';
		floatP[1].innerHTML = result.list[i].learnerCount + '人在学';
		floatP[2].innerHTML = '发布者 ： ' + result.list[i].provider;
		if (!result.list[i].categoryName) {
			result.list[i].categoryName = '无'
		}
		floatP[3].innerHTML = '分类 ： ' + result.list[i].categoryName;
		floatP[4].innerHTML = result.list[i].description;
	}
};

//显示浮动框课程函数，采用了absolute定位
function displayCourse (left, top) {
	//因为是边框的左上角定位，而获取的是图片的左上角的位置，所以left,top要减一下
	//减去padding + border-width
	left -= 11;
	top -= 13;			
	floatCourse.style.display = 'block';
	floatCourse.style.left = left + 'px';
	floatCourse.style.top = top + 'px';
};

//从后台获取课程数据，传入需要获得的页码参数
function getCourse (pageNo) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://study.163.com/webDev/couresByCategory.htm?pageNo=' + pageNo + 
		'&psize=' + psize + '&type=' + type, true);
	xhr.send();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {				
				result = JSON.parse(xhr.responseText);
				for (var i = 0; i < psize; i++) {
					courseLi_P = courseLi[i].getElementsByTagName('p');					
					liImg[i].src = result.list[i].middlePhotoUrl;							
					courseLi_P[0].innerHTML = result.list[i].name; //填入课程名称
					courseLi_P[0].className = 'list-name'; //课程名称样式设置
					courseLi_P[1].innerHTML = result.list[i].provider;
					courseLi_P[1].className = 'list-provider';					
					courseLi_P[2].innerHTML = result.list[i].learnerCount;
					courseLi_P[2].className = 'list-learnerCount';
					courseLi_P[3].innerHTML = '￥' + result.list[i].price;
					courseLi_P[3].className = 'list-price';
				}
				
			} else {
				alert('网络错误：' + xhr.status);
			}
		}
	}
};		


/**************************************************************/ 
//下面是有关课程页码的相关的函数
//下一页的点击事件
pageNext.onclick = function() {
	if (pageSle == pageVol)
		return;
	pageSle++; //当前页加1
	pageChanged(pageSle)();//触发页面改变后的函数
};

//上一页的点击事件
pagePre.onclick = function() {
	if (pageSle == 1)
		return;
	pageSle--;
	pageChanged(pageSle)();
};

//每一页的点击事件  
for (var i = 1; i < pageList.length - 1; i++) {
	pageList[i].onclick = pageChanged(i);
};

//页面改变后的函数,本身返回一个函数，因为需要传入参数进来
function pageChanged (page) {
	return function () {
		//获取需要页码的数据
		getCourse (page);
		//每一页都设置为不选中状态			
		for (var i = 1; i < pageList.length - 1; i++){
			pageList[i].className = '';
		}
		//获取课程的这一页设置为选中状态
		pageList[page].className = 'page-selected';
		//设置好当前页
		pageSle = page;				
	}		
};

/**************************************************************/ 
//机构视频播放函数
addEvent(orgImg, 'click', function () {
	if (!orgVideo.play) {
		alert('您的浏览器不支持html5的video标签，请更新浏览器或者尝试用其他浏览器，谢谢理解!');
		return;	
	}
	//显示视频		
	orgVideoPar.className = 'videoPlay';
	// 显示遮罩
	mask.style.display = 'block';
	//播放视频
	orgVideo.play();
});

//关闭视频
addEvent(videoImg, 'click', function () {
	//取消遮罩，视频窗口消失，暂停视频
	mask.style.display = 'none';
	orgVideoPar.className = 'videoNone';
	orgVideo.pause();	
});

/**************************************************************/ 
//获取热门课程
(function getHotList (pageNo) {	
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://study.163.com/webDev/hotcouresByCategory.htm', true);
	xhr.send();
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4) {
			if (xhr.status === 200) {				
				hotResult = JSON.parse(xhr.responseText);
				updateHot();				
			} else {
				alert('网络错误：' + xhr.status);
			}
		}
	}
}) ();

//热门课程更新
function updateHot() {
	//显示10门课程
	for (var i = 0; i < 10; i++) {
		hotImg[i].src = hotResult[i].smallPhotoUrl;							
		hotP[2 * i].innerHTML = hotResult[i].name;
		hotP[2 * i + 1].innerHTML = hotResult[i].learnerCount;		
	}
	//把第一门课程删除并push到数组的最后
	hotResult.push((hotResult.splice(0, 1))[0]);
};
setInterval(updateHot, 5000);


/**************************************************************/ 
// 响应式布局,课程框显示为15个或20个
addEvent(window, 'resize', function () {
	if (window.innerWidth >= 1205) {
		//当浏览器的宽度大于等于1205px的时候，并且当前为窄屏布局的时候
		if (flag) {
		//每页的课程数设置为20个，设置当前布局为宽屏布局			
			psize = 20;
			flag = 0;
			//多生成五个li标签
			for (var i = 15; i < psize; i++) {
				courseLi[i] = document.createElement('li');
				courseUl.appendChild(courseLi[i]);
				liImg[i] = document.createElement('img');
				courseLi[i].appendChild(liImg[i]);
				for (var j = 0; j < 4; j++) {
					var liP = document.createElement('p');
					courseLi[i].appendChild(liP);
				}				
			}
			//重新获取课程数据
			getCourse(pageSle);
			//并对重新生成的那5个标签的课程框重新注册事件			
			for (var i = 15; i < courseLi.length; i++) {
				courseLi[i].onmouseover = mouseroverCourse(i);
				courseLi[i].onmouseout = mouseoutCourse(i);
			}			
		}
	} else {
		//当浏览器的窗口宽度小于1205像素，并且当前为宽屏布局的时候
		if (!flag) {
			//删除掉最后五个课程框
			for (var i = 0; i < 5; i++){
				courseUl.removeChild(courseUl.lastChild);
			}
			//设置当前布局为窄屏布局
			flag = 1;		 	
		}
		//设置每页的课程数为15个
		psize = 15;
	}
});


