/**
 * RuttEtraIzer by Felix Turner
 * www.airtight.cc
 *
 * Modified by Kenneth Gangstø and Vermund Vedøy
 *
 */

//VARS
var _stage,
_lineGroup,
_lineHolder,
_camera,
_scene,
_renderer,
_mouseX = 0,
_mouseY = 0,
_material,
_inputImage,
_stageCenterX,
_stageCenterY,
_canvas,
_context,
_imageWidth,
_imageHeight,
_stageWidth,
_stageHeight,
_enableMouseMove = false,
_xRot = 0,
_yRot = 0,

_guiOptions  = {
	stageSize:	 	1,
	scale:	 		2.0,
	scanStep: 		5,
	lineThickness:	3.0,
	opacity: 		1.0,
	depth: 			100,
	autoRotate: 	false
};

function saveImage() {
	render();
	var data = _renderer.domElement.toDataURL("image/jpeg");
	//publishPicture(data);
//	window.open(_renderer.domElement.toDataURL("image/png"));
};

function getJpegRenderer() {
	return _renderer.domElement.toDataURL("image/jpeg");
};

/**
 * Init page
 */
$(document).ready( function() {

	$(window).bind('resize', doLayout);

	// stop the user getting a text cursor
	document.onselectstart = function() {
		return false;
	};

	_stage = document.getElementById("stage");

	//init mouse listeners
	$("#stage").mousemove( onMouseMove);
	$(window).mousewheel( onMouseWheel);
	$(window).keydown(onKeyDown);
	$(window).mousedown( function() {
		_enableMouseMove = true;
	});
	$(window).mouseup( function() {
		_enableMouseMove = false;
	});

	doLayout();

	if (!Detector.webgl) {
		$("#overlay").empty();
		Detector.addGetWebGLMessage({
			parent: document.getElementById("overlay")
		});

	} else {
		initWebGL();
	}

});
function initWebGL() {

	//init camera
	_camera = new THREE.Camera(75, 16/9, 1, 3000);
	_camera.position.z = -1000;
	_scene = new THREE.Scene();

	//init renderer
	_renderer = new THREE.WebGLRenderer({
		antialias: true,
		clearAlpha: 1,
		sortObjects: false,
		sortElements: false
	});

	_lineHolder = new THREE.Object3D();
	_scene.addObject(_lineHolder);

	doLayout();

	animate();
}

function onImageLoaded() {

	// load image into canvas pixels
	_imageWidth = _inputImage.width;
	_imageHeight = _inputImage.height;
	_canvas	= document.createElement('canvas');
	_canvas.width = _imageWidth
	_canvas.height = _imageHeight;
	_context = _canvas.getContext('2d');
	_context.drawImage(_inputImage, 0, 0);
	_pixels	= _context.getImageData(0,0,_imageWidth,_imageHeight).data;

	createLines();
}

/**
 * Create Lines from image
 */
function createLines() {

	$("#overlay").hide();
	_stage.appendChild(_renderer.domElement);

	var x = 0, y = 0;

	if (_lineGroup)
		_scene.removeObject(_lineGroup);

	_lineGroup = new THREE.Object3D();

	_material = new THREE.LineBasicMaterial({
		color: 0xffffff,
		opacity: _guiOptions.opacity,
		linewidth: _guiOptions.lineThickness,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		vertexColors: true
	} );

	// go through the image pixels
	for(y = 0; y < _imageHeight; y+= _guiOptions.scanStep) {
		var geometry = new THREE.Geometry();
		for(x = 0; x < _imageWidth ; x+= _guiOptions.scanStep) {
			var color = new THREE.Color(getColor(x, y));
			var brightness = getBrightness(color);
			var posn = new THREE.Vector3(x -_imageWidth/2,y - _imageHeight/2, -brightness * _guiOptions.depth + _guiOptions.depth/2);
			geometry.vertices.push(new THREE.Vertex(posn));
			geometry.colors.push(color);
		}
		//add a line
		var line = new THREE.Line(geometry, _material );
		_lineGroup.addChild(line);
	}

	_lineHolder.addChild(_lineGroup);
}

function updateMaterial() {
	if (_material) {
		_material.opacity = _guiOptions.opacity;
		_material.linewidth = _guiOptions.lineThickness;
	}
}

function onMouseMove(event) {
	if (_enableMouseMove) {
		_mouseX = event.pageX - _stageCenterX;
		_mouseY = event.pageY - _stageCenterY;
	}
}

function onMouseWheel(e,delta) {
	_guiOptions.scale += delta * 0.1;
	//limit
	_guiOptions.scale = Math.max(_guiOptions.scale, .1);
	_guiOptions.scale = Math.min(_guiOptions.scale, 10);
}

function onKeyDown(evt) {
	//save on 'S' key
	if (event.keyCode == '83') {
		saveImage();
	}
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function degInRad(deg) {
    return deg * Math.PI / 180;
} 

function render() {

	_lineHolder.scale = new THREE.Vector3(_guiOptions.scale,_guiOptions.scale, _guiOptions.scale);

	var xrot = _mouseX/_stageWidth * Math.PI*2 + Math.PI + Math.sin(_xRot / 100) * 0.5;
	var yrot = _mouseY/_stageHeight* Math.PI*2 + Math.PI + Math.sin(_yRot / 200) * 0.25;

	_lineHolder.rotation.x += (-yrot - _lineHolder.rotation.x) * 0.3;
	_lineHolder.rotation.y += (xrot - _lineHolder.rotation.y) * 0.3;

//	_camera.rotateOnAxis((new THREE.Vector3(0, 1, 0)).normalize(), degInRad(1));

	_xRot++;
	_yRot++;

	_renderer.render(_scene, _camera);
}

function doLayout() {

	var winHeight, winWidth, containerWidth;

	//get dims
	winHeight = window.innerHeight ? window.innerHeight : $(window).height();
	winWidth = window.innerWidth ? window.innerWidth : $(window).width();

	//set container size
	containerWidth = $('#container').outerWidth();

	_stageWidth = containerWidth;
	_stageHeight = containerWidth * 9 / 16;

	//set webgl size
	if (_renderer) {
		_renderer.setSize(_stageWidth, _stageHeight);
		_camera.aspect = _stageWidth / _stageHeight;
		_camera.updateProjectionMatrix();
	}

	_stageCenterX = $('#stage').offset().left +_stageWidth / 2;
	_stageCenterY = window.innerHeight / 2
}

// Returns a hexidecimal color for a given pixel in the pixel array.
function getColor(x, y) {
	var base = (Math.floor(y) * _imageWidth + Math.floor(x)) * 4;
	var c = {
		r: _pixels[base + 0],
		g: _pixels[base + 1],
		b: _pixels[base + 2],
		a: _pixels[base + 3]
	};
	return (c.r << 16) + (c.g << 8) + c.b;
};

//return pixel brightness between 0 and 1 based on human perceptual bias
function getBrightness(c) {
	return ( 0.34 * c.r + 0.5 * c.g + 0.16 * c.b );
};

function setImage(image) {
	_inputImage = new Image();
	_inputImage.src = image;

	_inputImage.onload = function() {
		onImageLoaded();
	};
}

function setImagePixels(image) {
	_imageWidth = image.width;
	_imageHeight = image.height;
	_pixels = image.data;

	createLines();
}

function loadSample() {
	_inputImage = new Image();
	_inputImage.src = ("img/test.jpg");

	_inputImage.onload = function() {
		onImageLoaded();
	};
}

loadSample();