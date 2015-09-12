//全局变量
var w = window;
var requestAnimationFrame = w.requestAnimationFrame 
						|| w.webkitRequestAnimationFrame 
						|| w.msRequestAnimationFrame 
						|| w.mozRequestAnimationFrame;

var then = Date.now(); //获取当前时间，不断重绘画布的时候要用
var endX = 0; //手机触屏移动时触摸点最后的位置
var getGoldTimeout; //用来接收不断生成配角对象的setInterval的返回值
var getGirlTimeout;
var getBombTimeout;
var isBombing = false; //用来记录是否与主角碰撞，来产生音效
var isGolding = 0;
var isGirling = 0;
var button = document.getElementsByTagName('button')[0];//获取按钮元素
var life = 100; //生命值
var audio = document.getElementsByTagName("audio"); //获取音频标签的数组
var canvas = document.getElementsByTagName('canvas')[0]; //生成canvas画布的标签	 
var ctx = canvas.getContext("2d"); 
var textDiv = document.getElementsByTagName('div')[0]; //获取div标签
var bTag = textDiv.getElementsByTagName('b'); //获取里面的b标签
var goldPool; //生成三个配角对象池
var girlPool; 
var bombPool;
var goldCaught = 0; //接住元宝的分数
var max = 0; //记录最高分
var keysDown = {}; //接受事件类型
var touch = { //触屏事件用到
	x: 0,
	y: 0
}
/************************************************************************/
//画布的处理
//
if (window.innerWidth > 800) {
	canvas.width = 800;
} else {
	canvas.width = window.innerWidth;
}

canvas.height = window.innerHeight - 5;		

/************************************************************************/
//事件注册函数的封装，为了兼容ie的attachEvent
function addEvent (node, type, listener) {
	if (node.addEventListener) {
		node.addEventListener(type, listener, false);
		return true;
	} else if (node.attachEvent) {
		node['e' + type + listener] = listener;
		node[type + listener] = function () {
			node['e' + type + listener] (window.event);
		}
		node.attachEvent('on' + type, node[type + listener]);
		return true;
	}
	return false;
}
//按钮注册事件
addEvent(button, 'click', function () {
	audio[0].loop = true; //背景音乐循环播放
	textDiv.className = 'divHide'; //隐藏div
	goldCaught = 0; //当前得分为0
	life = 100; //总的生命值100
	isGolding = 0; //三个配角与主角默认暂未碰撞
	isGirling = 0;
	isBombing = false
	goldPool = new Pool(12); //生成三个配角对象池，并初始化，后面的数字代表个数
	goldPool.init();
	girlPool = new Pool(5);
	girlPool.init();
	bombPool = new Pool(5);
	bombPool.init(); 
    getGold(); //生成一个元宝
   	getGirl();
   	getBomb();
    main(); //运行主函数
    audio[0].play();	//背景音乐 
})
function getGold () {
	goldPool.get();
	getGoldTimeout = setTimeout(getGold, rnd(200,1000)); //下一个元宝生成时间随机
}
function getGirl () {
	girlPool.get();
	getGirlTimeout = setTimeout(getGirl, rnd(300,1000));
}
function getBomb () {
	bombPool.get();
	getBombTimeout = setTimeout(getBomb, rnd(300, 500));
}
//移动端主角移动事件注册，记录刚刚进入触摸屏的时候的初始位置,主要用来判断是否接触到了主角
addEvent(window, "touchstart", function (e) {
	touch.x = e.touches[0].clientX;
	touch.y = e.touches[0].clientY;				
}, false);
//删除move属性，不再更新主角位置
addEvent(window, "touchend", function (e) {
	delete keysDown['move'];
}, false);
//记录手指移动的位置
addEvent(window, "touchmove", function (e) {
	e.preventDefault(); //取消掉浏览器默认事件
	endX = e.touches[0].clientX; //记录手指最后的位置
	if (isCollide(cat, touch)){
		keysDown['move'] = true; //设置move属性
	}
}, false);

