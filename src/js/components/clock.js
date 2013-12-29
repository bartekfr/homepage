/*
author: Bartlomiej Fryzowicz
All rights reserved.
e-mail: bfryzowicz@gmail.com
*/
var clock;
(function($) {
	clock = function() {
		var canvas = document.getElementById('clock');
		if(!canvas) {
			return false;
		}
		var ctx = canvas.getContext('2d');
		var canvasWidth = canvas.width;
		var canvasHeight = canvas.height;
		var x0 = canvasWidth/2;
		var y0 = canvasHeight/2;
		var borderWidth = 20;

		var date = new Date();
		var s0 = date.getSeconds();
		var m0 = date.getMinutes() + s0/60;
		var h0 = date.getHours() + m0/60;

		var s0deg = s0 * 6 - 90;
		var m0deg = m0 * 6 - 90;
		var h0deg = h0 * 30 - 90;

		function update() {
			//var angle = Math.PI*2*(t * 6)/360;
			var angle = t * 6;
			drawClockFace(borderWidth);
			drawDigits();
			drawMinutes();
			drawSecHand(angle);
			drawMinHand(angle/60);
			drawHourHand(angle/3600);
		}
		var t = 0;
		update();
		setInterval(function() {
			update();
			t++;
		}, 1000);

		// drawClockFace() ---------------------------
		function drawClockFace(borderWidth) {
			ctx.beginPath();
			ctx.arc(x0,y0,x0,0,Math.PI*2,true); // Outer circle

			var radialgradient = ctx.createRadialGradient(x0, y0, x0 - borderWidth, x0, y0, x0 - 4);
			radialgradient.addColorStop(0.1,'#000');
			radialgradient.addColorStop(0.7,'#eee');
			ctx.fillStyle = radialgradient;
			ctx.fill();

			ctx.beginPath();
			ctx.arc(x0,y0,x0 - borderWidth,0,Math.PI*2,true); // Outer circle
			var lineargradient = ctx.createLinearGradient(0,0,150,150);
			lineargradient.addColorStop(0.5,'white');
			lineargradient.addColorStop(1,'#ddd');
			ctx.fillStyle = lineargradient;
			ctx.fill();

			ctx.beginPath();
			ctx.arc(x0,y0, 5,0,Math.PI*2,true); // Outer circle
			ctx.fillStyle = "#000";
			ctx.fill();

		}
		//drawDigit------------------------
		function drawDigits() {
			var r = x0 - 35;
			ctx.fillStyle = '#000000';
			ctx.font = 'bold 16px Arial, sans-serif';
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			for(var i = 1; i < 13; i++) {
				var angle = Math.PI*2*(i*30 - 90)/360;
				var x = x0 + Math.cos(angle)*r;
				var y = y0 + Math.sin(angle)*r;
				drawDigit(i, x , y);
			}


		}

		function drawDigit (number, x, y) {
			ctx.fillText(number, x, y);

		}

		function drawMinutes() {
			ctx.fillStyle = '#000000';
			var l, w;
			for (var i = 0; i < 60; i++) {
				var angle = Math.PI*2*(i*6 - 90)/360;
				ctx.save();
				ctx.translate(x0, y0);
				ctx.rotate(angle);
				if (i % 5) {
					l = 10;
					w = 1;
				} else {
					l = 5;
					w = 2;
				}
				ctx.fillRect(x0 -borderWidth - l, 0, l, w);
				ctx.restore();
			}
		}

		function drawSecHand(ang) {
			ctx.save();
			ctx.translate(x0, y0);
			ctx.rotate(rad(ang + s0deg));
			ctx.fillStyle = "#000";
			ctx.fillRect(0, 0, x0 - borderWidth - 30, 2);
			ctx.restore();
		}

		function drawMinHand(ang) {
			ctx.save();
			ctx.translate(x0, y0);
			ctx.rotate(rad(ang + m0deg));
			ctx.fillStyle = "#000";
			ctx.fillRect(0, 0 - 1, x0 - borderWidth - 45, 2);
			ctx.restore();
		}

		function drawHourHand(ang) {
			ctx.save();
			ctx.translate(x0, y0);
			ctx.rotate(rad(ang + h0deg));
			ctx.fillStyle = "#000";
			ctx.fillRect(0, 0 - 2, x0 - borderWidth - 60, 4);
			ctx.restore();
		}

		function rad(ang) {
			return Math.PI*2*(ang)/360;
		}

	};
})(jQuery);
clock();





