//$不是用的JQuery库，而是我自己封装了getElementById函数
//myJsLib.js为我自己的库函数

/**************************************************************/ 
var bar = document.getElementsByTagName('header')[0]; //顶部通知条的元素
var shutImg = getElementsByClassName('header-shut')[0]; //顶部通知条的关闭图片
var follow = getElementsByClassName('follow')[0]; //关注按钮元素
var hasFollowed = getElementsByClassName('hasFollowed')[0]; //关注成功后的元素
var cancelFlw = hasFollowed.getElementsByTagName('a')[0];//获取取消关注链接

/**************************************************************/ 
//轮播图的图片src和a标签的href，分别存在一个数组里，通过数组下标的改变来切换图片和超链接
var srcs = ["images/banner1.jpg", "images/banner2.jpg", "images/banner3.jpg"];
var hrefs = ["http://open.163.com/", "http://study.163.com/", "http://www.icourse163.org/"];
var index = 1; //轮播图的下标,默认为0，下一个就是1，所以初始化为1
var bannerImg = getElementsByClassName('bannerImg')[0];
var img = bannerImg.getElementsByTagName('img')[0]; //轮播图的img标签
var anchor = bannerImg.getElementsByTagName('a')[0];	//轮播图的a标签	
var intervalImg = setInterval(takeTurns, 5000); //每隔5秒切换轮播图
var circles = getElementsByClassName('circle'); //获得图片中的三个小圆点

/**************************************************************/ 
//以下是登录框的相关元素
var login = $('login'); //登陆元素
var shutLogin = login.getElementsByTagName('i')[0]; //关闭登录框的元素
var mask = getElementsByClassName('mask')[0]; //登陆时的遮罩元素
var actInt = $('account'); //登陆框账号输入框的元素
var psdInt = $('password');//密码输入框的元素
var btnSmt = $('submit');//提交按钮的元素
var	userName = MD5.md5(actInt.value); //账号数据加密
var	password = MD5.md5(psdInt.value); //密码数据加密
var actSpan = $('actSpan'); //为了兼容IE不支持placehoder所额外加的有关帐号的span标签
var pwdSpan = $('pwdSpan'); //有关密码的span标签
/**************************************************************/ 
//顶部右侧导航元素
var banRights = getElementsByClassName('ban-right', document.getElementsByTagName('nav')[0])[0];
var bRAnchors = banRights.getElementsByTagName('a'); //顶部右侧导航超链接元素
var bRImg = banRights.getElementsByTagName('i')[0];//顶部右侧导航的图片hover元素

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
var courseUl = getElementsByClassName('course-list')[0];  //课程框所直属的ul元素
var courseLi = [];//课程框数组，用来存放课程框
var courseLi_P = []; //课程框里面的p标签元素
var liImg = []; //整个课程框里面的img标签数组
var result; //从后台获取课程的数据
var courseTimer; //用来显示浮动框课程的计时器
var floatCourse = getElementsByClassName('floatCourse', course)[0]; //获取浮动框课程的标签

/**************************************************************/ 
//以下是分页功能的参数
var maxPage = 1; //最大的页码，暂时设为1
var page = 1; //当前的页码
var maxPageTimer = setInterval(firstMaxPage,500); //当页面登陆的时候，或者刷新。要从服务器获得数据后，再更新最大页码
var tabPageTimer; //切换tab标签后，最大页码也要更新，也需要等后台数据更新后，获取到最大页码的值，再生成有关页码的标签
var pagePar = $('page');//盛放页码的父容器

/**************************************************************/ 
//以下是机构介绍
var orgIntro = getElementsByClassName('orgIntro')[0]; //机构介绍的祖辈元素
var orgImg = orgIntro.getElementsByTagName('i')[0]; //获取机构介绍的图片
var orgVideo = orgIntro.getElementsByTagName('video')[0]; //获取机构介绍的视频
var orgVideoPar = orgVideo.parentNode; //viedo标签的父元素
var videoImg = $('shutVideo');

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

//弹出登录框
function ejectLogin () {	
	login.style.display = 'block';
	mask.style.display = 'block';
};

