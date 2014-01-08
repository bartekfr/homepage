
/**
author: Bartlomiej Fryzowicz
e-mail: bfryzowicz@gmail.com
**/
(function(){
	var c = document.getElementById('myCanvas');
	if(!c) {
		return false;
	}
	var offset = $('#myCanvas').offset();
	var cTop = parseInt(offset.top, 10);
	var cLeft = parseInt(offset.left, 10);
	var ctx = c.getContext('2d');
	var mouseDown = false;
	var x0 = 0;
	var y0 = 0;
	var x = 0;
	var y = 0;
	var dx = 0;
	var dy = 0;
	var objects = [];
	var cWidth = c.width;
	var cHeight = c.height;
	var width = $('#canvas-holder').width();
	var scale = width / cWidth;
	var height = scale * cHeight;
	var clickedObject;
	c.width = width;
	c.height = height;
	ctx.scale(scale, scale);
	var objectId = 0;


	/*canvas rectangle object*/
	function createObject(active, x, y, width, height, color) {
		this.x = x;
		this.y = y;
		objectId++;
		this.name = objectId;
		this.x0 = x;
		this.y0 = y;
		this.width = width;
		this.height = height;
		this.color = color;
		this.boom = active;
		this.active = active;
		this.calculateCorners(0, 0);
		this.draw();
		if(!this.active) {
			objects.push(this);
		}
	}

	createObject.prototype.calculateCorners = function(dx, dy) {
		this.x0 = this.x;
		this.y0 = this.y;
		this.x += dx ;
		this.y += dy;
		this.cornersX = [this.x - this.width/2, this.x + this.width/2, this.x + this.width/2, this.x - this.width/2];
		this.cornersY = [this.y - this.height/2, this.y - this.height/2, this.y + this.height/2, this.y + this.height/2 ];
	};

	createObject.prototype.draw = function() {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.rect(this.cornersX[0], this.cornersY[0], this.width, this.height);
		this.clicked = ctx.isPointInPath(x*scale, y*scale);
		ctx.fill();
		ctx.strokeText(this.name, this.cornersX[0] + this.width/2 - 2, this.cornersY[0] + this.height/2 + 5);
		if(this.clicked) {
			clickedObject = this;
			x0 = x;
			y0 = y;
			mouseDown = true;
		}
		ctx.closePath();
		return this;
	};

	var object0 = new createObject(false, 100, 100, 70, 70, "rgb(0, 255, 0)");
	var object1 = new createObject(false, 400, 300, 100, 90, "rgb(255, 80, 80)");
	var object2 = new createObject(false, 220, 300, 120, 200, "rgb(180, 12, 255)");
	var object3 = new createObject(false, 500, 100, 70, 30, "rgb(45, 100, 156)");
	var object4 = new createObject(false, 350, 200, 30, 30, "rgb(244, 34, 120)");

	/*helpers */
	function checkCollision(ob0, ob1) {
		for(var i = 0; i < ob0.cornersX.length; i++) {
			var xCondition0 = ob0.cornersX[i] <= max(ob1.cornersX) && ob0.cornersX[i] >= min(ob1.cornersX);
			var yCondition0 = ob0.cornersY[i] <= max(ob1.cornersY) && ob0.cornersY[i] >= min(ob1.cornersY);
			var xCondition1 = ob1.cornersX[i] <= max(ob0.cornersX) && ob1.cornersX[i] >= min(ob0.cornersX);
			var yCondition1 = ob1.cornersY[i] <= max(ob0.cornersY) && ob1.cornersY[i] >= min(ob0.cornersY);
			if((xCondition1 && yCondition1 ) || (xCondition0 && yCondition0)) {
				ob1.calculateCorners(dx, dy);
				ob1.moved = true;
				for(var j = 0; j < objects.length; j++) {
					var current = objects[j];
					if(!current.clicked && !current.moved) {
						checkCollision(ob1, current);
					}
				}
				return true;
			}
		}
	}

	function getCurrentCursorPosition(e) {
		//hammer return clientX/Y as pageX/Y!
		x = e.pageX - cLeft + $(window).scrollLeft();
		y = e.pageY - cTop + $(window).scrollTop();
		x = x / scale;
		y = y / scale;
	}

	function calculateDeltas() {
		dx = x - x0;
		dy = y - y0;
	}

	function move(e) {
		if (mouseDown === false) {
			return false;
		}
		getCurrentCursorPosition(e);
		calculateDeltas();
		clickedObject.calculateCorners(dx, dy);
		ctx.clearRect(0, 0, width, height);
		/*objects.forEach(function(obA, i) {
			for(var j = i + 1; j < objects.length; j++) {
				var obB = objects[j];
				var res = checkCollision(obA, obB);
			}
		});*/
		for(var i = 0; i < objects.length; i++) {
			var current = objects[i];
			if(current !== clickedObject) {
				checkCollision(clickedObject, current);
			}
		}
		x0 = x;
		y0 = y;
		resetObjects();
	}

	//var touchy = ("ontouchstart" in document.documentElement)? true: false;
	var hammertime = Hammer(c, {prevent_default: true});
	hammertime.on('touch', function(e){
		e = e.gesture.center;
		drawStage(e);
	});

	hammertime.on('release', function(e){
		e = e.gesture.center;
		mouseDown = false;
	});

	hammertime.on('drag', function(e) {
		e = e.gesture.center;
		move(e);
		return false;
	});


	function drawStage(e) {
		ctx.clearRect(0, 0, width, height);
		getCurrentCursorPosition(e);
		resetObjects();

	}
	function resetObjects() {
		for(var i = 0; i < objects.length; i++) {
			objects[i].moved = false;
			objects[i].draw();
		}
	}

	function max(arr) {
		var maxi  = 0;
		for (var i = 0; i < arr.length; i++) {
			if(arr[i] > maxi) {
				maxi  = arr[i];
			}
		}
		return maxi;
	}

	function min(arr) {
		var mini  = arr[0];
		for (var i = 0; i < arr.length; i++) {
			if(arr[i] < mini) {
				mini  = arr[i];
			}
		}
		return mini;
	}
})();

