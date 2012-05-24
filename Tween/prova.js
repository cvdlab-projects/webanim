var camera, scene, renderer,
    light,stats,container;

//var camera90dx,camera90sx,camera180,camera0;

var cameras = [];

var animations = [];
var animationsCopy = [];
var tweens = [];
var isanimating = false;
var ispaused = false;
var isstopped = false;
var startTime = 0;
var endTime = 2001;

	function backwardCalculationScale(ts,t0){

		var obj = {x:1,y:1,z:1};
		for(var i in ts){
			var t = ts[i];
			if(t.t === "scale"){
				if(t.t1 <= t0){
				obj.x *= t.sxf;
				obj.y *= t.syf;
				obj.z *= t.szf;
				}
				
			}
			

		}
		return obj;

	}

	function backwardCalculationTranslation(ts,t0){

		var obj = {x:0,y:0,z:0};
		for(var i in ts){
			var t = ts[i];
			if(t.t === "translate"){
				if(t.t1 <= t0){
				obj.x += t.dxf;
				obj.y += t.dyf;
				obj.z += t.dzf;
				}

			}

		}
		return obj;

	}


	function playFrom(){
		if (!isanimating) {
			if(!ispaused){
				if(startTime === 0){
					meshesStartingState();
					tweens = [];
					createTweensFromTransitions();
				}
				else{
					startFromSecond(animations,startTime);
					meshesIntermediateState();
					tweens = [];
					createTweensFromTransitions();
				}

			}
			
		}
	}

	function setupScene(){

		createMeshes();
		sovrapponiEffetti(animations);
	    init(800, 600);
	    //createTweensFromTransitions();
	    meshesStartingState();
	    animate();

	}

	setupScene();

	function pause(){
		for (var i in tweens){
			tweens[i].stop();
			ispaused = true;
			isanimating = false;
		}
	}

	function play(){
		playFrom();
		
		if(!isanimating || ispaused){
			for(var i in tweens){

				tweens[i].start();	
					
			}
			isanimating = true;
		}		
	}

	function rwAnimation(){
		stop();
	}

	function ffAnimation(){
		startFromSecond(animations,endTime);
		meshesIntermediateState();
		tweens = [];
		startTime = 0;
		isanimating = false;
		ispaused = false;
		TWEEN.removeAll();
		restoreTransitions();
	}

	function stop(){
		for(var i in tweens){

				tweens[i].stop();		
		}	
		isanimating = false;
		ispaused = false;
		TWEEN.removeAll();
		restoreTransitions();
		meshesStartingState();		
		tweens = [];
		startTime = 0;
	}

	function restoreTransitions(){
		for (var i in animations) {
			
			animations[i].x0 = animationsCopy[i].x0;
			animations[i].y0 = animationsCopy[i].y0;
			animations[i].z0 = animationsCopy[i].z0;

			animations[i].dx = 0;
			animations[i].dy = 0;
			animations[i].dz = 0;

			animations[i].sx = 1;
			animations[i].sy = 1;
			animations[i].sz = 1;

			animations[i].rx = 0;
			animations[i].ry = 0;
			animations[i].rz = 0;

			var transitions = [];

			for (var j in animationsCopy[i].transitions) {
				var tt = animationsCopy[i].transitions[j];
				var obj = {};
				obj.t0 = tt.t0;
				obj.t1 = tt.t1;
				obj.id = tt.id;
				obj.t = tt.t;


				if(tt.t === "translate"){
					obj.dxf = tt.dxf;
					obj.dyf = tt.dyf;
					obj.dzf = tt.dzf;
				}

				if(tt.t === "scale"){
					obj.sxf = tt.sxf;
					obj.syf = tt.syf;
					obj.szf = tt.szf;
				}

				if(tt.t === "rotate"){
					obj.dgx = tt.dgxf;
					obj.dgy = tt.dgyf;
					obj.dgz = tt.dgzf;
				}

				transitions.push(obj);
			}

			animations[i].transitions = transitions;
			
		}

	}

	

	function createTweensFromTransitions(){
		for(var i in animations){
			var anim = animations[i];
			for (var j in anim.transitions ){
				t = anim.transitions[j];
				var tween = setupTween(anim,t);
				tweens.push(tween);
			}
		}
	}

  // TODO: createMeshes a partire da vertici/indici

    function createMeshes(){
    	for(var k = 0; k<1;k+=1){
		    for (var i = 0;i<1 ;i+=1) {
				var geometry = new THREE.CubeGeometry( 150, 150, 150 );
		        var material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
		        var mesh = new THREE.Mesh( geometry, material );
				var t = {id:1,t:"translate",t0: 0,t1: 2000,dxf:0,dyf:0,dzf:500};
				
				//var t = {id:1,t:"scale",t0: 0,t1: 2000,sxf:0.5,syf:1,szf:1};
				var t1 = {id:2,t:"scale",t0: 0,t1: 1000,sxf:2,syf:1,szf:1,ini:false};
				anim = {id:i*k+i,obj:mesh,transitions: [t],x0:-500+(151*i),y0:151*k,z0:0,dx:0,dy:0,dz:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};

				animations.push(anim);
			}
		}
    }


    function setupTween(obj,transition){

		var updateTranslation	= function(){
			obj.obj.position.x = currentT.x;
			obj.obj.position.y = currentT.y;
			obj.obj.position.z = currentT.z;
		}

		var updateRotation	= function(){
			obj.obj.rotation.x = currentR.x;
			obj.obj.rotation.y = currentR.y;
			obj.obj.rotation.z = currentR.z;
		}

		var updateScale	= function(){
			if(!transition.ini){
				transition.startx = obj.obj.scale.x;
				transition.starty = obj.obj.scale.y;
				transition.startz = obj.obj.scale.z;
				transition.ini = true;
			}
			obj.obj.scale.x = currentS.x;
			obj.obj.scale.y = currentS.y;
			obj.obj.scale.z = currentS.z;
		}

		var type = transition.t;

		var tween;

		var currentT = { x: 0,y:0,z:0 };
		var currentR = { x: 0,y:0,z:0 };
		var currentS = { x: 1,y:1,z:1 };
		


		if(type === "translate"){

			var tox = transition["dxf"];
			var toy = transition["dyf"];
			var toz = transition["dzf"];
			var t1 = transition.t1;
			var t0 = transition.t0;
			currentT = backwardCalculationTranslation(obj.transitions,t0);
			currentT.x += obj.x0 + obj.dx;
			currentT.y += obj.y0 + obj.dy;
			currentT.z += obj.z0 + obj.dz;
			var tos = {x:tox+currentT.x,y:toy+currentT.y,z:toz+currentT.z};
			tween	= new TWEEN.Tween(currentT)
				.to(tos, (t1 - t0))
				.delay(t0)
				.easing(TWEEN.Easing.Elastic.InOut)
				.onUpdate(updateTranslation);
		}
		



		if(type === "rotate"){
			var tox = (transition.dgx/180)*Math.PI;
			var toy = (transition.dgy/180)*Math.PI;
			var toz = (transition.dgz/180)*Math.PI;
			var t1 = transition.t1;
			var t0 = transition.t0;



			
			var tos = {x:tox,y:toy,z:toz};

			tween	= new TWEEN.Tween(currentR)
				.to(tos, (t1 - t0))
				.delay(t0)
				.easing(TWEEN.Easing.Elastic.InOut)
				.onUpdate(updateRotation);
		}


		if(type === "scale"){

			var tox = (transition.sxf);
			var toy = (transition.syf);
			var toz = (transition.szf);

			var t1 = transition.t1;
			var t0 = transition.t0;

			currentS = backwardCalculationScale(obj.transitions,t0);
			currentS.x *= obj.sx;
			currentS.y *= obj.sy;
			currentS.z *= obj.sz;

			var tos = {x:tox*currentS.x, y:toy*currentS.y, z:toz*currentS.z};		
			tween	= new TWEEN.Tween(currentS)
				.to(tos, (t1 - t0))
				.delay(t0)
				.easing(TWEEN.Easing.Elastic.InOut)
				.onUpdate(updateScale);
		}

		return tween;
		
	}

    function meshesStartingState(){

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

			obj.dx = 0;
			obj.dy = 0;
			obj.dz = 0;



			mesh.position.x = x0;
			mesh.position.y = y0;
			mesh.position.z = z0;
			
			mesh.scale.x = 1;
			mesh.scale.y = 1;
			mesh.scale.z = 1;

			mesh.rotation.x = 0;
			mesh.rotation.y = 0;
			mesh.rotation.z = 0;
	    }
	}


	function meshesIntermediateState(){

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


			




			mesh.position.x = x0+(obj.dx );
			mesh.position.y = y0+(obj.dy);
			mesh.position.z = z0+(obj.dz);

			mesh.scale.x = sx0;
			mesh.scale.y = sy0;
			mesh.scale.z = sz0;

			mesh.rotation.x = (rx0/180)*Math.PI;
			mesh.rotation.y = (ry0/180)*Math.PI;
			mesh.rotation.z = (rz0/180)*Math.PI;
	    }
	}


    function init(width, height, meshes) {


    	geometry = new THREE.CubeGeometry( 200, 200, 200 );
        material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );

        var mesh = new THREE.Mesh( geometry, material );

  	    //anim  = {id:1,obj:mesh,n:5,transitions: [cube_t1,cube_t4],x0:0,y0:0,z0:-7,dx:0,dy:0,dz:0,sx:1,sy:1,sz:1,rx:0,ry:0,rz:0};

  	    


    	var meshes = meshes || animations;


    	saveOriginalState();


        scene = new THREE.Scene();

        container = document.getElementById( 'container' );