//关注成功后显示关注成功后的按钮
function followedAfter () {
	setCookie('followSuc', 'true');
	hasFollowed.style.display = 'inline-block';
	follow.style.display = 'none';
};


//失去焦点时帐号或密码文字显示事件
addEvent(actInt, 'blur', function () {
	if (!actInt.value) {
		actSpan.style.display = 'inline-block';
		actSpan.style.color = 'red';
		actSpan.innerHTML = '请输入账号';
	}
});
addEvent(psdInt, 'blur', function () {
	if (!psdInt.value) {
		pwdSpan.style.display = 'inline-block';
		pwdSpan.style.color = 'red';
		pwdSpan.innerHTML = '请输入密码';
	}
});

//获取焦点时帐号或密码文字消失事件
addEvent(actInt, 'focus', function () {
	actSpan.style.display = 'none';
});
addEvent(psdInt, 'focus', function () {
	pwdSpan.style.display = 'none';
});


//登录框的关闭按钮点击事件注册
addEvent(shutLogin, 'click', function () {
	login.style.display = 'none';
	mask.style.display = 'none';
});

//登录框的提交按钮点击事件注册
addEvent(btnSmt, 'click', formSubmit);

//回车键提交表单的事件注册
addEvent(login, 'keyup', function (e) {
	if (e.keyCode == 13) {
		formSubmit();
	}
});

//表单提交函数
function formSubmit () {
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
					alert('用户名或者密码错误！');
				}
			} else {
				alert('网络错误：' + xhr.status);
			}
		}
	}	
};

//设置关注API
function followAPI () {
	alert('登录成功！');
	setCookie('userName', actInt.value);
	setCookie('password', psdInt.value);
	//设置登陆cookie,setCookie的原函数在库里
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

//取消关注事件注册
addEvent(cancelFlw, 'click', cancleFlwFuc);

function cancleFlwFuc () {
	// 删除关注cookie
	delCookie('followSuc');
	hasFollowed.style.display = 'none'; //已关注消失
	follow.style.display = 'inline-block';	//关注出现
};

/**************************************************************/ 
//以下为轮播图的设置
//为图片中三个小圆圈添加鼠标移入事件和鼠标移出事件
for (var i = 0; i < circles.length; i++) {
	circles[i].onmouseover = imgChange(i); //这个地方传入参数进去，形成自己的作用域，否则获取的i都是circle.length
	circles[i].onmouseout = function () {
		intervalImg = setInterval(takeTurns, 5000);
	}
};

//鼠标移入事件侦听器
function imgChange (i) {
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

//鼠标移出小圆圈，继续轮播函数
//把轮播图的src和链接地址存到数组里面了，通过分别循环数组下标
//来达到轮播的目的
function takeTurns () {
	//取得整个图片的个数
	// var length = img.length;
	//取得前一张图片的索引
	// var pre = (index + length - 1) % length;
	img.setAttribute('src', srcs[index]);
	anchor.setAttribute('href', hrefs[index]);
	//把小圆圈里面cir-selected类选择器去除
	for (var i = 0; i < 3; i++)
		removeClassName(circles[i], 'cir-selected');		
	//把当前的小圆圈加上cir-selected类选择器
	circles[index].className += ' cir-selected';
	//淡入函数在我myJsLib库里面
	//第一个参数为淡入元素，第二个参数为相邻两次改变透明度的间隔时间，
	//第三个参数为总共的时间
	// fadeout(img[pre], 20, 500);
	fadein(img, 20, 500);
	//index存放下一张要播放的图片和链接的索引
	index = (index + 1) % 3;

};

//鼠标进入轮播图的时候，则暂停图片轮播
addEvent(anchor, 'mouseover', function () {
	clearInterval(intervalImg);
});

//鼠标离开轮播图的时候，则继续轮播
addEvent(anchor, 'mouseout', function () {
	intervalImg = setInterval(takeTurns, 5000);
});

/**************************************************************/ 
// 以下为有关课程的函数
//创建每个课程的标签,就是产品设计或者编程语言里面的每个课程框的标签
//其中包含一个li标签，每个li标签里面又包含一个img标签和四个p标签，用来
//存放相关数据
for (var i = 0; i < psize; i++) {
	courseLi[i] = document.createElement('li');
	courseLi[i].id = i;//添加一个id为了在事件代理中辨别
	courseUl.appendChild(courseLi[i]);
	liImg[i] = document.createElement('img');
	// liImg[i].id = i;//添加一个id为了在事件代理中辨别
	courseLi[i].appendChild(liImg[i]);
	for (var j = 0; j < 4; j++) {
		var liP = document.createElement('p');
		// liP.id = i;//添加一个id为了在事件代理中辨别
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
			//获取第一页元素,并把result的内容清空，是因为我要根据reslut
			//是否有内容来判断是否从服务器端返回了数据,进而获取到最大页码，
			//对页码进行布局
			result = false;
			getCourse(1);//从后台获取第一页课程，具体的函数在下面
			//设置当前页码为1，tab类型切换后，默认为获取第一页的课程
			page = 1;
			//获取最大页码，通过reslut是否为空来判断
			tabPageTimer = setInterval(tabMaxPage,500); 		
		};
	};
	for (var i = 0; i < nodes.length; i++) {
		nodes[i].onclick = helper(i); //事件注册函数，必须传入参数进去，形成自己的函数作用域，否则i一直为2
	}
}) (tabLi);	

