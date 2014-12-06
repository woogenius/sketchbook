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