//pc端键盘按下事件注册
addEvent(window, "keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);
//键盘抬起事件注册
addEvent(window, "keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

/************************************************************************/
//人物图片准备
//猫的图片
var catReady = false;
var catImage = new Image();
catImage.onload = function() {
	catReady = true;
}
catImage.src = "images/cat.png";
//元宝图片images/
var goldReady = false;
var goldImage = new Image();
goldImage.onload = function() {
	goldReady = true;
}
goldImage.src = "images/gold.png";
//炸弹图片
var bombReady = false;
var bombImage = new Image();
bombImage.onload = new function() {
	bombReady = true;
}
bombImage.src = "images/bomb.png";
//女生图片
var girlReady = false;
var girlImage = new Image();
girlImage.onload = new function() {
	girlReady = true;
}
girlImage.src = "images/girl.png";

/************************************************************************/
//主循环函数
var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000); //更新对象位置
	render(); //重新渲染画布
	monitorLife(); //监视生命值
	then = now;	
}

// 更新对象的位置
var update = function(modifier) {
	if (37 in keysDown) { //如果按下的是左键
		cat.x -= cat.speed * modifier;
	}
	if (39 in keysDown) { //如果按下的是右键
		cat.x += cat.speed * modifier;
	}
	if ('move' in keysDown) { //如果是触屏移动
		cat.x = endX;
	}
	updatePosition(goldPool); //更新对象池里面每个对象的位置
	goldPool.use(1); //检测对象池的每个对象是否即将出界或者碰撞到了主角，是的话就清理掉
	//后面的数字代表对象池的类型，针对与主角碰撞采取不同的动作	
	updatePosition(girlPool, 2); //后面的数字是加速值
	girlPool.use(2);
	isBombing = false;
	updatePosition(bombPool, 4);
	bombPool.use(3);			
}
//配角更新位置函数
var updatePosition = function(objectPoll, plus) {
	for (var i = 0; i < objectPoll.pool.length; i++){
		if (objectPoll.pool[i].inUse){
			objectPoll.pool[i].move(plus);
		} else {
			break;
		}			
	}			
}
// 渲染物体
var render = function () {
	//画布的渲染
    if (isBombing && life >= 10) {
    	ctx.fillStyle = "#e0ffff";
    } else {
   		ctx.fillStyle = '#ff9588';
   	}	
	ctx.fillRect(0,0,canvas.width, canvas.height);
	//元宝的渲染
	if (goldReady) {
		 for (var i = 0; i < goldPool.pool.length; i++){
		 	if (goldPool.pool[i].inUse) {
		 		ctx.drawImage(goldImage, goldPool.pool[i].x, goldPool.pool[i].y);
		 	} else {
		 		break; //因为采用了对象池，前半部分是激活的对象，后半部分是未激活的对象
		 	}				
		 }		
	}
	//女孩的渲染
	if (girlReady) {
		 for (var i = 0; i < girlPool.pool.length; i++){
		 	if (girlPool.pool[i].inUse) {
		 		ctx.drawImage(girlImage, girlPool.pool[i].x, girlPool.pool[i].y);
		 	} else {
		 		break;
		 	}
				
		 }			
	}
	//炸弹的渲染			
	if (bombReady) {
		 for (var i = 0; i < bombPool.pool.length; i++){
		 	if (bombPool.pool[i].inUse) {
		 		ctx.drawImage(bombImage, bombPool.pool[i].x, bombPool.pool[i].y);
		 	} else {
		 		break;
		 	}
				
		 }			
	}	
	//喵喵的渲染
	if(cat.x < 0) {
		cat.x = 0;
	} else if (cat.x > canvas.width - 75) {
		cat.x = canvas.width - 75;
	}
	if (catReady) {
		ctx.drawImage(catImage, cat.x, canvas.height-100);
	}
	//得分两个字的渲染
	ctx.fillStyle = 'black';
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = 'top';
	ctx.fillText("得分", 16, 32);
	//具体的分数渲染
	ctx.fillStyle = 'white';
	ctx.font = "40px Helvetica";
	ctx.fillText(goldCaught, 80, 25);
	// 生命值颜色的渲染
	ctx.fillStyle = "#7ccd7c";
	ctx.strokeStyle = '#000';
	ctx.linewidth = 10;
	ctx.fillRect(canvas.width - 50, 130 - life, 25, life);
	ctx.strokeRect(canvas.width - 50, 30, 25, 100);
	//如果是元宝与主角碰撞
	if (isGolding % 20 > 0) {
		ctx.fillText('+1', cat.x + 20, canvas.height - 130);
		isGolding++;
	}
	//如果是女孩与主角碰撞
	ctx.fillStyle = '#ff3030';
	if (isGirling % 20 > 0) {
		ctx.fillText('+5', cat.x + 20, canvas.height - 130);
		isGirling++;
		isGolding = 0;				
	}	
}
//监视生命值函数
function monitorLife () {
	if (life <= 0) {
		textDiv.className = ''; //显示div
		if (goldCaught > max) {
			max = goldCaught;
		}
		bTag[0].innerHTML = goldCaught;
		bTag[1].innerHTML = max;
		button.innerHTML = "再玩一次";
		audio[0].pause();
		clearTimeout(getGoldTimeout); //清除定时器
		clearTimeout(getGirlTimeout);
		clearTimeout(getBombTimeout);
	} else {
		requestAnimationFrame(main); //否则继续调用主函数
	} 
}
/************************************************************************/
//游戏对象，主角
var cat = {
	speed: 600,
	x: canvas.width / 2
}

