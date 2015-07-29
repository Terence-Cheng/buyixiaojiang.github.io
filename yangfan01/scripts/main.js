		//全局变量
		var w = window;
		requestAnimationFrame = w.requestAnimationFrame 
								|| w.webkitRequestAnimationFrame 
								|| w.msRequestAnimationFrame 
								|| w.mozRequestAnimationFrame;
		var then = Date.now();
		var poll = [];
		var girlPoll = [];
		var bombPoll = [];
		var size = 10;
		var bombSize = parseInt(size / 2);
		var girlSize = parseInt(size / 4);
		var totalTime = 30;	
		var time = totalTime;
		var timeFrame;
		var mainFrame;
		var max = 0;
		var endX = 0;
		var nextAct = 0;
		var actInterval;
		var girlInterval;
		var bombInterval;
		var isBombing = false;
		var isGolding = 0;
		var isGirling = 0;
		var button = $("button:eq(0)");
		var p = $('p');
		var life = 100;
		var audio = $("audio");
		var canvas = document.createElement('canvas');	
		var ctx = canvas.getContext("2d");
		//画布的处理
		canvas.width = $(window).get(0).innerWidth;
		canvas.height = $(window).get(0).innerHeight - 10;		
		$("body").append(canvas);
		//函数执行
		createObj(poll, size);
		createObj(bombPoll, bombSize);
		createObj(girlPoll, girlSize);
		audio[0].loop = true;
		//注册事件
		button.click(function(event) {
			$('div').addClass('divHide');
			time = totalTime;
			goldCaught = 0;
			life = 100;
			isGolding = 0;
			isGirling = 0;
			unactivation();
		    actInterval = setInterval(goldActivation, rnd(200,700));
		    bombInterval = setInterval(bombActivation, rnd(500,700));
		    girlInterval = setInterval(girlActivation, rnd(1000,2000));
		    // actInterval = setInterval(goldActivation, rnd(200,700));
		    // bombInterval = setInterval(bombActivation, rnd(500,700));
		    // girlInterval = setInterval(girlActivation, rnd(1000,2000));
		    main();
		    timeFrame = requestAnimationFrame(tick);
		    audio[0].play();
		});
		//声音开关的注册
		// var radio = $('radio');
		// // radio.click(setMuteFalse);
		// radio.click('setMute()');
		// //相关的对象函数
		// //倒计时函数
		$(":radio").click(function(){
			if($(this).val() === "true")
	   			for (var i = 0; i < audio.length; i++){
					audio[i].muted = false;
				}
			else
	   			for (var i = 0; i < audio.length; i++){
					audio[i].muted = true;
				}
  		 });
		function tick () {
			// time--;
			if(life <= 0){
				cancelAnimationFrame(timeFrame);
				clearInterval(actInterval);
				clearInterval(girlInterval);
				clearInterval(bombInterval);
				cancelAnimationFrame(mainFrame);
				$('div').removeClass();
				if (goldCaught > max) {
					max = goldCaught;
				}
				$('b:eq(0)').html(goldCaught);
				$('b:eq(1)').html(max);
				$("button:eq(0)").html("再玩一次");
				audio[0].pause();
				// life = 100;
			} else {
				timeFrame = requestAnimationFrame(tick);
			}
		}	
		//背景图片
		// var bgReady = false;
		// var bgImage = new Image();
		// bgImage.onload = function() {
		// 	bgReady = true;
		// }
		// bgImage.src = "images/background.png";
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
		//爆炸后的图片
		// var bombingReady = false;
		// var bombingImage = new Image();
		// bombingImage.onload = new function() {
		// 	bombingReady = true;
		// }
		// bombingImage.src = "bombing.jpg";

		var goldCaught = 0;
		var keysDown = {};
		var touch = {
			x: 0,
			y: 0
		}

		//事件注册
		//移动端
		addEventListener ("touchstart", function (e) {
			// if (e.touches.length == 1){
			// 	if (e.touches[0].clientX > cat.x)
			// 		keysDown['right'] = true;
			// 	else {
			// 		keysDown['left'] = true;
			// 	}
			// }
			// startX = e.touches[0].clientX;
			touch.x = e.touches[0].clientX;
			touch.y = e.touches[0].clientY;				
		}, false);
		addEventListener("touchend", function (e) {
			// delete keysDown['left'];
			// delete keysDown['right'];
			// delete keysDown['moveR'];
			delete keysDown['move'];
		}, false);
		addEventListener ("touchmove", function (e) {
			e.preventDefault(); 
			endX = e.touches[0].clientX;
			if (isCollide(cat, touch)){
				keysDown['move'] = true;
			}
			// moveX = endX - startX;
			// if (moveX > 0) {
			// 	keysDown['moveR'] = true;
			// } else {
			// 	keysDown['moveL'] = true;
			// }
			// // cat.x += moveX / 15;
		}, false);
		//pc端
		addEventListener ("keydown", function (e) {
			keysDown[e.keyCode] = true;
		}, false);
		addEventListener("keyup", function (e) {
			delete keysDown[e.keyCode];
		}, false);


		// var reset = function () {
		// 	// cat.x = 
		// 	// cat.y = canvas.height;

		// 	// gold.x = rnd(0, canvas.width - 50);
		// 	// gold.y = 32 + (Math.random() * (canvas.height - 64));
		// };
		// 更新对象的位置
		var update = function(modifier) {
			if (37 in keysDown) {
				cat.x -= cat.speed * modifier;
			}
			if (39 in keysDown) {
				cat.x += cat.speed * modifier;
			}
			if ('move' in keysDown) {
				cat.x = endX;
			}
			// if ('moveL' in keysDown) {
			// 	cat.x -= cat.speed * modifier;
			// }
			// for (var i = 0; i < poll.length; i++){
			// 	if (poll[i].inUse){
			// 		poll[i].move();
			// 		poll[i].isOut();
			// 	}			
			// }
			updatePosition(poll);
			updatePosition(girlPoll,4);
			updatePosition(bombPoll,6);
			updatePosition(poll);
			for (var i = 0; i < poll.length; i++){
				if (poll[i].inUse){
					if (isCollide(cat, poll[i])) {
						goldCaught++;
						poll[i].clear();
						isGolding = 1;
						audio[3].currentTime = 0;
						audio[3].play();
					}					
				}
			}
			for (var i = 0; i < girlPoll.length; i++){
				if (girlPoll[i].inUse){
					if (isCollide(cat, girlPoll[i])) {
						goldCaught += 5;
						girlPoll[i].clear();
						isGirling = 1;
						audio[2].currentTime = 0;
						audio[2].play();
					}					
				}
			}
			isBombing = false;
			for (var i = 0; i < bombPoll.length; i++){
				if (bombPoll[i].inUse){
					if (isCollide(cat, bombPoll[i])) {
						life -= 10;
						bombPoll[i].clear();
						isBombing = true;
						audio[1].currentTime = 0;
						audio[1].play();

					}					
				}
			}						
		}
		var updatePosition = function(poll, plus) {
			for (var i = 0; i < poll.length; i++){
				if (poll[i].inUse){
					poll[i].move(plus);
					poll[i].isOut();
				}			
			}			
		}
		// 渲染物体
		var render = function () {
	        if (isBombing && life >= 10) {
	        	ctx.fillStyle = "#e0ffff";
	        } else {
		   		ctx.fillStyle = '#ff9588';
		   	}
			ctx.fillRect(0,0,canvas.width, canvas.height);
			if (goldReady) {
				 for (var i = 0; i < poll.length; i++){
				 	if(poll[i].inUse)
						ctx.drawImage(goldImage, poll[i].x, poll[i].y);
				 }			
			}
			if (girlReady) {
				 for (var i = 0; i < girlPoll.length; i++){
				 	if(girlPoll[i].inUse)
						ctx.drawImage(girlImage, girlPoll[i].x, girlPoll[i].y);
				 }			
			}			
			if (bombReady) {
				 for (var i = 0; i < bombPoll.length; i++){
				 	if(bombPoll[i].inUse)
						ctx.drawImage(bombImage, bombPoll[i].x, bombPoll[i].y);
				 }			
			}
			if(cat.x < 0) {
				cat.x = 0;
			} else if (cat.x > canvas.width - 75) {
				cat.x = canvas.width - 75;
			}
			if (catReady) {
				ctx.drawImage(catImage, cat.x, canvas.height - 100);
			}
			ctx.fillStyle = 'black';
			ctx.font = "24px Helvetica";
			ctx.textAlign = "left";
			ctx.textBaseline = 'top';
			ctx.fillText("得分", 16, 32);
			// ctx.fillText("时间", canvas.width - 132, 32);
			ctx.fillStyle = 'white';
			ctx.font = "40px Helvetica";
			ctx.fillText(goldCaught, 80, 25);
			ctx.fillStyle = '#ffd700';
			if (isGolding % 20 > 0) {
				ctx.fillText('+1', cat.x + 20, canvas.height - 130);
				isGolding++;
			}
			ctx.fillStyle = '#ff3030';
			if (isGirling % 20 > 0) {
				ctx.fillText('+5', cat.x + 20, canvas.height - 130);
				isGirling++;
				isGolding = 0;				
			}
			// if (time < 0) {
			// 	ctx.fillText(0, canvas.width - 75, 25);
			// } else {
			// 	ctx.fillText(time, canvas.width - 75, 25);
			// }
			ctx.fillStyle = "#7CCD7C";
			ctx.strokeStyle = '#000';
			ctx.linewidth = 10;
			ctx.fillRect(canvas.width - 50, 130 - life, 25, life);
			ctx.strokeRect(canvas.width - 50, 30, 25, 100);
		}
		//主循环函数
		var main = function () {
			var now = Date.now();
			var delta = now - then;
			update(delta / 1000);
			render();
			then = now;
			mainFrame = requestAnimationFrame(main);
		}
		//游戏对象
		var cat = {
			speed: 600,
			x: canvas.width / 2
		}

		function Gold() {
		  this.inUse = false; // Is true if the object is currently in use
		  this.x = rnd(0, canvas.width - 50);
		  this.y = -20;
		  this.speed = 6;
		  this.move = function(plus) {
		  	if(!plus) {
		  		plus = 0;
		  	}
		  	this.y += this.speed + plus;
		  }
		  this.isOut = function() {
		    if (this.y >= canvas.height) {
		      this.clear();
		      return true;
		    } else {
		      /*code to use object*/
		      return false;
		    }
		  };
		  this.clear = function() {
		    /*code to reset values*/
		    this.x = rnd(0, canvas.width - 50);
		    this.y = -20;
		    this.inUse = false;
		  };
		}
		//对象之间的函数
		// function createGold() {			
		// 	for (var i = 0; poll.length < size; i++){
		// 		var mygold = new Gold();
		// 		poll.push(mygold);
		// 	}			
		// 	// var setTimeoutId = setTimeout(createGold, rnd(1000,3000));		
		// }

		function createObj(poll, size) {			
			for (var i = 0; poll.length < size; i++){
				var mygold = new Gold();
				poll.push(mygold);
			}			
			// var setTimeoutId = setTimeout(createGold, rnd(1000,3000));		
		}

		function goldActivation() {
			for (var i = 0; i < poll.length; i++){
				if (!poll[i].inUse){
					poll[i].inUse = true;
					break;
				} 
			}			
			// var i = rnd(0,size);
			// if (!poll[i].inUse)
			// 	poll[i].inUse = true;
			// setTimeout(activation, rnd(500,1000));
		}
		function girlActivation() {
			for (var i = 0; i < girlPoll.length; i++){
				if (!girlPoll[i].inUse){
					girlPoll[i].inUse = true;
					break;
				} 
			}			
		}
		function bombActivation() {
			for (var i = 0; i < bombPoll.length; i++){
				if (!bombPoll[i].inUse){
					bombPoll[i].inUse = true;
					break;
				} 
			}			
		}
		function unactivation() {
			for (var i = 0; i < poll.length; i++) {
				poll[i].clear();
			}
			for (i = 0; i < girlPoll.length; i++) {
				girlPoll[i].clear();
			}
			for (i = 0; i < bombPoll.length; i++) {
				bombPoll[i].clear();
			}
		}
		//判断碰撞的函数
		var isCollide = function (a, b) {
			if ( 
				a.x <= b.x + 32
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