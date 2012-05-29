var startTime	= Date.now();
var container;
var camera, scene, renderer, stats;
var tweens = [];
var currentR = 1000;
var n = 4; 


var cube_t1 = {id:1,t:"translate",t0: 1000,t1: 3000,dxf:-5,dyf:0,dzf:5};
var cube_t4 = {id:4,t:"translate",t0: 1000,t1: 3000,dxf:6,dyf:0,dzf:-5};
var cube_t2 = {id:2,t:"scale",t0: 4000,t1: 7000,sxf:0.5,syf:1,szf:1};
var cube_t3 = {id:3,t:"rotate",t0:0, t1:6000, dgx:90,dgy:20,dgz:0};

var obj_ts1 = {id:1,obj:cube,n:5,transitions: [cube_t1,cube_t4],x0:0,y0:0,z0:-7,dx:0,dy:0,dz:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};
var obj_ts2 = {id:2,obj:cube1,n:5,transitions: [cube_t3,cube_t2],x0:100,y0:0,z0:7,dx:0,dy:0,dz:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};

var animations = [obj_ts1];


// maybe replace that by window... or something
var userOpts	= {
	range		: 800,
	duration	: 2500,
	delay		: 200,
	easing		: 'Elastic.EaseInOut'
};

function pauseAnimation(tweens){
	for (var i in tweens) {
		tweens[i].stop();
	}
}



// ## bootstrap functions
// initialiaze everything
function playAnimation(tweens){
	for(var i in tweens){
		var tween=tweens[i];
		tween.start();
	}
	

}

function stopAnimation(tweens,animations){
	pauseAnimation(tweens)
	TWEEN.removeAll();
	for(var i in animations){
		scene.removeObject(animations[i].obj);
		render.clear();
	}

}




function setupTween(obj,transition)
{
	// 
	var updateTranslation	= function(){
		obj.obj.position.x += currentT.x;
		obj.obj.position.y += currentT.y;
		obj.obj.position.z += currentT.z;
	}

	var updateRotation	= function(){
		obj.obj.rotation.x = currentR.x;
		obj.obj.rotation.y = currentR.y;
		obj.obj.rotation.z = currentR.z;
	}

	var updateScale	= function(){
		obj.obj.scale.x = currentS.x;
		obj.obj.scale.y = currentS.y;
		obj.obj.scale.z = currentS.z;
	}

	var type = transition.t;

	var tween = new TWEEN.Tween();

	var currentT = { x: 0,y:0,z:0 };
	var currentR = { x: 0,y:0,z:0 };
	var currentS = { x: 1,y:1,z:1 };


	if(type === "translate"){

	var tox = transition["dxf"];
	var toy = transition["dyf"];
	var toz = transition["dzf"];
	var t1 = transition.t1;
	var t0 = transition.t0;

	// remove previous tweens if needed
	//TWEEN.removeAll();


	
	var tos = {x:tox,y:toy,z:toz};
	
	// convert the string from dat-gui into tween.js functions 
	var easing	= TWEEN.Easing[userOpts.easing.split('.')[0]][userOpts.easing.split('.')[1]];
	// build the tween to go ahead
	tween	= new TWEEN.Tween(currentT)
		.to(tos, (t1 - t0))
		.delay(t0)
		.easing(TWEEN.Easing.Elastic.EaseInOut)
		.onUpdate(updateTranslation);
	}
	



	if(type === "rotate"){
		var tox = (transition.dgx/180)*Math.PI;
		var toy = (transition.dgy/180)*Math.PI;
		var toz = (transition.dgz/180)*Math.PI;
		var t1 = transition.t1;
		var t0 = transition.t0;



	
	var tos = {x:tox,y:toy,z:toz};

	// remove previous tweens if needed
	//TWEEN.removeAll();
	
	
	// convert the string from dat-gui into tween.js functions 
	var easing	= TWEEN.Easing[userOpts.easing.split('.')[0]][userOpts.easing.split('.')[1]];
	// build the tween to go ahead
	tween	= new TWEEN.Tween(currentR)
		.to(tos, (t1 - t0))
		.delay(t0)
		.easing(TWEEN.Easing.Elastic.EaseInOut)
		.onUpdate(updateRotation);
	}


	if(type === "scale"){
		var tox = (transition.sxf);
		var toy = (transition.syf);
		var toz = (transition.szf);
		var t1 = transition.t1;
		var t0 = transition.t0;



	
		var tos = {x:tox,y:toy,z:toz};

		// remove previous tweens if needed
		//TWEEN.removeAll();
		
		
		// convert the string from dat-gui into tween.js functions 
		var easing	= TWEEN.Easing[userOpts.easing.split('.')[0]][userOpts.easing.split('.')[1]];
		// build the tween to go ahead
		tween	= new TWEEN.Tween(currentS)
			.to(tos, (t1 - t0))
			.delay(t0)
			.easing(TWEEN.Easing.Elastic.EaseInOut)
			.onUpdate(updateScale);
	}


	

	
	return tween;
	
}

// ## =========================

// ## Tween.js Setup (End here)

// ## =========================