//		document.body.appendChild( container );
        var divStats = document.getElementById ('stats');

//        var canvas = document.getElementById("renderingCanvas");


//        camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 10000 );
//        camera.position.z = 1500;
//        camera.position.y = 100;
//        camera.lookAt( scene.position );
//        scene.add( camera );
        
        cameras[0] = new THREE.PerspectiveCamera (45, width / height, 0.1, 10000);
        cameras[0].position = {x : 0, y : 0, z : 100};
        cameras[1] = new THREE.PerspectiveCamera (45, width / height, 0.1, 10000);
        cameras[0].position = {x : 100, y : 0, z : 0};
        cameras[2] = new THREE.PerspectiveCamera (45, width / height, 0.1, 10000);
        cameras[0].position = {x : 0, y : 0, z : -100};
        cameras[3] = new THREE.PerspectiveCamera (45, width / height, 0.1, 10000);
        cameras[0].position = {x : -100, y : 0, z : 0};
        cameras[4] = new THREE.PerspectiveCamera (45, width / height, 0.1, 10000);
        cameras[0].position = {x : 0, y : 100, z : 0};
        cameras[5] = new THREE.PerspectiveCamera (45, width / height, 0.1, 10000);
        cameras[0].position = {x : 0, y : -100, z : 0};

        camera = cameras[0];

