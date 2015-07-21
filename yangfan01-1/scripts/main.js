		// var canvas = document.createElement('canvas');
		// var ctx = canvas.getContext("2d");
		// canvas.position = 'absolute';
		// canvas.display = 'block';
		// canvas.top = 0;
		// canvas.right = 0;
		// canvas.left = 0;
		// canvas.bottom = 0;
		// canvas.width = $('body').eq(0) .width;
		// canvas.height = $('body').height;
		// 
		// 
		// var canvas = document.getElementById('gameCanvas');
		// var canvas = document.getElementById('gameCanvas');
		// var ctx = canvas.getContext("2d");
		// $("body").append(canvas);
		// 
		// 
		var button = $("button:eq(0)");
		var p = $('p');
		button.click(function(event) {
			// $('div').css('display', 'none');
			$('div').addClass('divHide');
			time = totalTime;
			goldCaught = 0;
			createGold();
		    activation();
		    main();
		    timeInterval = setInterval(tick, 1000);
		    // button.addClass('btnHide');
		    // p.addClass('pHide');
		});
		function tick () {
			time--;
			if(time < 0){
				clearInterval(timeInterval);
				cancelAnimationFrame(mainFrame);
				$('div').removeClass();
				// $('div').css('display', 'flex');
				// button.removeClass();
				// p.removeClass();
				if (goldCaught > max) {
					max = goldCaught;
				}
				$('b:eq(0)').html(goldCaught);
				$('b:eq(1)').html(max);

			}
		}
		var canvas = document.createElement('canvas');		
		canvas.width = $(window).get(0).innerWidth;
		canvas.height = $(window).get(0).innerHeight - 10;
		var ctx = canvas.getContext("2d");
		$("body").append(canvas);
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
		//元宝图片
		var goldReady = false;
		var goldImage = new Image();
		goldImage.onload = function() {
			goldReady = true;
		}
		goldImage.src = "images/gold.png";
		//游戏对象
		var cat = {
			speed: 512,
			x: canvas.width / 2
		}
		// var gold = {
		// 	x: 0,
		// 	y: -30
		// }
		var goldCaught = 0;
		var keysDown = {};
		addEventListener ("keydown", function (e) {
			keysDown[e.keyCode] = true;
		}, false);
		addEventListener("keyup", function (e) {
			delete keysDown[e.keyCode];
		}, false);

		//随机函数
		function rnd(a, b) {
			return a + parseInt(Math.random() * (b - a));
		}
		// var reset = function () {
		// 	// cat.x = 
		// 	// cat.y = canvas.height;

		// 	// gold.x = rnd(0, canvas.width - 50);
		// 	// gold.y = 32 + (Math.random() * (canvas.height - 64));
		// };
		// 更新对象
		var update = function(modifier) {
			if (37 in keysDown) {
				cat.x -= cat.speed * modifier;
			}
			if (39 in keysDown) {
				cat.x += cat.speed * modifier;
			}
			for (var i = 0; i < poll.length; i++){
				if (poll[i].inUse){
					poll[i].move();
					poll[i].isOut();
				}			
			}
			for (var i = 0; i < size; i++){
				if (poll[i].inUse){
					if ( 
						cat.x <= poll[i].x + 32
						&& poll[i].x <= cat.x + 50
						&& canvas.height - poll[i].y <= 100
						&& poll[i].y <= canvas.height
					) {
						goldCaught++;
						poll[i].clear();
					}					
				}
			}				
		}
		// 渲染物体
		var render = function () {
		    ctx.fillStyle = '#ff9588';
			ctx.fillRect(0,0,canvas.width, canvas.height);
			if (goldReady) {
				 for (var i = 0; i < poll.length; i++){
				 	if(poll[i].inUse)
						ctx.drawImage(goldImage, poll[i].x, poll[i].y);
				 }			
			}
			if(cat.x < 0) {
				cat.x = 0;
			} else if (cat.x > canvas.width - 60) {
				cat.x = canvas.width - 60;
			}
			if (catReady) {
				ctx.drawImage(catImage, cat.x, canvas.height - 100);
			}
			ctx.fillStyle = 'black';
			ctx.font = "24px Helvetica";
			ctx.textAlign = "left";
			ctx.textBaseline = 'top';
			ctx.fillText("得分", 32, 32);
			ctx.fillText("时间", canvas.width - 132, 32);
			ctx.fillStyle = 'white';
			ctx.font = "40px Helvetica";
			ctx.fillText(goldCaught, 85, 25);
			ctx.fillText(time, canvas.width - 75, 25);
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

		function Gold() {
		  this.inUse = false; // Is true if the object is currently in use
		  this.x = rnd(0, canvas.width - 50);
		  this.y = -20;
		  this.move = function() {
		  	this.y += 3;
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
		function createGold() {			
			for (var i = 0; i < size; i++){
				var mygold = new Gold();
				poll.push(mygold);
			}			
			// var setTimeoutId = setTimeout(createGold, rnd(1000,3000));		
		}
		function activation() {
			for (var i = 0; i < size; i++){
				if (!poll[i].inUse){
					poll[i].inUse = true;
					break;
				}
			}
			setTimeout(activation, rnd(500,1000));
		}

		/////////////////////////////////////////////////////////////////
		var w = window;
		requestAnimationFrame = w.requestAnimationFrame 
								|| w.webkitRequestAnimationFrame 
								|| w.msRequestAnimationFrame 
								|| w.mozRequestAnimationFrame;
		var then = Date.now();
		var poll = [];
		var size = 10;
		var totalTime = 5;	
		var time = totalTime;
		var timeInterval;
		var mainFrame;
		var max = 0;