//如果从后台返回了数据，则重新布置页面，并清除定时器
function tabMaxPage() {
	if (result) {
		//这是有关页码生成的函数，在后面
		pagePar.innerHTML = pageHtml();
		clearInterval(tabPageTimer);
	}
}

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
				maxPage = result.totalPage; //获取总的页码数
				for (var i = 0; i < psize; i++) {
					courseLi_P = courseLi[i].getElementsByTagName('p');					
					liImg[i].src = result.list[i].middlePhotoUrl;							
					courseLi_P[0].innerHTML = result.list[i].name; //填入课程名称
					courseLi_P[0].className = 'list-name'; //课程名称样式设置
					courseLi_P[1].innerHTML = result.list[i].provider;
					courseLi_P[1].className = 'list-provider';					
					courseLi_P[2].innerHTML = result.list[i].learnerCount;
					courseLi_P[2].className = 'list-learnerCount';
					if (result.list[i].price == 0) {
						courseLi_P[3].innerHTML = '免费';
					} else {
						courseLi_P[3].innerHTML = '￥' + result.list[i].price;
					}					
					courseLi_P[3].className = 'list-price';
				}				
			} else {
				alert('网络错误：' + xhr.status);
			}
		}
	}
};		

//window登陆事件注册，默认产品设计显示第一页的课程
addLoadEvent(function () {
	//获取第一页课程
	getCourse(1);
	//浮动框本身的mouseover mouseout事件
	floatCourse.onmouseover = function () {
		floatCourse.style.display = 'block';
	}
	//离开浮动框的时候取消浮动框
	floatCourse.onmouseout = function () {
		floatCourse.style.display = 'none';			
	}		
});

//对每个课程li的父元素ul注册了事件，使用了事件代理
//否则的话如果对每个li元素进行事件注册，会造成事件过多，使用事件代理会简洁，方便
addEvent(courseUl, 'mouseover', function (e) {
	mouseroverCourse(e);
});

function mouseroverCourse (e) {
	var target = getEventTarget(e);
	// 判断元素类型，不是ul的话再执行函数	
	if (target.tagName.toLowerCase() === 'ul') 
		return;
	//i是用来记录到底是哪个课程框
	var i = 0;
	//如果是li元素的话，本身为其增加了id，会有一个id
	//如果不是的话，那就是其子元素,所以要获取其父元素的id
	if (target.id)
		i = target.id;
	else 
		i = target.parentNode.id;
	//获取浮动框的元素
	var floatH2 = floatCourse.getElementsByTagName('h2')[0];
	var floatP = floatCourse.getElementsByTagName('p');
	var floatImg = floatCourse.getElementsByTagName('img');
	//设置课程框的hover效果
	courseLi[i].getElementsByTagName('p')[0].style.color = '#39a030';
	//500ms后显示浮动框
	courseTimer = setTimeout(function () {
		//把课程框相对于视窗的left与top传入进去，好对浮动框课程元素进行定位
		displayCourse(courseLi[i].offsetLeft, courseLi[i].offsetTop, i);			
	}, 100);
	//浮动框相关数据的设置，还有添加类名，进行样式设置
	floatImg[0].src = result.list[i].middlePhotoUrl;
	floatH2.innerHTML = result.list[i].name;
	floatH2.className = 'title';
	floatH2.setAttribute('title', result.list[i].name);
	floatP[0].innerHTML = result.list[i].learnerCount + '人在学';
	floatP[1].innerHTML = '发布者 ： ' + result.list[i].provider;
	if (!result.list[i].categoryName) {
		result.list[i].categoryName = '无'
	}
	floatP[2].innerHTML = '分类 ： ' + result.list[i].categoryName;
	floatP[3].innerHTML = result.list[i].description;
	
};

