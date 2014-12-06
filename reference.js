// 펜 객체 참고 	
function tool_pencil () {
	var tool = this;
	var lx;	// last X, y and min_length of line
	var ly;
	var min_length = 3;
	this.started = false;

	this.mousedown = function (ev) {
		ctx.beginPath();
		context.moveTo(ev._x, ev._y);
		tool.started = true;
		lx = ev._x;
		ly = ev._y;
	};

	this.mousemove = function (ev) {
		if (tool.started && (Math.sqrt(Math.pow(lx - ev._x, 2) + 
			Math.pow(ly - ev._y, 2)) > min_length)) {
			ctx.lineTo(ev._x, ev._y);
		lx = ev._x;
		ly = ev._y;
		}
	};

	this.mouseup = function (ev) {
		if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
			img_update();
		}
	}
};

// 추가 html 생성코드 DocumentFragment 활용
function addColor() {	
	var colList = ["color8.png", "color9.png", "color10.png", "color11.png"
	, "color12.png", "color13.png", "color14.png", "color15.png"];
	docFrag = document.createDocumentFragment();
	var div = document.querySelector('#more_color');

	colList.forEach(function(e) { var li = document.createElement('li');
		var img = document.createElement('img');
		var br2 = document.createElement('br');
		img.src = "./img/" + e; 
		li.appendChild(img);
		docFrag.appendChild(li);
	});
	div.appendChild(docFrag);
}

// 추가 html 생성코드 inner html 활용
function addColor() {	
	var str = "";
	for (var i=2 ; i<4 ; i++) {
		str = str.concat('\n<ul class = "picker">\n');
		for (var j=0 ; j<4 ; j++) {
			str = str.concat('\n<li><img src="img/color', (i*4)+j, '.png" alt=""></li>\n');
		}
		str = str.concat('</ul>');
	}
	document.getElementById('more_color').innerHTML=str;


}

// 원을이용한 선그리기 
// calculate length and gradient of start to end
var difX = endX-startX;
var difY = endY-startY;
var powX = difX*difX;
var powY = difY*difY;
var len = Math.sqrt(powX + powY);
var grad = difY / difX;
console.log(startX, startY, endX, endY, powX, powY, len); 

// draw line by using arc
context.arc(endX, endY, thickness, 0, 2*Math.PI, false);
if (len > thickness) {	// additional arc
	for (var i = 1 ; i < len ; i+=3) {
		var addX = endX - difX/len*i;
		var addY = endY - difY/len*i;
		context.arc(addX, addY, thickness, 0, 2*Math.PI, false);
	}
}
context.fill();
context.restore();

// set start position from end position
startX = endX;
startY = endY;

// 커브로 선그리
(function() {
	
	var canvas = document.querySelector('#paint');
	var ctx = canvas.getContext('2d');
	
	var sketch = document.querySelector('#sketch');
	var sketch_style = getComputedStyle(sketch);
	canvas.width = parseInt(sketch_style.getPropertyValue('width'));
	canvas.height = parseInt(sketch_style.getPropertyValue('height'));
	
	
	// Creating a tmp canvas
	var tmp_canvas = document.createElement('canvas');
	var tmp_ctx = tmp_canvas.getContext('2d');
	tmp_canvas.id = 'tmp_canvas';
	tmp_canvas.width = canvas.width;
	tmp_canvas.height = canvas.height;
	
	sketch.appendChild(tmp_canvas);

	var mouse = {x: 0, y: 0};
	var last_mouse = {x: 0, y: 0};
	
	// Pencil Points
	var ppts = [];
	
	/* Mouse Capturing Work */
	tmp_canvas.addEventListener('mousemove', function(e) {
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
	}, false);
	
	
	/* Drawing on Paint App */
	tmp_ctx.lineWidth = 5;
	tmp_ctx.lineJoin = 'round';
	tmp_ctx.lineCap = 'round';
	tmp_ctx.strokeStyle = 'blue';
	tmp_ctx.fillStyle = 'blue';
	
	tmp_canvas.addEventListener('mousedown', function(e) {
		tmp_canvas.addEventListener('mousemove', onPaint, false);
		
		mouse.x = typeof e.offsetX !== 'undefined' ? e.offsetX : e.layerX;
		mouse.y = typeof e.offsetY !== 'undefined' ? e.offsetY : e.layerY;
		
		ppts.push({x: mouse.x, y: mouse.y});
		
		onPaint();
	}, false);
	
	tmp_canvas.addEventListener('mouseup', function() {
		tmp_canvas.removeEventListener('mousemove', onPaint, false);
		
		// Writing down to real canvas now
		ctx.drawImage(tmp_canvas, 0, 0);
		// Clearing tmp canvas
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		
		// Emptying up Pencil Points
		ppts = [];
	}, false);
	
	var onPaint = function() {
		
		// Saving all the points in an array
		ppts.push({x: mouse.x, y: mouse.y});
		
		if (ppts.length < 3) {
			var b = ppts[0];
			tmp_ctx.beginPath();
			//ctx.moveTo(b.x, b.y);
			//ctx.lineTo(b.x+50, b.y+50);
			tmp_ctx.arc(b.x, b.y, tmp_ctx.lineWidth / 2, 0, Math.PI * 2, !0);
			tmp_ctx.fill();
			tmp_ctx.closePath();
			
			return;
		}
		
		// Tmp canvas is always cleared up before drawing.
		tmp_ctx.clearRect(0, 0, tmp_canvas.width, tmp_canvas.height);
		
		tmp_ctx.beginPath();
		tmp_ctx.moveTo(ppts[0].x, ppts[0].y);
		
		for (var i = 1; i < ppts.length - 2; i++) {
			var c = (ppts[i].x + ppts[i + 1].x) / 2;
			var d = (ppts[i].y + ppts[i + 1].y) / 2;
			
			tmp_ctx.quadraticCurveTo(ppts[i].x, ppts[i].y, c, d);
		}
		
		// For the last 2 points
		tmp_ctx.quadraticCurveTo(
			ppts[i].x,
			ppts[i].y,
			ppts[i + 1].x,
			ppts[i + 1].y
		);
		tmp_ctx.stroke();
		
	};
	
}());