//        camera0 = {x:0,y:100,z:1500};

//        camera90dx = {x:1500,y:100,z:0};


//        camera90sx = {x:-1500,y:100,z:0};
//        

//        camera180 = {x:0,y:100,z:-1500};




        for (var i in meshes) {
        	var m = meshes[i].obj;
        	scene.add( m );

        }

        light = new THREE.DirectionalLight( 0xffffff, 1.5 );
				light.position.set( 0, 1, 1 ).normalize();

		scene.add(light);
		
		stats = new Stats();
//		stats.domElement.style.position = 'absolute';
//		stats.domElement.style.top = '20px';
		divStats.appendChild( stats.domElement );

        
        

  renderer = new THREE.WebGLRenderer ({
    antialias : true,
    clearAlpha : 1.0,
    precision : "highp"
  });
        renderer.setSize( width, height );

        container.appendChild( renderer.domElement );

        //document.addEventListener( 'keypress', onKeyPressEventHandler, false );

    }

	document.onkeypress=function(e){


    	var e= window.event || e;
		var keyunicode = e.charCode;

		var currentPosition = {z:(camera.position.z)};
		var currentz = camera.position.z;

		
		var i = 0;
		var changeDistance = function(){
			camera.position.z = currentPosition.z;

		}



		if(keyunicode === 43){
			var tos = {z: (currentz - 500)};
			var tween = new TWEEN.Tween(currentPosition)
					.to(tos, 2000)
					.delay(0)
					.easing(TWEEN.Easing.Linear.None)
					.onUpdate(changeDistance);
			tween.start();
			}

		
		if(keyunicode === 45){
			var tos = {z: (currentz + 500)};
			var tween = new TWEEN.Tween(currentPosition)
					.to(tos, 2000)
					.delay(0)
					.easing(TWEEN.Easing.Linear.None)
					.onUpdate(changeDistance);
			tween.start();
			}

    }


    function animate() {

        requestAnimationFrame( animate );
        render();
        stats.update();
        TWEEN.update();


    }

    function render() {

        renderer.render( scene, camera );

    }

    function saveOriginalState(){
    	for(var i in animations){
  	    	var anim = animations[i];
  	    	var obj = {};
  	    	obj.obj = anim.obj;
  	    	obj.id = anim.id;
  	    	obj.x0 = anim.x0;
  	    	obj.y0 = anim.y0;
  	    	obj.z0 = anim.z0;
  	    	obj.dx = 0;
  	    	obj.dy = 0;
  	    	obj.dz = 0;
  	    	obj.rx = 0;
  	    	obj.ry = 0;
  	    	obj.rz = 0;
  	    	obj.sx = 1;
  	    	obj.sy = 1;
  	    	obj.sz = 1;
  	    	var trans = [];
  	    	for (var j in anim.transitions) {
  	    		var tt = anim.transitions[j];
  	    		var tr = {};
  	    		tr.t = tt.t;
  	    		tr.t0 = tt.t0;
  	    		tr.t1 = tt.t1;

  	    		if(tt.t === "translate"){
  	    			tr.dxf = tt.dxf;
  	    			tr.dyf = tt.dyf;
  	    			tr.dzf = tt.dzf;
  	    		}

  	    		if(tt.t === "scale"){
  	    			tr.sxf = tt.sxf;
  	    			tr.syf = tt.syf;
  	    			tr.szf = tt.szf;
  	    		}

  	    		if(tt.t === "rotate"){
  	    			tr.dgx = tt.dgx;
  	    			tr.dgy = tt.dgy;
  	    			tr.dgz = tt.dgz;
  	    		}
  	    		trans.push(tr);
  	    		
  	    	}
  	    	obj.transitions = trans;
  	    	animationsCopy.push(obj);

  	    }
    }


    function changeCamera(cam){
    	 camera.position.x = cam.x;
    	 camera.position.y = cam.y;
    	 camera.position.z = cam.z;
    	 camera.lookAt(scene.position);
    }