//鼠标离开ul元素的时候取消浮动框
addEvent(courseUl, 'mouseout', function () {
	floatCourse.style.display = 'none';
});

//显示浮动框课程函数，采用了absolute定位
function displayCourse (left, top, i) {
	//因为是边框的左上角定位，而获取的是图片的左上角的位置，所以left,top要减一下
	//减去padding + border-width
	left -= 11;
	top -= 13;			
	floatCourse.style.display = 'block';
	floatCourse.style.left = left + 'px';
	floatCourse.style.top = top + 'px';
	//取消本来课程列表标题的绿色显示
	courseLi[i].getElementsByTagName('p')[0].style.color = '';
};

/**************************************************************/ 
//下面是有关课程页码的相关的函数
//第一次登陆的时候要获取最大页码，进行页码布局，通过判断reslut是否有值
//之后呢就没必要了，除非切换tab，有关切换tab我也写了个函数
function firstMaxPage() {
	if (result) {
		//执行下面的函数，进行每个页码的事件注册，也使用了事件代理
		aboutPages();
		//清除定时器
		clearInterval(maxPageTimer);
	} 		
}

function aboutPages () {
	// 生成页码标签	
	pagePar.innerHTML = pageHtml();
	var pageText = $('pageText'); //获取跳转页面的文字输入框
	var pageBtn = $('pageBtn');//获取确定跳转的按钮
	//对页码的父容器进行事件注册，使用了事件代理
	addEvent(pagePar, 'click', function (e) {
		//获取目标元素
		var target = getEventTarget(e);
		//如果是div元素，也就是父元素，或者是当前页的话，则返回，点击无效
		if (target.tagName.toLowerCase() === 'div' 
			|| target.className === 'on')
			return;
		//如果元素是前一页或者后一页的话
		if (target.className === 'pageTurn') {
			if (target.id === 'pre') { //如果点击的是前一页
				if (page > 1) {
					page--; //如果当前页大于第一页的话，则当前页-1
				} 		
			} else {
				if (page < maxPage) {
					page++;
				}						
			} 
			getCourse(page); //获取当前页的数据
			// 如果点击的不是省略号或者当前页不是第一页或者最大页的时候
		} else if (target.className != 'blank' && target.className != 'pageTurn out') {
			page = parseInt(target.innerHTML); //获取标签里面的内容
			getCourse(page); //获取课程数据
		} 
	 	pagePar.innerHTML = pageHtml(); //对页码重新进行布局
	});

	// 页码输入框回车键的注册
	addEvent(pageText, 'keyup', function (e) {	
		if (e.keyCode == 13) {
			pageBtnFuc();
		}
	});

	//页码输入后，确定按钮点击事件的注册
	addEvent(pageBtn, 'click',function () {
		pageBtnFuc();
	});

	//确定跳转页面的函数
	function pageBtnFuc() {
		//首先验证文本框的输入的数字是否合理
		var tmpPage = testPageText();
		if (tmpPage) {
			//如果合理的话，则更新当前页
			page = tmpPage;
			pageText.value = '';
		} else {
			//不合理的话则清空输入框直接返回
			pageText.value = '';
			return;
		}	
		getCourse(page);//从后台获取数据
		pagePar.innerHTML = pageHtml();	//重新布局页码标签
	}

	//验证输入的页码是否正确
	function testPageText() {
		var num = pageText.value; //获取文本框的值
		var r = /^[0-9]*[1-9][0-9]*$/;//正整数
		if (r.test(num)) { //如果文本框不为空，并且为正整数的话
			if (maxPage < num){
				num = maxPage //如果输入的页码大于最大页码，则把输入的页码变为最大页码
			}	
		} else {
			// 输入不正确的话直接返回
			return;
		}
		return num;		
	}
};