//游戏配角
function Costar() {
  //true的话表示目前这个对象正在用
  	this.inUse = false;
	this.x = rnd(0, canvas.width - 50);
	this.y = -20;
	this.speed = 10;	
}
//以下为所有配角对象共享的方法
//初始化函数，对象激活时用到
Costar.prototype.init = function (speed) {
	speed = speed || 10;
	this.x = rnd(0, canvas.width - 50);
	this.y = -20;
	this.speed = speed;
}
//激活函数
Costar.prototype.spawn = function () {
	this.inUse = true;
}
//是否即将销毁
Costar.prototype.use = function () {
	if (isCollide(cat, this)) {
		return 1; //如果是碰到小猫了，返回1
	} else if (this.y >= canvas.height) {
		return 2;//出界了，返回2
	} else {
		return 0; //还在摄像机里，返回0
	}
}
//清除对象
Costar.prototype.clear = function() {
	this.init();
	this.inUse = false;
}; 
//移动函数
Costar.prototype.move = function(plus) {
	plus = plus || 0;
	this.y += this.speed + plus;
}

//游戏配角的对象池
function Pool (size) {
	if (!(this instanceof arguments.callee)) {
		return new Pool(size); //避免在调用Pool构造器时忘记new
	}
	this.pool = [];
	//先生成数组对象
	this.init = function () {
		for (var i = 0; i < size; i++) {
			var costar = new Costar();
			this.pool[i] = costar;
		}
	}
}
//激活一个配角函数，把对象池中最后一个初始化，并将其放到最前面
Pool.prototype.get = function () {
	if (this.pool[this.pool.length - 1].inUse) 
		return; //对象池已满
	this.pool[this.pool.length - 1].spawn();
	this.pool.unshift(this.pool.pop());
}
//检测及清理函数，清除马上要销毁的对象，并放在末尾
Pool.prototype.use = function (type) {
	var size = this.pool.length;
	for (var i = 0; i < size; i++) {
		if (this.pool[i].inUse) { //如果这个对象当前是激活状态
			if (this.pool[i].use()) { //如果这个对象即将销毁
				if (this.pool[i].use() == 1) { //如果这个对象即将销毁是因为与主角碰撞
					collideType(type);
				}
				this.pool[i].clear();
				this.pool.push((this.pool.splice(i, 1))[0]);
			}				
		} else {
			break;
		}
	}
}
//判断碰撞类型
var collideType = function (type) {
	switch (type) {
		case 1 : //碰撞元宝
			goldCaught++;
			isGolding = 1;
			if (audio[1].currentTime > 0){ //避免浏览器不兼容音频格式	
				audio[1].currentTime = 0;			
			}
			audio[1].play();
			break;
		case 2 : //碰撞红心
			goldCaught += 5;
			isGirling = 1;
			if (audio[2].currentTime > 0) {
				audio[2].currentTime = 0;			
			}
			audio[2].play();
			break;	
		case 3 : //碰撞炸弹
			life -= 10;
			isBombing = true;
			if (audio[3].currentTime > 0) {
				audio[3].currentTime = 0;				
			}
			audio[3].play();
			break;				
	}
}

//判断碰撞的函数
var isCollide = function (a, b) {
	if ( a.x <= b.x + 32
		 && b.x <= a.x + 50
		 && canvas.height - b.y <= 100
		 && b.y <= canvas.height
	) {
		return true;
	}
	return false;
}

//随机函数
function rnd(a, b) {
	return a + parseInt(Math.random() * (b - a));
}