// # Build gui with dat.gui
function buildGui(options, callback)
{
	// collect all available easing in TWEEN library
	var easings	= {};
	Object.keys(TWEEN.Easing).forEach(function(family){
		Object.keys(TWEEN.Easing[family]).forEach(function(direction){
			var name	= family+'.'+direction;
			easings[name]	= name;
		});
	});
	// the callback notified on UI change
	var change	= function(){
		callback(options)
	}
	// create and initialize the UI
	var gui = new DAT.GUI({ height	: 4 * 32 - 1 });
	gui.add(options, 'range').name('Range coordinate').min(64).max(1280)	.onChange(change);
	gui.add(options, 'duration').name('Duration (ms)').min(100).max(4000)	.onChange(change);
	gui.add(options, 'delay').name('Delay (ms)').min(0).max(1000)		.onChange(change);
	gui.add(options, 'easing').name('Easing Curve').options(easings)	.onChange(change);
}

// ## Initialize everything
function initAnimation(animations) {
	// test if webgl is supported
	if ( ! Detector.webgl )	Detector.addGetWebGLMessage();

	// create the camera
	camera	= new THREE.Camera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 1000;
	for (var i = 0;i<10 ;i+=1) {
		geometry = new THREE.CubeGeometry( 50, 50, 50 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
		var t = {id:1,t:"translate",t0: 0,t1: 6000,dxf:-2,dyf:0,dzf:5};
		var mesh = new THREE.Mesh( geometry, material );
		var obj = {id:i,obj:mesh,n:5,transitions: [t],x0:(20*i),y0:0,z0:-7,dx:0,dy:0,dz:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};

		//animations.push(obj);
	}
	console.log(animations);

	light = new THREE.DirectionalLight( 0xffffff, 1.5 );
				light.position.set( 0, 1, 1 ).normalize();
				


	// create the Scene
	scene	= new THREE.Scene();
	scene.add(camera);
	
	//set initial state
	


	// add the object to the scene
	

	scene.add(light);

	// create the container element
	container = document.createElement( 'div' );
	document.body.appendChild( container );

	// init the WebGL renderer and append it to the Dom
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight);
	container.appendChild( renderer.domElement );
	
	// init the Stats and append it to the Dom - performance vuemeter
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '20px';
	container.appendChild( stats.domElement );
	//renderer.render(scene,camera);

	setupObjects(animations);
	addTweens(animations);
	animate()
	
	
}

function addTweens(animations){
	TWEEN.removeAll();
	for(var i in animations){
		var obj = animations[i];
		for(var j in obj.transitions){
				t = obj.transitions[j];
				var tween =  setupTween(obj,t);
				tweens.push(tween);
			}
	}
}





// ## Animate and Display the Scene
function animate() {
	// render the 3D scene
	
	// relaunch the 'timer' 
	requestAnimationFrame( animate );
	render();
	// update the stats
	stats.update();
	// update the tweens from TWEEN library
	TWEEN.update();
}

document.onkeypress=function(e){
var e=window.event || e;
var keyunicode=e.charCode;
var currentPosition = {z:(camera.position.z)};
var currentz = camera.position.z;

var changeDistance = function(){
	camera.position.z = currentPosition.z;

}



if(keyunicode === 43){
	var tos = {z: (currentz - 500)};
	var tween = new TWEEN.Tween(currentPosition)
			.to(tos, 2000)
			.delay(0)
			.easing(TWEEN.Easing.Linear.EaseNone)
			.onUpdate(changeDistance);
	tween.start();
	}

if(keyunicode === 45){
	var tos = {z: (currentz + 500)};
	var tween = new TWEEN.Tween(currentPosition)
			.to(tos, 2000)
			.delay(0)
			.easing(TWEEN.Easing.Linear.EaseNone)
			.onUpdate(changeDistance);
	tween.start();
	}


var currentRotation = {theta:0};



var changeRotation = function(){
	camera.position.x = currentR * Math.sin( currentRotation.theta );
	camera.position.z = currentR * Math.cos( currentRotation.theta );
	camera.lookAt( scene.position );
	

}

if(keyunicode === 97){

	camera	= new THREE.Camera( 60, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.x = 1000;
	camera.position.y = 200;
	scende.add(camera);
	camera.lookAt( scene.position );

	n+=1;


	var tos = { theta: Math.PI/2};
	tween = new TWEEN.Tween(currentRotation)
			.to(tos, 3000)
			.delay(0)
			.easing(TWEEN.Easing.Linear.EaseNone)
			.onUpdate(changeRotation);
			n = n%4;
			if(n === 0)
			currentR =0;
			if(n === 1)
			currentR = -1;
			if(n === 2)
			currentR= 0;
			if(n === 3)
			currentR =1;
			n+=1;
	//tween.start();
	}



}

setupObjects = function(animations){
		for (var i in animations){
		var obj = animations[i];
		var mesh = obj.obj;

		

		var x0 = obj["x0"];
		var y0 = obj.y0;
		var z0 = obj.z0;

		var sx0 = obj.sx;
		var sy0 = obj.sy;
		var sz0 = obj.sz;

		var rx0 = obj.rx;
		var ry0 = obj.ry;
		var rz0 = obj.rz;



		mesh.position.x += x0;
		mesh.position.y += y0;
		mesh.position.z += z0;

		mesh.scale.x = sx0;
		mesh.scale.y = sy0;
		mesh.scale.z = sz0;

		mesh.rotation.x += rx0;
		mesh.rotation.y += ry0;
		mesh.rotation.z += rz0;

		
		scene.add(mesh);



		
		
		
	}
}

// ## Render the 3D Scene
function render() {
	
	// actually display the scene in the Dom element
	renderer.render( scene, camera );
}