//有关页面布局的函数
function pageHtml () {//分页代码
	var pageStr = "",jj = "";
    page = parseInt(page);
    //xPage为页面中显示的最左面的页面数字
    //dPage为页面显示中最右面的页面数字
	var xPage = page - 2,dPage = page + 2;
	if(xPage < 1){
		//如果最左面的数字小于1，肯定是让最左面的数字为1
		//最右面的数字为5
		xPage = 1;
		dPage = 5;
	}
	if(dPage > maxPage){
		//如果最后边的数字大于最大的页码了,最右边的数字为最大页码
		//最左边的数字比其小4
		dPage = maxPage;
		xPage = (dPage - 4);
	}
	if(xPage < 1){
		//如果最左边的数字小于1了，最左边的数字就等于1
		xPage = 1;
	}
	//生成上一页的代码
	if (page > 1) {
		pageStr = "<a id='pre' class='pageTurn'>&lt;</a>";
	} else {
		pageStr = "<a id='pre' class='pageTurn out'>&lt;</a>";
	}
		
	if(xPage > 1){
		//如果最左边的页码大于1的话，最左边要显示1
		pageStr += "<a>1</a>";
	}
	if(xPage > 2){
		//如果最左边的页码大于2的话要显示...
		pageStr += "<a class='blank'>...</a>";
	}
	for(var j = xPage;j <= dPage;j++) {
		//生成当前页以及周围的共五个页码，（一般情况下为5个）
		pageStr += (page == j) ? " <a class=\"on\">" + j + "</a>" : " <a>" + j + "</a>";
    }
	if(dPage < maxPage - 1){
		//如果最右边的页码小于最大页-1的话，要生成...
		pageStr += "<a class='blank'>...</a>"
	}
	if(dPage < maxPage){
		//如果最右边的页码小于最大页的话，则最大页要显示
		pageStr += " <a id=maxPage>" + maxPage + "</a>";
	}
	//显示下一页
	if (page < maxPage) {
		pageStr += "<a id='next' class='pageTurn'>&gt;</a>";
	} else {
		pageStr += "<a id='next' class='pageTurn out'>&gt;</a>";
	}
	
	// pageStr += ' 跳转到  <input id="pageText" name="pageText"><a id="pageBtn" class="pageTurn">GO</a>'
	return pageStr;
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
				setInterval(updateHot, 5000);//每隔5秒更新一次课程				
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
		hotP[2 * i].setAttribute('title', hotResult[i].name);
		hotP[2 * i + 1].innerHTML = hotResult[i].learnerCount;		
	}
	//把第一门课程删除并push到数组的最后
	hotResult.push((hotResult.splice(0, 1))[0]);
};

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
				courseLi[i].id = i;
				courseUl.appendChild(courseLi[i]);
				liImg[i] = document.createElement('img');
				courseLi[i].appendChild(liImg[i]);
				for (var j = 0; j < 4; j++) {
					var liP = document.createElement('p');
					courseLi[i].appendChild(liP);
				}				
			}
			//重新获取课程数据
			result = false;
			getCourse(page);
			tabPageTimer = setInterval(tabMaxPage,500); 			
			// tabPageTimer = setInterval(tabMaxPage,500); 
			//并对重新生成的那5个标签的课程框重新注册事件			
			for (var i = 15; i < courseLi.length; i++) {
				// courseLi[i].onmouseover = mouseroverCourse(i);
				// courseLi[i].onmouseout = mouseoutCourse(i);
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
			//更新最大页面。
			psize = 15;
			flag = 1;
			result = false;
			getCourse(page);
			tabPageTimer = setInterval(tabMaxPage,500); 					 	
		}
	}
});


