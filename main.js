window.addEventListener('load', function(e) {

	// init drawing tool
	init(); 

}, false);
	
// Drawing Tool START
var canvas, context;
var tool;
var tools = {};

function init() {
	// find canvas and get context
	canvas = document.getElementById('myCanvas');
	context = canvas.getContext('2d');

	// set canvas size
	var canvasSection = document.getElementById('canvasSection');
	var canvasSection_style = getComputedStyle(canvasSection);
	canvas.width = parseInt(canvasSection_style.width);
	canvas.height = parseInt(canvasSection_style.width)*0.56;
	debugger;

	// make pencil tool instance
	var pencilButton = document.getElementById('pencil');
	pencilButton.addEventListener('click', ev_changeTool, false);

	// for thickness picker
	var thicknessPicker = document.getElementById('thickness').querySelector('ul');
	thicknessPicker.addEventListener('click', ev_changeThickness, false);

	// for color picker
	requestAjax();
	var colorPicker = document.getElementById('color').querySelector('ul');
	colorPicker.addEventListener('click', ev_changeColor, false);

	// for new button
	var newButton = document.getElementById('new');
	newButton.addEventListener('click', ev_clearCanvas, false);

	// for color plus button
	colorPlusClicked = false;
	colorPlusButton = document.getElementById('color_plus');
	colorPlusButton.addEventListener('click', ev_showMoreColor, false);

	// default
	penThickness = 6;
	penColor = "#304959"
	tool = new tools['pencil']();

	// add event listener
	canvas.addEventListener('mousedown', ev_canvas, false);
	canvas.addEventListener('mousemove', ev_canvas, false);
	canvas.addEventListener('mouseup', ev_canvas, false);
	canvas.addEventListener('mouseout', ev_canvas, false);
}

// for changing tool
function ev_changeTool(ev) {
	if (tools[this.id]) {
		tool = new tools[this.id]();gnh(ft)
	}
}

// for handling event
function ev_canvas(ev) {
	var func = tool[ev.type];
	if (func) {
		func(ev);
	}
}

// for change thickness
function ev_changeThickness(ev) {
	var targetUrl = ev.target.src;
	if (targetUrl) {
	var targetThickness = targetUrl.substring(targetUrl.lastIndexOf("/")+1, targetUrl.lastIndexOf("."));
	}
	if (targetThickness) {
		penThickness = parseInt(targetThickness)*2;
		console.log("change thiceness to : " + penThickness);	
	}
}

// for request Ajax
function requestAjax() {
	var request = new XMLHttpRequest();
	request.open("GET", "./color.json", true);
	request.send(null);

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			colorList = JSON.parse(request.responseText);
		}
	}
}

// for change color
function ev_changeColor(ev) {
	var targetUrl = ev.target.src;
	if (targetUrl) {
	var targetColor = targetUrl.substring(targetUrl.lastIndexOf("/")+1, targetUrl.lastIndexOf("."));
	}
	if (targetColor) {
		penColor = colorList[targetColor];
		console.log("change color to : " + penColor);	
	}
}


// for clear canvas
function ev_clearCanvas(ev) {
	context.clearRect(0,0,canvas.width,canvas.height);
}

// for show more color
function ev_showMoreColor(ev) {		// using visibility
	var moreColor = document.getElementById('more_color');
	var colorPlusImg = "./img/color_plus.png";
	var colorMinusImg = "./img/color_minus.png";
	if (colorPlusClicked==false) {
		moreColor.className = "visible";	// change class to visible
		colorPlusButton.querySelector('img').src = colorMinusImg;	// change img button minus
	}
	else {
		moreColor.className = "hidden";		// change class to hidden
		colorPlusButton.querySelector('img').src = colorPlusImg;	// change img button plus
	}
	colorPlusClicked = !colorPlusClicked;
}

// pencil tool
tools.pencil = function () {
	var tool = this;
	tool.started = false;

	// array of last 5 length
	var len = [0, 0, 0, 0, 0];
	var i = 0;

	// when you start holding down the mouse button
	this.mousedown = function (ev) {
		// set start mouse position
		startX = ev.offsetX;
		startY = ev.offsetY;

		// begin path and move context to start position
		context.beginPath();
		context.moveTo(startX, startY);
		tool.started = true;
	};

	// when you drag your mouse
	// for set line width
	function setLineWidth(targetLen) {
		if (targetLen < 1) {
			return penThickness;
		}
		else {
			return (targetLen/(targetLen*targetLen+1))*2*penThickness;
		}
	}

	this.mousemove = function (ev) {
		if (tool.started) {
			// set current mouse position to end position
			var endX = ev.offsetX;
			var endY = ev.offsetY;

			// calculate length from start to end
			var difX = endX-startX;
			var difY = endY-startY;
			var powX = difX*difX;
			var powY = difY*difY;
			var currLen = Math.sqrt(powX + powY)/10;

			// put current length to array
			len[i] = currLen;
			if (i<4) {
				i++;
			} else{
				i = i-4;
			};
			// average length of last 5 length
			var aLen = (len[0]+len[1]+len[2]+len[3]+len[4])/5;
			// console.log(len[0], len[1], len[2], len[3], len[4], currLen);

			// by using lineTo 
			context.lineWidth = setLineWidth(aLen);
            context.lineCap="round";
            context.lineJoin="round";
            context.lineTo(endX, endY);
            context.strokeStyle = penColor;
            context.stroke();

            // set start position from end position
            startX = endX;
			startY = endY;

			// to renew the line
			context.beginPath();
			context.moveTo(startX, startY);			
		}
	};

	// when you release your mouse button
	this.mouseup = function(ev) {
		if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
		}
	};

	// when you move out of canvas
	this.mouseout = function(ev) {
		if (tool.started) {
			tool.mousemove(ev);
			tool.started = false;
		}
	};
}